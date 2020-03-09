import * as WebBrowser from 'expo-web-browser';

export const openBrowser = async url => {
    await WebBrowser.openBrowserAsync(url);
}