import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Image, Keyboard, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Preloader } from '../../ui/Preloader';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Wrapper } from '../../ui/Wrapper';
import { userImg } from '../../../assets/defaultImage';
import { ActionSheet } from 'native-base';
import { postMessageThunk, getDialogsThunk } from '../../redux/reducers/dialogsReducer';
import { IconBack } from '../../ui/IconBack';

export const Dialog = ({ navigation }) => {
    const dispatch = useDispatch();
    const dialogData = navigation.getParam('dialogData');

    const dialog = useSelector(state => state.dialogsAPI.dialog);
    const isLoad = useSelector(state => state.dialogsAPI.isLoad);

    const [isKeyboard, setIsKeyboard] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            keyboardDidShow
        );
        let keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            keyboardDidHide
        )
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            dispatch(getDialogsThunk());
        }
    }, []);

    const keyboardDidShow = () => {
        setIsKeyboard(true);
    }

    const keyboardDidHide = () => {
        setIsKeyboard(false);
    }

    const sendMessage = async () => {
        if (message.trim()) {
            await dispatch(postMessageThunk(dialogData.id, message));
            setMessage('');
        }
    }

    if (isLoad) {
        return <Preloader />
    }

    return (
        <View style={{
            ...styles.wrapper,
            bottom: isKeyboard
            ? Dimensions.get('window').height / 2.5
            : 0
        }}>
            <View>
                {dialog.length
                ? <ScrollView>
                    <View style={styles.dialogAdaptive}></View>
                    <Text style={styles.dateTitle}>
                        Это вся история сообщений с пользователем.
                    </Text>{
                    dialog.map(e => {
                        const isSender = e.senderId === dialogData.id;
                        return (
                            <View style={{
                                ...styles.dialog,
                                alignItems: e.senderId === dialogData.id
                                ? 'flex-start'
                                : 'flex-end'
                            }} key={e.id}>
                                <View style={{
                                    ...styles.message,
                                    backgroundColor: isSender
                                    ? '#fff'
                                    : '#3959ab',
                                    [
                                        isSender
                                        ? 'marginRight'
                                        : 'marginLeft'
                                    ]: Dimensions.get('window').width / 5
                                }}>
                                    <Text style={{
                                        ...styles.msgText,
                                        color: isSender ? '#000' : '#fff',
                                    }}>{e.body}</Text>
                                    <Text style={{
                                        fontSize: 11,
                                        color: '#ccc',
                                        textAlign: 'right',
                                    }}>
                                        {new Date(e.addedAt).getHours()}:{new Date(e.addedAt).getMinutes()}
                                        {!isSender && <AntDesign name={
                                            e.viewed
                                            ? 'eye'
                                            : 'eyeo'
                                        } />}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }</ScrollView>
                : (
                    <View style={styles.nullDialog}>
                        <MaterialCommunityIcons
                            name='message-text'
                            size={100}
                            color='#ccc'
                        />
                        <Text style={styles.messageHistory}>История сообщений пуста.</Text>
                    </View>
                )}
            </View>
            <View>
                <View style={styles.inputBlock}>
                    <TouchableOpacity 
                        onPress={() => {
                            ActionSheet.show({
                                options: ['Открыть галлерею', 'Отменить'],
                                cancelButtonIndex: 1,
                                title: `Выбрать файлы для отправки`
                            },
                            buttonIndex => {
                                switch (buttonIndex) {
                                    case 0:
                                        break;
                                    default:
                                        break;
                                }
                            })
                        }}
                    >
                        <AntDesign
                            name='paperclip'
                            size={30}
                            color='#3959ab'
                        />
                    </TouchableOpacity>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder='Сообщение'
                        placeholderTextColor='gray'
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={sendMessage}>
                        <Feather name='send' size={30} color='#3959ab' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

Dialog.navigationOptions = ({ navigation }) => {
    const dialogData = navigation.getParam('dialogData');

    let dialog = dialogData;

    return {
        headerTitle: () => (
            <View style={{
                alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start'
            }}>
                <Text style={styles.dialogUserName}>{dialog.userName || dialog.name}</Text>
                <Text style={{ color: '#ccc' }}>
                    <>{
                        dialog.lastUserActivityDate
                        ? new Date(dialog.lastUserActivityDate).toLocaleString()
                        : 'Активность неизвестна'
                    }</>
                </Text>
            </View>
        ),
        headerLeft: () => <IconBack nav={navigation} />,
        headerRight: () => (
            <Wrapper onPress={() => navigation.navigate('User', { user: dialog })}>
                <Image
                    source={{ uri: dialog.photos.large || userImg }}
                    style={styles.headerImage}
                />
            </Wrapper>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    dialog: {
        shadowOpacity: 0.3,
        shadowOffset: {},
    },
    message: {
        padding: '3%',
        margin: '3%',
        elevation: 8,
        borderRadius: 20,
    },
    msgText: {
        fontSize: 17,
    },
    input: {
        backgroundColor: '#ccc',
        borderRadius: 100,
        backgroundColor: '#ccc',
        padding: 15,
        marginVertical: 30,
        width: Dimensions.get('window').width / 1.5
    },
    inputBlock: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    headerImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        right: '20%'
    },
    dialogAdaptive: {
        paddingTop: Dimensions.get('window').height / 5
    },
    dateTitle: {
        textAlign: 'center',
        fontSize: 15,
        color: 'grey'
    },
    nullDialog: {
        bottom: Dimensions.get('window').height / 3.5,
        alignItems: 'center'
    },
    messageHistory: {
        textAlign: 'center',
        fontSize: 18,
        color: 'grey'
    },
    dialogUserName: {
        color: '#fff',
        fontSize: 16
    }
})