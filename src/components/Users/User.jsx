import React, { useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, ImageBackground, StatusBar, Clipboard, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getOtherProfileThunk } from '../../redux/reducers/profileReducer';
import { Preloader } from '../../ui/Preloader';
import { userImg } from '../../../assets/defaultImage';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcons } from '../../ui/AppHeaderIcons';
import { Ionicons } from '@expo/vector-icons';
import { Wrapper } from '../../ui/Wrapper';
import { Block } from '../../ui/Block';
import { unfollowUserThunk, followUserThunk } from '../../redux/reducers/usersReducer';
import { ActivityIndicator } from 'react-native-paper';
import { ActionSheet } from 'native-base';
import { getDialogThunk } from '../../redux/reducers/dialogsReducer';
import { openBrowser } from '../../ui/OpenBrowser';
import * as MediaLibrary from 'expo-media-library';
import { IconBack } from '../../ui/IconBack';

export const User = ({ navigation }) => {
    const dispatch = useDispatch();

    const data = useSelector(state => state.authAPI.data);
    const profile = useSelector(state => state.profileAPI.otherProfile);
    const isDeveloper = useSelector(state => state.profileAPI.isDeveloper);
    const isAdmin = useSelector(state => state.profileAPI.isAdmin);
    const otherLoading = useSelector(state => state.profileAPI.otherLoading);
    const propUser = useSelector(state => state.usersAPI.users);
    const loading = useSelector(state => state.usersAPI.loading);
    const isOnline = useSelector(state => state.usersAPI.isOnline);

    const user = navigation.getParam('user');

    const onlineIndicator = isOnline.some(e => e.id === user.id) ? 'Online' : 'Offline';
    
    const updateUser = propUser.find(u => u.id === user.id);

    useEffect(() => {
        dispatch(getOtherProfileThunk(user.id));
    }, [dispatch, user.id]);
    
    if (!profile || otherLoading || profile.userId !== user.id) {
        return <Preloader />
    }

    const isAdmOwner = isAdmin.some(e => e.id === user.id);
    
    return (
        <ImageBackground style={styles.backImg} loadingIndicatorSource={<Preloader />} source={require('../../../assets/backgroundBeach.png')}>
            <StatusBar barStyle='light-content' />
            <ScrollView>
                <View style={styles.block}>
                    <View style={styles.wrapper}>
                        <View style={styles.titles}>
                            {isAdmOwner
                            ? <Text style={{ ...styles.title, color: '#27AF38' }}>
                                {profile.fullName} (админ)
                            </Text>
                            : !isDeveloper.some(e => e.id === user.id)
                            ? (
                                <Fragment>
                                    <Text style={styles.title}>{profile.fullName}</Text>
                                    <Text style={styles.title}>{profile.userId}</Text>
                                </Fragment>
                            )
                            : (
                                <Fragment>
                                    <Text style={{ ...styles.title, color: '#FF0000' }}>{profile.fullName} (developer)</Text>
                                    <Text style={styles.title}>{profile.userId}</Text>
                                </Fragment>
                            )}
                        </View>
                        <Text style={styles.online_indicator}>{onlineIndicator}</Text>
                        <View style={styles.imgWrap}>
                            <Image style={styles.userImg} source={{
                                uri: profile.photos.large || userImg
                            }} />
                            {user.id !== data.id
                            ? <>{updateUser && <View style={styles.subscribe}>
                                    <Wrapper onPress={
                                        () => updateUser.followed
                                        ? dispatch(unfollowUserThunk(user.id))
                                        : dispatch(followUserThunk(user.id))
                                    }>
                                        <View style={styles.subscribe_block}>
                                            {!loading
                                            ? <><Ionicons
                                                style={styles.subscribe_icon}
                                                name={
                                                    updateUser.followed
                                                    ? 'md-close'
                                                    : 'md-person-add'
                                                } size={24}
                                                color='#fff'
                                            />
                                            <Text style={styles.text}>{
                                                updateUser.followed
                                                ? 'Отписаться'
                                                : 'Подписаться'
                                            }</Text></>
                                            : <ActivityIndicator size='small' color='#fff' />}
                                        </View>
                                    </Wrapper>
                                    <Wrapper onPress={async () => {
                                        await dispatch(getDialogThunk(updateUser.id));
                                        navigation.navigate('Dialog', { dialogData: updateUser });
                                    }}>
                                        <View style={styles.subscribe_block}>
                                            <Ionicons
                                                style={styles.subscribe_icon}
                                                name='md-mail' size={24}
                                                color='#fff'
                                            />
                                            <Text style={styles.text}>Сообщение</Text>
                                        </View>
                                    </Wrapper>
                                </View>}</>
                            : null}
                        </View>
                        {profile.aboutMe
                        ? <Block color='#fff' style={styles.text} title='статус:' value={profile.aboutMe} />
                        : <Text style={{ ...styles.text, textAlign: 'center' }}>статус не указан</Text>}
                        {profile.lookingForAJobDescription
                        ? (
                            <Fragment>
                                <Text style={styles.text}>о себе:</Text>
                                <Text style={{ color: '#fff' }}>{profile.lookingForAJobDescription}</Text>
                            </Fragment>
                        )
                        : <Text style={styles.nullInfo}>информация о пользователе не указана</Text>}
                        <Block color='#fff' style={styles.text} title='нужда в работе:' value={
                            profile.lookingForAJob ? 'ДА' : 'НЕТ'
                        } />
                        <View style={styles.social_networks}>
                            {Object.keys(profile.contacts).map(e => {
                                if (profile.contacts[e]) {
                                    return (
                                        <View key={e}>
                                            <Block color='#ccc' style={styles.text} value={profile.contacts[e]} title={e} />
                                        </View>
                                    )
                                }
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

User.navigationOptions = ({ navigation }) => {
    const user = navigation.getParam('user');
    const url = `https://hariesjs.github.io/React/#/profile/${user.id}`;
    return {
        headerTitle: user.name || user.userName,
        headerLeft: () => <IconBack nav={navigation} />,
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={AppHeaderIcons}>
                <Item
                    title='user-more'
                    iconName='ios-more'
                    onPress={() => {
                        ActionSheet.show(
                            {
                                options: ['Скопировать ссылку', 'Сохранить аватар', 'Открыть в веб-версии', 'Заблокировать', 'Отменить'],
                                cancelButtonIndex: 4,
                                destructiveButtonIndex: 3,
                                title: 'Допольнительно'
                            },
                            buttonIndex => {
                                switch (buttonIndex) {
                                    case 0:
                                        Clipboard.setString(url);
                                        break;
                                    case 1:
                                        Platform.OS === 'ios' && MediaLibrary.saveToLibraryAsync(user.photos.large && user.photos.large.substring(0, user && user.photos.large.length - 4) || userImg);
                                        break;
                                    case 2:
                                        openBrowser(url);
                                        break;
                                    case 3:
                                        break;
                                    default:
                                        break;
                                }
                            }
                        )
                    }}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    backImg: {
        width: '100%',
        height: '100%'
    },
    block: {
        marginHorizontal: Dimensions.get('window').width / 20,
        margin: '5%'
    },
    wrapper: {
        backgroundColor: 'rgba(57,89,171,0.8)',
        padding: '10%',
        shadowOpacity: 0.8,
        shadowOffset: {},
        elevation: 8
    },
    titles: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    userImg: {
        width: Dimensions.get('window').width / 2,
        height: Dimensions.get('window').height / 3.6,
        marginBottom: '10%'
    },
    imgWrap: {
        alignItems: 'center',
        margin: '10%',
    },
    title: {
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: 20
    },
    text: {
        color: '#fff',
        textTransform: 'uppercase'
    },
    social_block: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    social_networks: {
        paddingTop: Dimensions.get('window').height / 30
    },
    subscribe_block: {
        backgroundColor: 'cornflowerblue',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginHorizontal: 5
    },
    subscribe_icon: {
        paddingHorizontal: '2%'
    },
    online_indicator: {
        color: 'cornflowerblue',
        textAlign: 'center',
        paddingVertical: '2%'
    },
    subscribe: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nullInfo: {
        color: '#fff',
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: '1%'
    }
})