import React from 'react';
import { Button } from 'react-native-elements';
import { ImageBackground, ScrollView, StyleSheet, Text, Dimensions, Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuthThunk } from '../redux/reducers/authReducer';
import { deleteOnlineThunk } from '../redux/reducers/usersReducer';
import { ActionSheet } from 'native-base';

const Title = ({ name, prop = false, exit = false, onPress, ...props }) => (
    <Button
        buttonStyle={{
            marginTop: Dimensions.get('window').height / prop ? 60 : 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        {...props}
        title={name}
        onPress={onPress}
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
            <ScrollView>
                <Title
                    prop={true}
                    name='Мой аккаунт'
                    onPress={() => navigation.toggleDrawer()}
                />
                <Title
                    name='Редактировать'
                    onPress={() => navigation.navigate('ProfileEdit', { profile })}
                />
                <View style={styles.exitWrap}>
                    <Title name='О приложении' exit={true} />
                    <Title
                        titleStyle={{ color: 'red' }}
                        name='Выйти'
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
        marginTop: Dimensions.get('window').height / 3.2
    },
    beta: {
        color: '#ccc',
        textAlign: 'center',
        paddingTop: '5%',
        paddingBottom: '5%'
    }
})