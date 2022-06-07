import dayjs from 'dayjs';

function Film(id, title, isFavorite = false, watchDate = '', rating = 0) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    this.watchDate = watchDate && dayjs(watchDate);

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

export { Film, FilmLibrary };