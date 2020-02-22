import React, { useEffect, Fragment } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, ImageBackground, StatusBar, Clipboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getOtherProfileThunk, deleteAdminThunk, setAdminThunk } from '../../redux/reducers/profileReducer';
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

    const changeUser = () => {
        if (!isAdmOwner) {
            dispatch(setAdminThunk(user.id));
        } else if (isAdmOwner) {
            isAdmin.map(e => {
                if (e.id === user.id) {
                    dispatch(deleteAdminThunk(e.key));
                }
            });
        }
    }
    
    return (
        <ImageBackground style={styles.backImg} loadingIndicatorSource={<Preloader />} source={require('../../../assets/backgroundBeach.png')}>
            <StatusBar barStyle='light-content' />
            <ScrollView>
                <View style={styles.block}>
                    <View style={styles.wrapper}>
                        <View style={styles.titles}>
                            {isAdmOwner
                            ? <Text style={{ ...styles.title, color: '#27AF38' }}>{profile.fullName} (админ)</Text>
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
                            ? <>{updateUser && <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
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
                            {isDeveloper.some(e => e.id === data.id && e.id !== user.id)
                            && <Wrapper onPress={changeUser}>
                                <View style={{
                                    ...styles.subscribe_block,
                                    marginTop: 10,
                                    backgroundColor: !isAdmOwner ? '#27AF38' : '#C51518'                                
                                }}>
                                    {true
                                    ? <><Ionicons
                                        style={styles.subscribe_icon}
                                        name={
                                            isAdmOwner
                                            ? 'md-close-circle-outline'
                                            : 'md-add-circle-outline'
                                        } size={24}
                                        color='#fff'
                                    />
                                    <Text style={styles.text}>{
                                        isAdmOwner
                                        ? 'Снять админа'
                                        : 'Назначить админом'
                                    }</Text></>
                                    : <ActivityIndicator size='small' color='#fff' />}
                                </View>
                            </Wrapper>}
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
                        : <Text style={{ ...styles.text, textAlign: 'center', padding: '1%' }}>информация о пользователе не указана</Text>}
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
    return {
        headerTitle: user.name || user.userName,
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={AppHeaderIcons}>
                <Item
                    title='user-more'
                    iconName='ios-more'
                    onPress={() => {
                        ActionSheet.show(
                            {
                                options: ['Скопировать ссылку', 'Сохранить аватар', 'Заблокировать', 'Отменить'],
                                cancelButtonIndex: 3,
                                destructiveButtonIndex: 2,
                                title: 'Допольнительно'
                            },
                            buttonIndex => {
                                switch (buttonIndex) {
                                    case 0:
                                        const url = `https://social-network.samuraijs.com/api/1.0/profile/${user.id}`
                                        Clipboard.setString(url);
                                        break;
                                    case 1:
                                        console.log(200);
                                        break;
                                    case 2:
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
        height: Dimensions.get('window').height / 4,
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
    }
})