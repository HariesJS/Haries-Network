import React from 'react';
import { View, Dimensions, StyleSheet, Image, Text, ScrollView, Platform } from 'react-native';
import { Video } from 'expo-av';
import { openBrowser } from '../ui/OpenBrowser';
import { IconBack } from '../ui/IconBack';

export const AboutApp = () => {
    const Title = ({ children }) => (
        <Text style={styles.textInfo}>
            {children}
        </Text>
    )
    return (
        <View>
            <Video
                source={{
                    uri:
                    Platform.OS === 'android'
                    ? 'https://firebasestorage.googleapis.com/v0/b/haries-network.appspot.com/o/videoplayback.mp4?alt=media&token=ba9256e5-8079-4047-9b2c-f8ad2a49fefc'
                    : 'https://firebasestorage.googleapis.com/v0/b/haries-network.appspot.com/o/nightCity.mp4?alt=media&token=d3b125bf-f873-4f38-a01c-723ab74ae504'
                }}
                rate={1.0}
                isMuted={true}
                resizeMode='cover'
                shouldPlay={true}
                isLooping
                style={styles.video}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Image style={styles.image} source={require('../../assets/hn-logo.png')} />
                    <Title>
                        HARIES NETWORK (HN) - это небольшая социальная сеть,
                        созданная в качестве портфолио и продолжения идеи
                        веб-версии, но уже с новым функционалом.
                    </Title>
                    <Title>
                        Основа фундамента - Back-End, который был взят
                        у <Text
                            onPress={() => openBrowser('https://social-network.samuraijs.com')} style={styles.link}>Social Network API</Text>.
                    </Title>
                    <Title>
                        Из портфолио также есть <Text onPress={() => openBrowser('https://hariesjs.github.io/React')} style={styles.link}>веб-версия</Text> данной социальной
                        сети и полноценный список дел (to-do-list), написанный
                        с помощью Firebase.
                    </Title>
                    <Video
                        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/haries-network.appspot.com/o/todo.mp4?alt=media&token=e0995077-2940-4244-b55b-5d65226be50d' }}
                        rate={1.0}
                        isMuted={true}
                        resizeMode='cover'
                        useNativeControls
                        isLooping
                        style={styles.todoVideo}
                    />
                    <Title>
                        Приложение написано на React Native и Redux (веб-версия
                        на React & Redux) в основе.
                        Также используется многочисленное количество библиотек
                        в приложении.
                    </Title>
                </View>
            </ScrollView>
        </View>
    )
}

AboutApp.navigationOptions = ({ navigation }) => ({
    headerTitle: 'Информация',
    headerLeft: () => <IconBack nav={navigation} />
})

const styles = StyleSheet.create({
    video: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    content: {
        marginTop: Dimensions.get('window').height / 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5%',
        alignItems: 'center',
        margin: 10
    },
    textInfo: {
        color: '#fff',
        fontSize: 20,
        margin: '5%',
        textAlign: 'center'
    },
    link: {
        color: '#3999ab',
        textDecorationLine: 'underline'
    },
    todoVideo: {
        width: Dimensions.get('window').width / 1.1,
        height: Dimensions.get('window').height / 4
    },
    image: {
        width: 120,
        height: 120
    }
})