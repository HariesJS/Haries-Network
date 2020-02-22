import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, StatusBar, Alert, ScrollView, Keyboard } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Field, reduxForm } from 'redux-form';
import { InputRender } from '../redux/reduxForm/formsControl';
import { requireField } from '../redux/reduxForm/validators';
import { Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { postAuthThunk, setCaptchaCreator } from '../redux/reducers/authReducer';
import { Wrapper } from '../ui/Wrapper';
import { Captcha } from '../ui/Captcha';

const Login = ({ handleSubmit, error }) => {
    const dispatch = useDispatch();

    const loading = useSelector(state => state.authAPI.loading);
    const captcha = useSelector(state => state.authAPI.captcha);

    const [isKeyboard, setIsKeyboard] = useState(false);

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
        }
    }, []);

    const keyboardDidShow = () => {
        setIsKeyboard(true);
    }

    const keyboardDidHide = () => {
        setIsKeyboard(false);
    }
    
    useEffect(() => {
        return () => dispatch(setCaptchaCreator(null));
    }, []);

    const [showPassword, setShowPassword] = useState(true);
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [modal, setModal] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');

    const onSubmit = e => {
        dispatch(postAuthThunk(e.email, e.password, captchaValue));
        setCaptchaValue('');
    }

    const Error = captcha ? Wrapper : View;

    const Scroll = error ? ScrollView : View;

    return (
        <View style={{
            ...styles.block,
            bottom: isKeyboard
            ? Dimensions.get('window').height / 10
            : 0
        }}>
            <StatusBar barStyle='light-content' />
            <ImageBackground
                style={styles.backImg}
                source={require('../../assets/backgroundCity.png')}
            >
                <Text style={styles.title}>Haries Network</Text>
                <View style={styles.wrapper}>
                    <View style={{
                        top: '9%',
                        left: '15%',
                    }}>
                        <MaterialIcons
                            size={24}
                            color={emailValue ? '#fff' : '#ccc'}
                            name='email'
                        />
                    </View>
                    <Field
                        name='email'
                        validate={[requireField]}
                        value={emailValue}
                        onChangeText={setEmailValue}
                        keyboardType='email-address'
                        component={InputRender}
                        placeholder='E-mail'
                        autoCapitalize='words'
                        maxLength={30}
                    />
                    <View style={{
                        top: '9%',
                        left: '15%',
                    }}>
                        <MaterialIcons
                            size={24}
                            color={passwordValue ? '#fff' : '#ccc'}
                            name='vpn-key'
                        />
                    </View>
                    <View style={styles.password_block}>
                        <View style={{ width: '100%' }}>
                            <Field
                                name='password'
                                validate={[requireField]}
                                component={InputRender}
                                placeholder='Password'
                                secureTextEntry={showPassword}
                                value={passwordValue}
                                onChangeText={setPasswordValue}
                                maxLength={30}
                            />
                        </View>
                        {passwordValue.length > 0 && (
                            <Entypo
                                style={styles.showButton}
                                name={
                                    showPassword
                                    ? 'eye'
                                    : 'eye-with-line'
                                }
                                color='#fff'
                                size={24}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        )}
                    </View>
                    <Scroll>
                        <Error onPress={() => captcha && setModal(true)}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(217, 17, 17, 0.8)',
                                justifyContent: 'center',
                                marginBottom: Dimensions.get('window').height / 30,
                                opacity: error ? 1 : 0
                            }}>
                                <MaterialIcons name='error' size={24} color='#fff' />
                                <Text
                                    style={{
                                    color: '#fff',
                                    fontSize: 20,
                                    padding: '1%',
                                    textTransform: 'uppercase',
                                }}>{captcha ? 'Подробности...' : error}</Text>
                            </View>
                        </Error>
                        <Captcha
                            Field={Field}
                            modal={modal}
                            setModal={setModal}
                            captcha={captcha}
                            value={captchaValue}
                            setValue={setCaptchaValue}
                        />
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            activeOpacity={0.7}
                            title='Войти'
                            titleStyle={styles.login}
                            disabled={loading}
                            loading={loading}
                            disabledStyle={styles.login_button}
                            buttonStyle={styles.login_button}
                        />
                        <Button
                            title='Создать аккаунт'
                            activeOpacity={0.7}
                            titleStyle={styles.login}
                            buttonStyle={styles.login_button}
                            onPress={() => Alert.alert('open in browser from this app')}
                        />
                    </Scroll>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    backImg: {
        width: '100%',
        height: '100%',
    },
    block: {
        flex: 1,
        backgroundColor: '#3959ab'
    },
    wrapper: {
        paddingTop: Dimensions.get('window').height / 7
    },
    title: {
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: 20,
        paddingTop: Dimensions.get('window').height / 5,
        textAlign: 'center',
        textShadowColor: '#fff',
        textShadowOffset: {},
        textShadowRadius: 10
    },
    button: {
        backgroundColor: '#fff',
        color: '#fff'
    },
    login: {
        color: '#fff',
        fontSize: 20,
        padding: '1%',
    },
    login_button: {
        backgroundColor: 'rgba(57,89,171,0.8)',
        shadowOffset: {},
        shadowOpacity: 0.8,
        marginBottom: Dimensions.get('window').height / 25
    },
    showButton: {
        right: Dimensions.get('window').width / 5
    },
    password_block: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '5%'
    },
    rememberMe: {
        color: '#fff'
    },
    rememberBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: Dimensions.get('window').height / 150,
    }
})

export default reduxForm({ form: 'authpage' })(Login);