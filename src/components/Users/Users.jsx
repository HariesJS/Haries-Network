import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, FlatList, ImageBackground, StatusBar, RefreshControl, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-elements';
import { getUsersThunk, loadMoreThunk } from '../../redux/reducers/usersReducer';
import { Wrapper } from '../../ui/Wrapper';
import { userImg } from '../../../assets/defaultImage';
import { Preloader } from '../../ui/Preloader';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcons } from '../../ui/AppHeaderIcons';
import { ActivityIndicator } from 'react-native-paper';
import { Pagination } from '../../ui/Pagination';

export const Users = ({ navigation }) => {
    const dispatch = useDispatch();

    const users = useSelector(state => state.usersAPI.users);
    const isOnline = useSelector(state => state.usersAPI.isOnline);
    

    const isDeveloper = useSelector(state => state.profileAPI.isDeveloper);
    const isAdmin = useSelector(state => state.profileAPI.isAdmin);
    const data = useSelector(state => state.authAPI.data);

    const [page, setPage] = useState(3);
    const [isSearch, setIsSearch] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setParams({ isSearch, setIsSearch });
    }, [isSearch, setIsSearch]);

    const loadUsers = useCallback(() => {
        setPage(2);
        dispatch(getUsersThunk());
    }, [dispatch]);
    
    useEffect(() => {
        loadUsers();
    }, [loadUsers, isOnline]);

    const onRefresh = async () => {
        setIsSearch(false);
        setRefresh(true);
        await loadUsers();
        setRefresh(false);
    }

    const openProfile = user => {
        navigation.navigate('User', { user });
        setIsSearch(false);
    }

    const loadMore = async () => {
        setPage(page + 1);
        setLoading(true);
        await dispatch(loadMoreThunk(page));
        setLoading(false);
    }

    const openNewPage = p => {
        dispatch(getUsersThunk(p));
    }

    const renderLoader = () => (
        <>{<View style={styles.renderView}>
            {Platform.OS === 'ios'
            ? <ActivityIndicator size='small' color='#fff' />
            : <Button
                title='Загрузить больше'
                onPress={loadMore}
                buttonStyle={{ backgroundColor: '#3959ab' }}
                disabledStyle={{ backgroundColor: '#3959ab' }}
                loading={loading}
                disabled={loading}
            />}
        </View>}</>
    )

    return (
        <ImageBackground
            style={styles.backImg}
            source={require('../../../assets/backgroundLa.png')}
        >
            {isSearch &&
            <View style={styles.searchStyle}>
                <Pagination onPage={openNewPage} />
            </View>}
            {users.length
            ? <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                            colors={['#3959ab']}
                            tintColor='#fff'
                        />
                    }
                    keyExtractor={item => item.id.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0}
                    ListFooterComponent={renderLoader}
                    data={users.filter(e => e.id !== data.id)}
                    renderItem={({ item }) => (
                        <Wrapper
                            onPress={() => openProfile(item)}
                            key={item.id}
                            activeOpacity={0.6}
                        >
                            <View style={styles.block}>
                                <View style={styles.titles}>
                                    {isOnline.some(e => e.id === item.id)
                                    ? <Text style={styles.online}>ONLINE</Text>
                                    : <Text style={styles.offline}>OFFLINE</Text>}
                                    {isDeveloper.some(e => e.id === item.id)
                                    ? <Text style={{ ...styles.name, color: '#FF0000' }}>{item.name}</Text>
                                    : isAdmin.some(e => e.id === item.id)
                                    ? <Text style={{ ...styles.name, color: '#27AF38' }}>{item.name}</Text>
                                    : <Text style={styles.name}>{item.name}</Text>}
                                    <Text style={styles.userId}>{item.id}</Text>
                                    <Text
                                        style={item.status
                                        && item.status.length < 20
                                        ? { display: 'flex' }
                                        : { display: 'none' }}>
                                            {item.status
                                            && <Text style={styles.name}>
                                                {item.status}
                                            </Text>}
                                    </Text>
                                </View>
                                <Image style={styles.userImage} source={{
                                    uri: item.photos.large || userImg
                                }} />
                            </View>
                        </Wrapper>
                    )}
                />
            : <Preloader color='#fff' />}
            <StatusBar barStyle='light-content' />
        </ImageBackground>
    )
}

Users.navigationOptions = ({ navigation }) => {
    const isSearch = navigation.getParam('isSearch');
    const setIsSearch = navigation.getParam('setIsSearch');

    return {
        headerTitle: 'Пользователи',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={AppHeaderIcons}>
                <Item
                    title='change-search'
                    iconName={!isSearch ? 'md-options' : 'ios-close-circle'}
                    onPress={() => setIsSearch(!isSearch)}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <Text style={styles.date_now}>{new Date().toLocaleDateString()}</Text>
        )
    }
}

const styles = StyleSheet.create({
    backImg: {
        width: '100%',
        height: '100%'
    },
    block: {
        justifyContent: 'space-between',
        paddingHorizontal: Dimensions.get('window').width / 7,
        flexDirection: 'row-reverse',
        backgroundColor: 'rgba(57,89,171,0.7)',
        margin: '2%',
        padding: '2%',
        shadowOpacity: 0.6,
        shadowOffset: {},
        borderRadius: 20,
        elevation: 8
    },
    name: {
        textTransform: 'uppercase',
        color: '#fff'
    },
    userImage: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').height / 6
    },
    titles: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    date_now: {
        color: '#fff',
        fontSize: 18,
        padding: 10
    },
    renderView: {
        alignItems: 'center',
        padding: '1%'
    },
    searchStyle: {
        backgroundColor: 'rgba(57,89,171,0.9)',
        alignItems: 'center'
    },
    online: {
        color: 'aqua'
    },
    offline: {
        color: '#ccc'
    },
    userId: {
        color: '#fff'
    }
})