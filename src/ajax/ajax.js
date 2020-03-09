import * as axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    headers: {
        'API-KEY': '11452ed1-3660-45e9-b8d1-a254f78a41b8'
    }
})

export class Ajax {
    static getUsers(page, count) {
        return instance.get(`users?page=${page}&count=${count}`);
    }

    static getProfile(id) {
        return instance.get(`profile/${id}`);
    }

    static postFollow(id) {
        return instance.post(`follow/${id}`);
    }

    static deleteFollow(id) {
        return instance.delete(`follow/${id}`);
    }

    static getAuth() {
        return instance.get('auth/me');
    }

    static postAuth(email, password, captcha) {
        return instance.post('auth/login', { email, password, captcha });
    }

    static putProfile(profile) {
        return instance.put('profile', profile);
    }

    static async putAvatar(img) {
        const image = {
            uri: img.uri,
            type: "image/jpeg",
            name: "photo.jpg",
        };
        const bodyFormData = new FormData();
        bodyFormData.append('image', image);
        return instance.put('profile/photo', bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    static deleteAuth() {
        return instance.delete('auth/login');
    }

    static getCaptcha() {
        return instance.get('security/get-captcha-url');
    }

    static getOnline() {
        return axios.get('https://haries-network.firebaseio.com/isonline.json');
    }

    static setOnline(id) {
        return axios.post('https://haries-network.firebaseio.com/isonline.json', id);
    }

    static setOffline(key) {
        return axios.delete(`https://haries-network.firebaseio.com/isonline/${key}.json`);
    }

    static getTechAdmin() {
        return axios.get('https://haries-network.firebaseio.com/istechadmin.json');
    }

    static getAdmin() {
        return axios.get('https://haries-network.firebaseio.com/isadmin.json');
    }
    
    static getMessages() {
        return instance.get('dialogs');
    }

    static getDialog(id) {
        return instance.get(`dialogs/${id}/messages`);
    }

    static postMessage(id, message) {
        return instance.post(`dialogs/${id}/messages`, {
            body: message
        })
    }
}