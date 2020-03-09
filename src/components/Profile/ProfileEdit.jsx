import React, { Fragment, useEffect, useState } from 'react';
import { View, Dimensions, ImageBackground, StyleSheet, Text, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Input, CheckBox, Button } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { Formik } from 'formik';
import { postProfileThunk, setErrorCreator, putAvatarThunk } from '../../redux/reducers/profileReducer';
import { PhotoPicker } from '../../ui/PhotoPicker';
import { userImg } from '../../../assets/defaultImage';
import { IconBack } from '../../ui/IconBack';

export const ProfileEdit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => dispatch(setErrorCreator(null));
    }, [dispatch]);

    const profile = useSelector(state => state.profileAPI.profile);
    const error = useSelector(state => state.profileAPI.error);
    
    const [image, setImage] = useState(profile.photos.large || userImg);

    const putAvatar = img => {
        if (img.uri) {
            dispatch(putAvatarThunk(img));
        }
    }

    const Wrapper = (label, input, value, onChangeText, size = 50) => (
        <View style={styles.field_block}>
            <View style={{
                padding: 10
            }}>
                <Input
                    maxLength={size}
                    label={label}
                    placeholder='Заполните поле'
                    leftIcon={
                        <AntDesign
                            color='#3959ab'
                            size={24}
                            name={
                                input
                                ? 'checkcircle'
                                : 'rightcircleo'
                            }
                        />
                    }
                    inputStyle={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    )

    const data = {
        profile: {
            aboutMe: profile.aboutMe,
            contacts: {
                facebook: profile.contacts.facebook,
                website: profile.contacts.website,
                vk: profile.contacts.vk,
                twitter: profile.contacts.twitter,
                instagram: profile.contacts.instagram,
                youtube: profile.contacts.youtube,
                github: profile.contacts.github,
                mainLink: profile.contacts.mainLink,
            },
            lookingForAJob: profile.lookingForAJob,
            lookingForAJobDescription: profile.lookingForAJobDescription,
            fullName: profile.fullName,
            userId: profile.userId,
            photos: {
                small: profile.small,
                large: profile.large
            }
        }
    }
    return (
        <Formik initialValues={data} onSubmit={values => {
            dispatch(setErrorCreator(null));
            dispatch(postProfileThunk(values.profile));
        }}>
            {({ handleChange, handleSubmit, values, setFieldValue }) => (
                <ImageBackground style={styles.backImg} source={require('../../../assets/backgroundSpace.png')}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.block}>
                            <Text style={styles.title}>Редактирование</Text>
                            {error && <Text style={styles.error}>{error}</Text>}
                            <View style={styles.wrapper}>
                            <View style={styles.profile_image}>
                            <PhotoPicker
                                profile={profile}
                                image={image}
                                setImage={uri => setImage(uri ? uri : image)}
                                putAvatar={putAvatar}
                            />
                            </View>
                                {Wrapper(
                                    'Ваш ник',
                                    values.profile.fullName,
                                    values.profile.fullName,
                                    handleChange('profile.fullName',
                                    35
                                ))}
                                {Wrapper(
                                    'Ваш статус',
                                    values.profile.aboutMe,
                                    values.profile.aboutMe,
                                    handleChange('profile.aboutMe',
                                    35
                                ))}
                                {Wrapper(
                                    'О вас',
                                    values.profile.lookingForAJobDescription,
                                    values.profile.lookingForAJobDescription,
                                    handleChange('profile.lookingForAJobDescription',
                                    75
                                ))}
                                <CheckBox
                                    checked={values.profile.lookingForAJob}
                                    checkedColor='#3959ab'
                                    title='Потребность в работе'
                                    onPress={() => setFieldValue(
                                        'profile.lookingForAJob',
                                        !values.profile.lookingForAJob
                                    )}
                                    containerStyle={styles.checkboxIcon}
                                />
                                <Text style={styles.title}>Социальные сети</Text>
                                {Object.keys(values.profile.contacts).map(e => (
                                    <Fragment key={e}>
                                        {Wrapper(
                                            e.toUpperCase(),
                                            values.profile.contacts[e],
                                            values.profile.contacts[e],
                                            handleChange(`profile.contacts.${e}`
                                        ))}
                                    </Fragment>
                                ))}
                                <Button
                                    titleStyle={styles.saveButtonTitle}
                                    buttonStyle={styles.saveButton}
                                    title='Сохранить'
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            )}
        </Formik>
    )
}

ProfileEdit.navigationOptions = ({ navigation }) => {
    const profile = navigation.getParam('profile');

    return {
        headerTitle: profile.fullName.toUpperCase(),
        headerLeft: () => <IconBack nav={navigation} />
    }
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: Dimensions.get('window').height / 20
    },
    backImg: {
        width: '100%',
        height: '100%'
    },
    field_block: {
        margin: '2%'
    },
    error: {
        color: '#fff',
        fontSize: 20,
        textTransform: 'uppercase',
        backgroundColor: 'rgba(217, 17, 17, 0.9)',
        textAlign: 'center',
        marginTop: '5%'
    },
    block: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        margin: '5%',
        shadowOpacity: 1,
        shadowOffset: {
            width: 2,
            height: 2
        },
        elevation: 8,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30
    },
    input: {
        color: '#000',
        padding: 10
    },
    checkboxIcon: {
        backgroundColor: null
    },
    title: {
        color: '#fff',
        fontSize: 20,
        textTransform: 'uppercase',
        backgroundColor: 'rgba(57,89,171,0.8)',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: 'green',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30
    },
    saveButtonTitle: {
        textTransform: 'uppercase'
    },
    profile_image: {
        alignItems: 'center'
    }
})