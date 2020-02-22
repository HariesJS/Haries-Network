import React, { useEffect, Fragment, useCallback, useState } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, ImageBackground, StatusBar, Dimensions, RefreshControl } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcons } from '../../ui/AppHeaderIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileThunk } from '../../redux/reducers/profileReducer';
import { userImg } from '../../../assets/defaultImage';
import { Preloader } from '../../ui/Preloader';
import { Block } from '../../ui/Block';
import { Avatar } from 'react-native-elements';
import { postOnlineThunk } from '../../redux/reducers/usersReducer';
// import PushNotification from 'react-native-push-notification';
import { Notifications } from 'expo';
// ПОЛУЧИТЬ API-KEY FROM SERVER; APPLE & ANDROID ICONS TO ONLINE && BACK ICON SINGLE

export const Profile = () => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profileAPI.profile);
    const data = useSelector(state => state.authAPI.data);
    const isOnline = useSelector(state => state.usersAPI.isOnline);
    
    const [refresh, setRefresh] = useState(false);

    const loadProfile = useCallback(() => {
        dispatch(getProfileThunk(data.id));
        if (isOnline.length) {
            !isOnline.find(({ id }) => id === data.id)
            && dispatch(postOnlineThunk(data.id.toString()));
        }
    }, [dispatch, isOnline.length, data.id]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (!profile || profile.userId !== data.id) {
        return <Preloader />
    }

    const onRefresh = async () => {
        setRefresh(true);
        await loadProfile();
        setRefresh(false);
    }

    const UserImage = profile.photos.large ? Avatar : Image;

    return (
        <ImageBackground
            style={styles.backImg}
            source={require('../../../assets/backgroundHolmes.png')}
        >
            <StatusBar barStyle='light-content' />
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={['#3959ab']}
                    tintColor='#3959ab'
                />
            }>
                <View style={styles.block}>
                    <View style={styles.title_block}>
                        <UserImage source={{
                            uri: profile.photos.large || userImg
                        }} style={styles.userImg} />
                        <View style={styles.titles}>
                            <Text style={styles.title}>{profile.fullName}</Text>
                            <Text style={styles.title}>({profile.userId})</Text>
                        </View>
                    </View>
                    <View style={styles.hr_line}></View>
                    <View style={styles.user_info_block}>
                        {profile.aboutMe
                        ? <Block style={styles.text} title='статус:' value={profile.aboutMe} />
                        : <Text style={styles.targetNull}>у вас не указан статус</Text>}
                        {profile.lookingForAJobDescription
                        ? (
                            <Fragment>
                                <Text style={styles.text}>обо мне:</Text>
                                <Text>{profile.lookingForAJobDescription}</Text>
                            </Fragment>
                        )
                        : <Text style={styles.targetNull}>информация о вас не указана</Text>}
                        <Block style={styles.text} title='нужда в работе:' value={
                            profile.lookingForAJob ? 'ДА' : 'НЕТ'
                        } />
                        <View style={styles.social_block}>
                            {Object.keys(profile.contacts).map(e => (
                                <View key={e}>{profile.contacts[e] && (
                                    <Block title={e + ':'} value={profile.contacts[e]} />
                                )}</View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.hr_line}></View>
                    <View>
                        <Text style={styles.subscribe_title}>подписки</Text>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    )
}

Profile.navigationOptions = ({ navigation }) => ({
    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={AppHeaderIcons}>
            <Item
                title='user-options'
                iconName='ios-menu'
                onPress={() => navigation.toggleDrawer()}
            />
        </HeaderButtons>
    ),
    headerTitle: 'Мой профиль'
})

const styles = StyleSheet.create({
    backImg: {
        width: '100%',
        height: '100%'
    },
    block: {
        margin: '5%',
        paddingBottom: 100,
    },
    userImg: {
        width: Dimensions.get('window').width / 2.7,
        height: 150,
        shadowOpacity: 0.2,
        shadowOffset: {}
    },
    title_block: {
        flexDirection: 'row',
    },
    titles: {
        padding: '5%'
    },
    title: {
        textTransform: 'uppercase',
        fontSize: 19,
    },
    hr_line: {
        backgroundColor: '#ccc',
        width: '100%',
        height: 1,
        marginTop: '10%'
    },
    user_info_block: {
        margin: '5%'
    },
    text: {
        textTransform: 'uppercase'
    },
    social_block: {
        paddingTop: '5%'
    },
    subscribe_title: {
        textTransform: 'uppercase',
        fontSize: 19,
        textAlign: 'center',
        margin: '2%',
    },
    targetNull: {
        textTransform: 'uppercase',
        textAlign: 'center'
    }
})