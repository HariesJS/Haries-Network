import React from 'react';
import { Button } from 'react-native-elements';
import { ImageBackground, ScrollView, Image, StyleSheet, Text, Dimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuthThunk } from '../redux/reducers/authReducer';
import { deleteOnlineThunk } from '../redux/reducers/usersReducer';
import { ActionSheet } from 'native-base';
import { userImg } from '../../assets/defaultImage';
import { MaterialIcons } from '@expo/vector-icons';

const Title = ({ name, prop = false, onPress, iconName, ...props }) => (
    <Button
        buttonStyle={{
            ...styles.buttonStyle,
            marginTop: Dimensions.get('window').height / prop ? 40 : 0,
        }}
        {...props}
        title={name}
        onPress={onPress}
        iconContainerStyle={{  }}
        icon={() => <MaterialIcons name={iconName} size={24} color='#fff' />}
    />
)

export const CustomDrawerComponent = ({ navigation }) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profileAPI.profile);
    const isOnline = useSelector(state => state.usersAPI.isOnline);
    const data = useSelector(state => state.authAPI.data);

    const offline = isOnline.find(e => e.id === data.id);

    const logoutMe = () => {
        ActionSheet.show(
            {
                options: ['Выйти', 'Отменить'],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
                title: `Вы уверены, что хотите выйти из своего аккаунта?\nОн будет локально сохранен на вашем устройстве.`
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        dispatch(logoutAuthThunk());
                        dispatch(deleteOnlineThunk(offline.key));
                        break;
                    default:
                        break;
                }
            }
        )
    }

    return (
        <ImageBackground
            style={styles.imgWrap}
            source={require('../../assets/backgroundMenu.png')}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.viewAlign}>
                    <Image 
                        source={{ uri: profile && profile.photos.large || userImg }}
                        style={styles.image}
                    />
                </View>
                <Title
                    prop={true}
                    name='Мой аккаунт'
                    iconName='account-circle'
                    onPress={() => navigation.toggleDrawer()}
                />
                <Title
                    name='Редактировать'
                    iconName='edit'
                    onPress={() => navigation.navigate('ProfileEdit', { profile })}
                />
                <Title
                    name='Геоданные'
                    iconName='location-on'
                    onPress={() => navigation.navigate('Geolocation')}
                />
                <View style={styles.exitWrap}>
                    <Title
                        name='О приложении'
                        iconName='info'
                        onPress={() => navigation.navigate('AboutApp')}
                    />
                    <Title
                        titleStyle={{ color: 'red' }}
                        name='Выйти'
                        iconName='exit-to-app'
                        onPress={logoutMe}
                    />
                </View>
                <Text style={styles.beta}>beta 1.0.0</Text>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    imgWrap: {
        width: '100%',
        height: '100%'
    },
    exitWrap: {
        marginTop: Dimensions.get('window').height / 5
    },
    beta: {
        color: '#ccc',
        textAlign: 'center',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    buttonStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderRadius: 0
    },
    viewAlign: {
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: Dimensions.get('window').height / 15
    }
})