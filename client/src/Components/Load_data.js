import { Film, FilmLibrary } from './Film';
import dayjs from 'dayjs';

const load_data= () => {
    const parse = new FilmLibrary();
    parse.add(new Film(1, "Pulp Fiction", true, dayjs("2022-03-10"), 5));
    parse.add(new Film(2, "21 Grams", true, dayjs("2022-04-17"), 4));
    parse.add(new Film(3, "Star Wars", false));
    parse.add(new Film(4, "Matrix", true));
    parse.add(new Film(5, "Shrek", false, dayjs("2022-03-21"), 3));
    return parse;
}

export {load_data};