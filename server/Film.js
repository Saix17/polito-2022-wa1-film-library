const dayjs = require('dayjs');

function Film(id, title, isFavorite = false, watchDate = '', rating = 0, user) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    this.watchDate = watchDate && dayjs(watchDate);
    this.user = user;

    this.isBestRated = ()=> this.rating === 5
    this.isSeenLastMonth = this.watchDate !== '' ? this.watchDate.add(30, 'day').isAfter(dayjs()) : false
    this.isUnseen = this.watchDate === ''
}

function FilmLibrary() {
    this.filmList = [];

    this.add = (film) => {
        this.filmList.push(film);
    };
}

exports.Film = Film;
exports.FilmLibrary = FilmLibrary;
