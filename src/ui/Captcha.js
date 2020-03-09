import React from 'react';
import { Modal, View, Image, StyleSheet, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { InputRender } from '../redux/reduxForm/formsControl';
import { requireField } from '../redux/reduxForm/validators';
import { Button } from 'react-native-elements';
import { Text } from 'native-base';


export const Captcha = ({ Field, captcha, modal, setModal, value, setValue }) => {
    const closeModal = () => {
        if (value.trim()) {
            setModal(false);
        }
    }

    return (
        <Modal animationType='slide' visible={modal}>
            <StatusBar barStyle='dark-content' />
            <ImageBackground
                source={require('../../assets/backgroundWraith.png')}
                style={styles.img}
            >
                <View style={styles.wrapper}>
                    <View style={styles.form}>
                    <Text style={styles.text}>Вы много раз допустили ошибку при вводе пароля</Text>
                        <View style={styles.captcha_block}>
                            <Image style={styles.captcha} source={{ uri: captcha }} />
                        </View>
                        <Field
                            name='captcha'
                            validate={[requireField]}
                            component={InputRender}
                            placeholder='Введите капчу...'
                            autoCapitalize='words'
                            autoCorrect={false}
                            maxLength={15}
                            value={value}
                            onChangeText={setValue}
                        />
                        <Button
                            onPress={closeModal}
                            title='Отправить'
                            buttonStyle={styles.button}
                        />
                    </View>
                </View>
            </ImageBackground>
        </Modal>
    )
}

const styles = StyleSheet.create({
    img: {
        width: '100%',
        height: '100%'
    },
    captcha: {
        width: Dimensions.get('window').width / 3,
        height: Dimensions.get('window').height / 12
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    form: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: Dimensions.get('window').height / 100,
        marginHorizontal: '10%',
        shadowOffset: {},
        shadowOpacity: 0.4,
        elevation: 8
    },
    captcha_block: {
        alignItems: 'center',
        margin: '5%'
    },
    text: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        padding: '1%'
    },
    button: {
        margin: 10,
        backgroundColor: '#3959ab',
    }
})