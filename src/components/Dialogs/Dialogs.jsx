import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, RefreshControl, Dimensions } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcons } from '../../ui/AppHeaderIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getDialogsThunk, getDialogThunk } from '../../redux/reducers/dialogsReducer';
import { userImg } from '../../../assets/defaultImage';
import { Wrapper } from '../../ui/Wrapper';
import { Search } from '../../ui/Search';
import { Preloader } from '../../ui/Preloader';
import { Badge } from 'react-native-elements';

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>У вас пока что нету диалогов.</Text>
            </View>
        )
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
                        <Wrapper key={e.id} onPress={() => openDialog(e)}>
                            <View style={styles.dialogBlock}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{
                                        alignItems: 'center'
                                    }}>
                                        <Text>
                                            {new Date(e.lastDialogActivityDate).toDateString()}
                                        </Text>
                                        {e.hasNewMessages && <Badge containerStyle={{ marginTop: '15%' }} textStyle={{ fontSize: 15 }} badgeStyle={{ width: 25, height: 25, borderRadius: 30, backgroundColor: '#3959ab' }} value={e.newMessagesCount} />}
                                    </View>
                                    <Text style={styles.friendName}>{e.userName}</Text>
                                </View>
                                <Image
                                    source={{ uri: e.photos.large || userImg }}
                                    style={styles.image}
                                />
                            </View>
                        </Wrapper>
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
                <Item title='add-dialog' iconName='ios-add-circle' onPress={() => navigation.navigate('Users')} />
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
    }
})