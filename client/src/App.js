import './App.css';
import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';


import { load_data } from './Components/Load_data';
import { useEffect, useState } from 'react';
import { MyNavbar } from './Components/Navbar';
import { Sidebar } from './Components/SideBar';
import FilmTable from './Components/FilmTable';
import { AddButton } from './Components/AddButton';
import { AddFilmForm } from './Components/AddFilmForm';
import { Film } from './Components/Film';

import API from './API'

const filmsData = load_data();

function App() {
  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState([]);

  //const [filt, setFilt] = useState("");
  const [mode, setMode] = useState("show");
  const [editedFilm, setEditedFilm] = useState(new Film(1, "Pulp Fiction", true, "2022-03-10", 5));

  async function reloadFilms() {
    //setLoading(true);
    const list = await API.readFilms()
    setFilms(list);
    setLoading(false);
  }

  useEffect(() => {
    reloadFilms();
  }, []);

  const removeFilm = (film) => {
    setFilms((oldFilms) => (oldFilms.filter((f) => (f.id !== film.id))));
  }

  const addFilm = async (film) => {
    try {
      await API.addFilm(film);
      reloadFilms();
    } catch (e) {
      throw(e);
    }
  }

  const editFilm = (film) => {
    setFilms((fs) => (fs.map((f) => (f.id === film.id ? film : f))));
  }

  const changeFavoriteFilm = (film) => {
    film.favorite = !film.favorite
    setFilms((fs) => (fs.map((f) => (f.id === film.id ? film : f))));
  }

  const changeRatingFilm = (film, value) => {
    film.rating = value
    setFilms((fs) => (fs.map((f) => (f.id === film.id ? film : f))));
  }

  const openEdit = (film) => {
    setEditedFilm(film)
    setMode('edit')
  }

  const filterFilms = function (filt) {
    switch (filt) {
      case '':
        return films;
      case 'favorites':
        return films.filter((f) => f.favorite);
      case 'best_rated':
        return films.filter((f) => f.isBestRated());
      case 'seen_last_month':
        return films.filter((f) => f.isSeenLastMonth);
      case 'unseen':
        return films.filter((f) => f.isUnseen)
      default:
        return films;
    }
  }


  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AppLayout />}>
          <Route path='/' element={<FilmsPage filt={''} films={filterFilms('')} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/favorites' element={<FilmsPage filt={'favorites'} films={filterFilms('favorites')} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/best_rated' element={<FilmsPage filt={'best_rated'} films={filterFilms('best_rated')} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/seen_last_month' element={<FilmsPage filt={'seen_last_month'} films={filterFilms('seen_last_month')} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/unseen' element={<FilmsPage filt={'unseen'} films={filterFilms('unseen')} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/addFilm' element={<AddFilmPage mode={mode} setMode={setMode} addFilm={addFilm} />} />
          <Route path='/editFilm' element={<EditFilmPage key={editedFilm.id} mode={mode} setMode={setMode} editFilm={editFilm} editedFilm={editedFilm} />} />
          <Route path='*' element={<h1>404 Page not found</h1>} />
        </Route>

      </Routes>
    </BrowserRouter >
  );
}

function FilmsPage(props) {
  const filterToText = function () {
    switch (props.filt) {
      case '':
        return 'All';
      case 'favorites':
        return 'Favorites'
      case 'best_rated':
        return 'Best Rated'
      case 'seen_last_month':
        return 'Seen last Month'
      case 'unseen':
        return 'Unseen'
      default:
        return 'All';
    }
  }

  return (
    <Row>
      <Col xs={3} className="Menu">
        <Sidebar filt={props.filt} />
      </Col>
      <Col >
        <h1>Filter: {filterToText()}</h1>
        <FilmTable
          filt={props.filt}
          films={props.films}
          changeFavoriteFilm={props.changeFavoriteFilm}
          changeRatingFilm={props.changeRatingFilm}
          openEdit={props.openEdit}
          removeFilm={props.removeFilm}
        />
        <AddButton setMode={props.setMode} />
      </Col>
    </Row>
  );
}

function AddFilmPage(props) {
  return (
    <Row>
      <Col>
        <div>
          <h1>Add film</h1>
          <AddFilmForm
            mode={props.mode}
            setMode={props.setMode}
            addFilm={props.addFilm}
          />
        </div>
      </Col>
    </Row>
  );
}

function EditFilmPage(props) {
  return (
    <Row>
      <Col>
        <div>
          <h1>Edit film</h1>
          <AddFilmForm
            key={props.editedFilm.id}
            mode={props.mode}
            setMode={props.setMode}
            editFilm={props.editFilm}
            editedFilm={props.editedFilm}
          />
        </div>
      </Col>
    </Row>
  );
}

function AppLayout(props) {
  return (
    <div className="App">
      <MyNavbar />
      <Container className="Content" fluid>
        <Outlet />
      </Container>
    </div>
  );
}


/*
function AppLayout(props) {
  return (
    <div className="App">
      <MyNavbar />
      <Container className="Content" fluid>
        <Outlet />
        <Row>
          <Col xs={3} className="Menu">
            <Sidebar filt={filt} setFilt={setFilt} />
          </Col>
          <Col >
            <h1>Filter: {filt}</h1>
            <FilmTable filt={filt} films={filterFilms()} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} />
            {mode === 'show' &&
              <AddButton setMode={setMode} />
            }
            {mode === 'add' &&
              <div>
                <h1>Add film</h1>
                <AddFilmForm mode={mode} setMode={setMode} nextId={nextIdFilm} addFilm={addFilm} />
              </div>
            }
            {mode === 'edit' &&
              <div>
                <h1>Edit film</h1>
                <AddFilmForm key={editedFilm.id} mode={mode} setMode={setMode} editFilm={editFilm} editedFilm={editedFilm} />
              </div>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}
*/
export default App;
