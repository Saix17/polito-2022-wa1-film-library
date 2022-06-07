'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');
const { Film } = require('./Film');

const db = new sqlite.Database('films.db', (err) => {
    if (err) {
        throw err;
    }
});

function getAll(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM films';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map((e) =>
                    new Film(e.id, e.title, e.favorite, e.watchDate, e.rating),
                ));
            }
        });
    });
}

const getFavorites = () => {
    const sql = "SELECT * FROM films WHERE favorite = 1";
    return new Promise ((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows.map((e) =>
                    new Film(e.id, e.title, e.favorite, e.watchDate, e.rating),
                ));
            }
        })
    })
}

// const getSeenLastMonth = () => {
//     const sql = "SELECT * FROM films WHERE ";
//     return new Promise ((resolve, reject) => {
//         db.all(sql, [], (err, rows) => {
//             if(err){
//                 reject(err);
//             }
//             else{
//                 resolve(rows.map((e) =>
//                     new Film(e.id, e.title, e.favorite, e.watchDate, e.rating),
//                 ));
//             }
//         })
//     })
// }

const getBestRated = () => {
    const sql = "SELECT * FROM films WHERE rating = 5";
    return new Promise ((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows.map((e) =>
                    new Film(e.id, e.title, e.favorite, e.watchDate, e.rating),
                ));
            }
        })
    })
}

const getUnseen = () => {
    const sql = "SELECT * FROM films WHERE watchdate IS NULL";
    return new Promise ((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows.map((e) =>
                    new Film(e.id, e.title, e.favorite, e.watchDate, e.rating),
                ));
            }
        })
    })
}

const getById = (id) => {
    const sql = 'SELECT * FROM films WHERE id=?';
    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length > 0) {
                    resolve(rows.map((e) =>
                    new Film(e.id, e.title, e.favorite, e.watchDate, e.rating),
                ));
                }
            }
        });
    });
}


function addFilm(film) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO films (id, title, favorite, watchDate, rating) VALUES( ?,?,?,?,?)';
        db.run(sql, [film.title, film.favorite, film.watchDate, film.rating], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

function modifyFilm(id, name, favorite, date, rating) {
    const sql = "UPDATE films SET name = ?, favorite = ?, date = ?, rating = ? WHERE id = ?"
    const list = [name, favorite, date, rating, id];
    return new Promise((resolve, reject) => {
        db.run(sql, list, (err) => {
            if(err){
                reject(err);
            }
            else{
                resolve(1);
            }
        })
    })
}

function setFavorite(id, favorite){
    const sql = "UPDATE films SET favorite = ? WHERE id = ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [favorite, id], (err) => {
            if(err){
                reject(err);
            }
            else{
                resolve(1);
            }
        })
    })
}

function removeFilm(id) {
    const sql = "DELETE FROM films WHERE id = ?"
    return new Promise((resolve, reject) => {
        db.run(sql, id, (err) => {
            if(err){
                reject(err);
            }
            else{
                resolve(1);
            }
        })
    })
}

module.exports = {
     getAll, 
     getFavorites,
     getBestRated,
     getUnseen,
     getById,
     addFilm,
     modifyFilm,
     setFavorite,
     removeFilm
    };