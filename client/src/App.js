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

  const [filt, setFilt] = useState("");
  const [mode, setMode] = useState("show");
  const [editedFilm, setEditedFilm] = useState(new Film(1, "Pulp Fiction", true, "2022-03-10", 5));

  async function reloadFilms(filt) {
    setLoading(true);
    const list = await API.readFilms(filt)
    setFilms(list);
    setLoading(false);
  }

  useEffect(() => {
    reloadFilms(filt);
  }, [
    filt
  ]);

  const removeFilm = async (id) => {
    try {
      setLoading(true);
      await API.removeFilm(id);
      reloadFilms();
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const addFilm = async (film) => {
    try {
      setLoading(true);
      await API.addFilm(film);
      reloadFilms();
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const editFilm = async (film) => {
    try {
      setLoading(true);
      await API.editFilm(film);
      reloadFilms();
      setLoading(false);
    } catch (e) {
      throw (e);
    }
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


  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AppLayout />}>
          <Route path='/' element={<FilmsPage filt={''} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/favorites' element={<FilmsPage filt={'favorites'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/bestrated' element={<FilmsPage filt={'bestrated'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/lastmonth' element={<FilmsPage filt={'lastmonth'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/unseen' element={<FilmsPage filt={'unseen'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} />} />
          <Route path='/addFilm' element={<AddFilmPage mode={mode} setMode={setMode} addFilm={addFilm} />} />
          <Route path='/editFilm' element={<EditFilmPage key={editedFilm.id} mode={mode} setMode={setMode} editFilm={editFilm} editedFilm={editedFilm} />} />
          <Route path='*' element={<h1>404 Page not found</h1>} />
        </Route>

      </Routes>
    </BrowserRouter >
  );
}

function FilmsPage(props) {
  props.setFilt(props.filt)
  const filterToText = function () {
    switch (props.filt) {
      case '':
        return 'All';
      case 'favorites':
        return 'Favorites'
      case 'bestrated':
        return 'Best Rated'
      case 'lastmonth':
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
