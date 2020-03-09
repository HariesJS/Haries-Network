import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('post.db');

export class DB {
    static init() {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS login (id INTEGER PRIMARY KEY NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, img TEXT)',
                    [],
                    resolve,
                    (_, error) => reject(error)
                )
            })
        })
    }
    
    static getPosts() {
        this.init();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM login',
                    [],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error)
                );
            })
        })
    }

    static createPost({ email, password, img }) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO login (email, password, img) VALUES (?, ?, ?)`,
                    [email, password, img],
                    (_, result) => resolve(result.insertId),
                    (_, error) => reject(error)
                );
            })
        })
    }

    static removePost(id) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM login WHERE id = ?',
                    [id],
                    resolve,
                    (_, error) => reject(error)
                );
            })
        })
    }
}