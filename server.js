'use strict';

const express = require('express');
const dao = require('./dao');
const app = express();
app.use(express.json());

const PREFIX = '/api';
const PORT = 3001;

app.get(PREFIX + '/films', (req, res) => {
    dao.getAll().then(
        (value) => {
        res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({error: err});
        }
    );
});

app.get(PREFIX + '/films/favorites', (req, res) => {
    dao.getFavorites().then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({error: err})
        }
    );
});

app.get(PREFIX + '/films/bestrated', (req, res) => {
    dao.getBestRated().then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({error: err})
        }
    );
});

app.get(PREFIX + '/films/unseen', (req, res) => {
    dao.getUnseen().then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({error: err})
        }
    );
});

app.get(PREFIX + 'films/:id', (req, res) => {
    dao.getById(req.params.id).then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({error: err})
        }
    );
});

app.post(PREFIX + '/films', async (req, res) => {

    const film =  req.body;
    console.log(film);
    try {
        const value = await dao.addFilm(film);
        res.end();
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

//app.put(modifyFilm)
//app.put(setFavorite)

app.delete(PREFIX + '/films/:id', async (req,res) => {
    try{
        const value = await dao.removeFilm(req.params.id);
        res.end();
    }catch(e) {
        res.status(400).json({error: e})
    }
});


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));