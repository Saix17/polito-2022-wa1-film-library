'use strict';

const sqlite = require('sqlite3');
const { Film } = require('../Film');

const db = new sqlite.Database('films.db', (err) => {
    if (err) {
        throw err;
    }
});

function getAll(user) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM films where user == ?";
        db.all(sql, [user.id], (err, rows) => {
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

function getFavorites(user) {
    const sql = "SELECT * FROM films WHERE favorite = 1 AND user == ?";
    return new Promise((resolve, reject) => {
        db.all(sql, [user.id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows.map((f) =>
                    new Film(f.id, f.title, f.favorite, f.watchDate, f.rating, f.user),
                ));
            }
        })
    })
}

function getBestRated(user) {
    const sql = "SELECT * FROM films WHERE rating = 5 AND user == ?";
    return new Promise((resolve, reject) => {
        db.all(sql, [user.id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows.map((f) =>
                    new Film(f.id, f.title, f.favorite, f.watchDate, f.rating, f.user),
                ));
            }
        })
    })
}

function getUnseen(user) {
    const sql = "SELECT * FROM films WHERE watchdate IS NULL AND user == ?";
    return new Promise((resolve, reject) => {
        db.all(sql, [user.id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows.map((f) =>
                    new Film(f.id, f.title, f.favorite, f.watchDate, f.rating, f.user),
                ));
            }
        })
    })
}

function getById(user, id) {
    const sql = "SELECT * FROM films WHERE id=? AND user == ?";
    return new Promise((resolve, reject) => {
        db.all(sql, [id, user.id], (err, row) => {
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
                    : resolve(1);
            }
        });
    });
}


function addFilm(user, film) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO films (title, favorite, watchdate, rating, user) VALUES(?,?,?,?,?)";
        db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, user.id], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

function updateFilm(user, film) {
    const sql = "UPDATE films SET title = ?, favorite = ?, watchdate = ?, rating = ?, user = ? WHERE id == ? AND user == ?"
    const list = [film.title, film.favorite, film.watchDate, film.rating, user.id, film.id, user.id];
    return new Promise((resolve, reject) => {
        db.run(sql, list, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(1);
            }
        })
    })
}

function setFavorite(user, id, favorite) {
    const sql = "UPDATE films SET favorite = ? WHERE id = ? AND user == ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [favorite, id, user.id], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(1);
            }
        })
    })
}

function removeFilm(user, id) {
    const sql = "DELETE FROM films WHERE id = ? AND user == ?"
    return new Promise((resolve, reject) => {
        db.run(sql, [id, user.id], (err) => {
            if (err) {
                reject(err);
            }
            else {
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