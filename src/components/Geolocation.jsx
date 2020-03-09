import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { IconBack } from '../ui/IconBack';

export const Geolocation = () => {
    return (
        <View style={styles.container}>
            <MapView
                followsUserLocation
                showsUserLocation
                style={styles.mapStyle}
            />
        </View>
    )
}

Geolocation.navigationOptions = ({ navigation }) => ({
    headerTitle: 'Местоположение',
    headerLeft: () => <IconBack nav={navigation} />
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});