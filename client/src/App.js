import './App.css';
import React from 'react';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from 'react-router-dom';
import { Col, Row, Container, Alert } from 'react-bootstrap';


import { load_data } from './Components/Load_data';
import { useEffect, useState } from 'react';
import { MyNavbar } from './Components/Navbar';
import { Sidebar } from './Components/SideBar';
import FilmTable from './Components/FilmTable';
import { AddButton } from './Components/AddButton';
import { AddFilmForm } from './Components/AddFilmForm';
import { Film } from './Components/Film';

import API from './API'
import { LoginForm, LogoutButton } from './Components/Auth';

const filmsData = load_data();

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

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
    const checkAuth = async () => {
      await API.getUserInfo();
      setLoggedIn(true);
    };
    checkAuth();
  }, []);


  useEffect(() => {
    if (loggedIn) {
      reloadFilms(filt);
    } else {
      setFilms([])
    }
  }, [
    filt,
    loggedIn
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

  const changeFavoriteFilm = async (film) => {
    try {
      setLoading(true);
      await API.favoriteFilm(film.id);
      reloadFilms();
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const changeRatingFilm = async (film, value) => {
    try {
      setLoading(true);
      film.rating = value
      await API.editFilm(film);
      reloadFilms();
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const openEdit = (film) => {
    setEditedFilm(film)
    setMode('edit')
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
    } catch (err) {
      console.log(err);
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setFilms([]);
    //setMessage('');
  };


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={
            loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
          } />

          <Route element={<AppLayout loggedIn={loggedIn} handleLogout={handleLogout} message={message} setMessage={setMessage} />}>
            <Route path='/' element={loggedIn ? <FilmsPage filt={''} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/favorites' element={loggedIn ? <FilmsPage filt={'favorites'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/bestrated' element={loggedIn ? <FilmsPage filt={'bestrated'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/lastmonth' element={loggedIn ? <FilmsPage filt={'lastmonth'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/unseen' element={loggedIn ? <FilmsPage filt={'unseen'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/addFilm' element={loggedIn ? <AddFilmPage mode={mode} setMode={setMode} addFilm={addFilm} /> : <Navigate replace to='/login' />} />
            <Route path='/editFilm' element={loggedIn ? <EditFilmPage key={editedFilm.id} mode={mode} setMode={setMode} editFilm={editFilm} editedFilm={editedFilm} /> : <Navigate replace to='/login' />} />
          </Route>

          <Route path='*' element={<h1>404 Page not found</h1>} />

        </Routes>
      </BrowserRouter >
    </div>
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
    <div>
      {props.loggedIn && <LogoutButton logout={props.handleLogout} />}
      {props.message && <Row>
        <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
      </Row>}
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
