import { Film } from "./Components/Film";

const APIURL = 'http://localhost:3001/api/v1';

async function readFilms() {
    const url = APIURL + '/films';
    try {
        const response = await fetch(url);
        if (response.ok) {

            const list = await response.json();
            console.log(list)
            const filmList = list.map((f) => new Film(f.id, f.title, f.favorite, f.watchDate, f.rating));
            return filmList;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}



async function addFilm(film) {
    const url = APIURL + '/films';
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(film),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}



async function editFilm(film) {
    const url = APIURL + '/films';
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(film),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

/*
async function removeExam(code) {
    const url = APIURL+ `/exams/${code}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if(response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch(ex) {
        throw ex;
    }
}*/

const API = { readFilms, addFilm, editFilm };
export default API;