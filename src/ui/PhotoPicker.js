import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Wrapper } from './Wrapper';
import { ActionSheet } from 'native-base';
import * as Permissions from 'expo-permissions';
import { Alert } from 'react-native';
import { Avatar } from 'react-native-elements';

async function askForPermissions() {
    const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
    )
    if (status !== 'granted') {
        Alert.alert('Предоставьте доступ в настройках.');
        return false;
    }
    return true;
}

export const PhotoPicker = ({ image, setImage, putAvatar, profile }) => {
    const openCamera = async () => {
        const hasPermissions = await askForPermissions();

        if (!hasPermissions) {
            return;
        }
        
        const img = await ImagePicker.launchCameraAsync({
            quality: 0.7,
            allowsEditing: true,
            aspect: [16, 9]
        })
        setImage(img.uri);
        putAvatar(img);
    }

    const openGallery = async () => {
        const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    
        if (!permissionResult.granted) {
            alert('Предоставьте доступ в настойках!');
            return;
        }
    
        const img = await ImagePicker.launchImageLibraryAsync();
        setImage(img.uri);
        putAvatar(img);
    }

    return (
        <Wrapper onPress={() =>
            ActionSheet.show(
                {
                    options: ['Выбрать картинку', 'Открыть камеру', 'Отменить'],
                    cancelButtonIndex: 2,
                    title: 'Выбрать или сделать фото'
                },
                buttonIndex => {
                    switch (buttonIndex) {
                        case 0:
                            openGallery();
                            break;
                        case 1:
                            openCamera();
                            break;
                        case 2:
                            break;
                        default:
                            break;
                    }
                }
            )
        }>
            <Avatar
                size='xlarge'
                avatarStyle={{}}
                source={{ uri: image }}
                overlayContainerStyle={{backgroundColor: null }}
                containerStyle={profile.photos.large && { shadowOpacity: 0.8, shadowOffset: {}, elevation: 8 }}
                rounded
                showEditButton
            />
        </Wrapper>
    )
}