'use strict';

const PORT = 3001;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { validationResult, body, param } = require('express-validator');

const dao = require('./dao/daoFilm');

const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(cors());

const PREFIX = '/api/v1';

app.get(PREFIX + '/films', (req, res) => {
    dao.getAll().then(values =>

        res.json(values)
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
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
            res.status(500).json({ error: err })
        }
    );
});

app.get(PREFIX + '/films/lastmonth', (req, res) => {
    dao.getAll().then(
        (value) => value.filter(v => v.isSeenLastMonth))
        .then(valuelm => {
            console.log(valuelm);
            res.json(valuelm)
        }
        ).catch(
            (err) => {
                res.status(500).json({ error: err })
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
            res.status(500).json({ error: err })
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
            res.status(500).json({ error: err })
        }
    );
});

app.get(PREFIX + '/films/:id',[
    param('id').isNumeric()
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    dao.getById(req.params.id).then(
        (value) => {
            console.log(value.title);
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err })
        }
    );
});

app.post(PREFIX + '/films',[
    body('title').not().isEmpty(),
    body('favorite').isNumeric(),
    body('rating').isNumeric(),
    body('watchDate').isISO8601(),
    body('user').isNumeric()
], async (req, res) => {
    const film = req.body;
    try {
        const value = await dao.addFilm(film);
        res.end();
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

app.put(PREFIX + '/films', [
    body('id').isNumeric(),
    body('title').not().isEmpty(),
    body('favorite').isNumeric(),
    body('rating').isNumeric(),
    body('watchDate').isISO8601(),
    body('user').isNumeric()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const film = req.body;
    try {
        const value = await dao.updateFilm(film);
        res.end();
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

app.put(PREFIX + '/films/:id',[
    param('id').isNumeric()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        dao.getById(req.params.id).then(
            v => {
                v.favorite = (v.favorite + 1) % 2;
                dao.updateFilm(v);
                res.end();
            }
        )
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

app.delete(PREFIX + '/films/:id',[
    param('id').isNumeric()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const value = await dao.removeFilm(req.params.id);
        res.end();
    } catch (e) {
        res.status(400).json({ error: e })
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

/*{ for (const film of values){

    if (film.watchDate !== null)
                film.watchDate = film.watchDate.format('YYYY-MM-DD')
        }
           return values; 
        })
        .then(value =>*/