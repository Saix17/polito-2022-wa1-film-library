'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { validationResult, body, param } = require('express-validator');
const filmDao = require('./dao/daoFilm');
const userDao = require('./dao/daoUser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const PORT = 3001;
const app = express();

app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await userDao.getUser(username, password)
    if (!user)
        return cb(null, false, 'Incorrect username or password.');
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
    // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const PREFIX = '/api/v1';

/*** USER APIs ***/

app.post(PREFIX + '/sessions', passport.authenticate('local'), (req, res) => {
    res.status(201).json(req.user);
});

app.get(PREFIX + '/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else
        res.status(401).json({ error: 'Not authenticated' });
});

app.delete(PREFIX + '/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});


/*** FILM APIs ***/

app.get(PREFIX + '/films', isLoggedIn, (req, res) => {
    filmDao.getAll(req.user).then(values =>
        res.json(values)
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    );
});

app.get(PREFIX + '/films/favorites', isLoggedIn, (req, res) => {
    filmDao.getFavorites(req.user).then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err })
        }
    );
});

app.get(PREFIX + '/films/lastmonth', isLoggedIn, (req, res) => {
    filmDao.getAll(req.user).then(
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


app.get(PREFIX + '/films/bestrated', isLoggedIn, (req, res) => {
    filmDao.getBestRated(req.user).then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err })
        }
    );
});

app.get(PREFIX + '/films/unseen', isLoggedIn, (req, res) => {
    filmDao.getUnseen(req.user).then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err })
        }
    );
});

app.get(PREFIX + '/films/:id', [
    param('id').isNumeric(),
    isLoggedIn
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    filmDao.getById(req.user, req.params.id).then(
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

app.post(PREFIX + '/films', [
    body('title').not().isEmpty(),
    body('favorite').isNumeric(),
    body('rating').isNumeric(),
    body('watchDate').isISO8601(),
    body('user').isNumeric(),
    isLoggedIn
], async (req, res) => {
    const film = req.body;
    try {
        const value = await filmDao.addFilm(req.user, film);
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
    body('user').isNumeric(),
    isLoggedIn
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const film = req.body;
    try {
        const value = await filmDao.updateFilm(req.user, film);
        res.end();
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

app.put(PREFIX + '/films/:id', [
    param('id').isNumeric(),
    isLoggedIn
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        dao.getById(req.params.id).then(
            v => {
                v.favorite = (v.favorite + 1) % 2;
                filmDao.updateFilm(req.user, v);
                res.end();
            }
        )
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

app.delete(PREFIX + '/films/:id', [
    param('id').isNumeric(),
    isLoggedIn
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const value = await filmDao.removeFilm(req.user, req.params.id);
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