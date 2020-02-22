import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Users } from '../components/Users/Users';
import { Profile } from '../components/Profile/Profile';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { IconForBar } from './IconForBar';
import { Dialogs } from '../components/Dialogs/Dialogs';
import { User } from '../components/Users/User';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { CustomDrawerComponent } from '../components/CustomDrawerComponent';
import { ProfileEdit } from '../components/Profile/ProfileEdit';
import { Dialog } from '../components/Dialogs/Dialog';

const navigationOptions = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#3959ab'
        },
        headerTintColor: '#fff',
    },
}

const UsersNavigator = createStackNavigator({ Users, User }, navigationOptions);
const ProfileNavigator = createStackNavigator({ Profile, ProfileEdit }, navigationOptions);
const DialogsNavigator = createStackNavigator({ Dialogs, Dialog }, navigationOptions);

const ProfileNavigatorDrawer = createDrawerNavigator({
    Profile: ProfileNavigator
}, {
    contentOptions: {
        activeTintColor: '#fff'
    },
    drawerPosition: 'right',
    drawerType: 'slide',
    drawerBackgroundColor: '#3959ab',
    contentComponent: CustomDrawerComponent,
    edgeWidth: Dimensions.get('window').width / 2
});

const bottomTabConfig = {
    Users: {
        screen: UsersNavigator,
        navigationOptions: {
            tabBarLabel: 'Пользователи',
            tabBarIcon: info => <IconForBar info={info} name='ios-people' />
        }
    },
    Dialogs: {
        screen: DialogsNavigator,
        navigationOptions: {
            tabBarLabel: 'Сообщения',
            tabBarIcon: info => <IconForBar info={info} name='ios-chatboxes' />
        }
    },
    Profile: {
        screen: ProfileNavigatorDrawer,
        navigationOptions: {
            tabBarLabel: 'Мой профиль',
            tabBarIcon: info => <IconForBar info={info} name='ios-contact' />
        }
    }
}

const AppNavigation = Platform.OS === 'ios'
? createBottomTabNavigator(bottomTabConfig, {
    tabBarOptions: {
        activeTintColor: '#fff',
        style: {
            backgroundColor: '#3959ab',
            padding: 10
        },
        showLabel: false,
    },
    initialRouteName: 'Profile'
})
: createMaterialBottomTabNavigator(bottomTabConfig, {
    shifting: true,
    barStyle: {
        backgroundColor: '#3959ab'
    },
    initialRouteName: 'Profile'
})

DialogsNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName === 'Dialog') {
                tabBarVisible = false;
            } else {
                tabBarVisible = true;
            }
        });
    }
  
    return {
        tabBarVisible
    };
};

export default createAppContainer(AppNavigation);