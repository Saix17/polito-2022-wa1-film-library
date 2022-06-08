'use strict';

const sqlite = require('sqlite3');
const {Film} = require('../Film');

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
                resolve(rows.map((f) =>
                    new Film(f.id, f.title, f.favorite, f.watchdate, f.rating, f.user),
                ));
            }
        });
    });
}

function getFavorites(){
    const sql = "SELECT * FROM films WHERE favorite = 1";
    return new Promise ((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows.map((f) =>
                new Film(f.id, f.title, f.favorite, f.watchDate, f.rating, f.user),
                ));
            }
        })
    })
}

function getBestRated(){
    const sql = "SELECT * FROM films WHERE rating = 5";
    return new Promise ((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows.map((f) =>
                new Film(f.id, f.title, f.favorite, f.watchDate, f.rating, f.user),
                ));
            }
        })
    })
}

function getUnseen(){
    const sql = "SELECT * FROM films WHERE watchdate IS NULL";
    return new Promise ((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }
            else{
                resolve(rows.map((f) =>
                new Film(f.id, f.title, f.favorite, f.watchDate, f.rating, f.user),
                ));
            }
        })
    })
}

function getById(id){
    const sql = 'SELECT * FROM films WHERE id=?';
    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                row.length > 0 ?
                    resolve(new Film(
                        row[0].id, 
                        row[0].title, 
                        row[0].favorite, 
                        row[0].watchdate, 
                        row[0].rating, 
                        row[0].user))
                : resolve (1);  
        }});
    });
}


function addFilm(film) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO films (title, favorite, watchdate, rating, user) VALUES(?,?,?,?,?)';
        db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

function updateFilm(film) {
    const sql = "UPDATE films SET title = ?, favorite = ?, watchdate = ?, rating = ?, user = ? WHERE id = ?"
    const list = [film.title, film.favorite, film.watchDate, film.rating, film.user, film.id];
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
     updateFilm,
     setFavorite,
     removeFilm
    };