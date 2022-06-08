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

const logIn = async (credentials) => {
    const response = await fetch(APIURL + '/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };

  const getUserInfo = async () => {
    const response = await fetch(APIURL + '/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user; 
    }
  };

  const logOut = async() => {
    const response = await fetch(APIURL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
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


async function removeFilm(id) {
    const url = APIURL + `/films/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE'
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

const API = { readFilms, addFilm, editFilm, removeFilm, logIn, getUserInfo, logOut };
export default API;