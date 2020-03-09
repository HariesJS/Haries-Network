import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, RefreshControl } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcons } from '../../ui/AppHeaderIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getDialogsThunk, getDialogThunk, postMessageThunk } from '../../redux/reducers/dialogsReducer';
import { userImg } from '../../../assets/defaultImage';
import { Wrapper } from '../../ui/Wrapper';
import { Search } from '../../ui/Search';
import { Preloader } from '../../ui/Preloader';
import { Badge } from 'react-native-elements';
import { LeftAction } from '../../ui/SwipeBlock';

export const Dialogs = ({ navigation }) => {
    const dispatch = useDispatch();
    const dialogs = useSelector(state => state.dialogsAPI.dialogs);
    const isLoad = useSelector(state => state.dialogsAPI.isLoad);

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        dispatch(getDialogsThunk());
    }, [dispatch, getDialogsThunk]);

    const openDialog = dialog => {
        dispatch(getDialogThunk(dialog.id));
        navigation.navigate('Dialog', { dialogData: dialog });
    }

    const refreshDialogs = async () => {
        setRefresh(true);
        await dispatch(getDialogsThunk());
        setRefresh(false);
    }

    if (isLoad) {
        return <Preloader />
    }

    if (!dialogs.length) {
        return (
            <View style={styles.nullDialogs}>
                <Text>У вас пока что нету диалогов.</Text>
            </View>
        )
    }

    const fastSendMessage = async (user, message) => {
        await dispatch(postMessageThunk(user.id, message));
        dispatch(getDialogsThunk());
    }

    return (
        <ScrollView refreshControl={(
            <RefreshControl
                onRefresh={refreshDialogs}
                refreshing={refresh}
                colors={['#3959ab']}
                tintColor='#3959ab'
            />
        )}>
            <View>
                <Search option={true} />{
                dialogs.map(e => {
                    return (
                        <Swipeable
                            renderLeftActions={(progress, dragX) =>
                            <><LeftAction
                                onPress={() => fastSendMessage(e, 'Привет')}
                                progress={progress} dragX={dragX}
                                name='Привет'
                                icon='smile-circle'
                                color='#388e3e'
                            />
                            <LeftAction
                                onPress={() => fastSendMessage(e, 'Как дела?')}
                                progress={progress}
                                dragX={dragX}
                                name='Как дела?'
                                icon='aliwangwang'
                                color='#3999ab'
                            /></>}
                            key={e.id}
                        >
                            <Wrapper onPress={() => openDialog(e)} style={styles.wrapper}>
                                <View style={styles.dialogBlock}>
                                    <View style={styles.contentBlock}>
                                        <View style={styles.alignStyle}>
                                            <Text>
                                                {new Date(e.lastDialogActivityDate).toDateString()}
                                            </Text>
                                            {e.hasNewMessages
                                            && <Badge
                                                    containerStyle={styles.badgePosition}
                                                    textStyle={styles.badgeSize}
                                                    badgeStyle={styles.badgeStyle}
                                                    value={e.newMessagesCount}
                                                />}
                                        </View>
                                        <Text style={styles.friendName}>{e.userName}</Text>
                                    </View>
                                    <Image
                                        source={{ uri: e.photos.large || userImg }}
                                        style={styles.image}
                                    />
                                </View>
                            </Wrapper>
                        </Swipeable>
                    );
                })
            }</View>
        </ScrollView>
    )
}

Dialogs.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: 'Сообщения',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={AppHeaderIcons}>
                <Item
                    title='add-dialog'
                    iconName='ios-add-circle'
                    onPress={() => navigation.navigate('Users')}
                />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 75,
        height: 75,
        borderRadius: 100
    },
    dialogBlock: {
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        padding: '1%'
    },
    friendName: {
        fontSize: 18,
        padding: 5
    },
    nullDialogs: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapper: {
        backgroundColor: '#fff'
    },
    contentBlock: {
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    alignStyle: {
        alignItems: 'center'
    },
    badgePosition: {
        marginTop: '15%'
    },
    badgeSize: {
        fontSize: 15
    },
    badgeStyle: {
        width: 25,
        height: 25,
        borderRadius: 30,
        backgroundColor: '#3959ab'
    }
})