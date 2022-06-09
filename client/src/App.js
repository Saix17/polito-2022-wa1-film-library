import './App.css';
import React from 'react';
import { BrowserRouter, Outlet, Route, Routes, Navigate } from 'react-router-dom';
import { Col, Row, Container, Alert } from 'react-bootstrap';


import { useEffect, useState } from 'react';
import { MyNavbar } from './Components/Navbar';
import { Sidebar } from './Components/SideBar';
import FilmTable from './Components/FilmTable';
import { AddButton } from './Components/AddButton';
import { AddFilmForm } from './Components/AddFilmForm';
import { Film } from './Components/Film';

import API from './API'
import { LoginForm } from './Components/Auth';

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
      try {
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (error) { }
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
      reloadFilms(filt);
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const addFilm = async (film) => {
    try {
      setLoading(true);
      await API.addFilm(film);
      reloadFilms(filt);
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const editFilm = async (film) => {
    try {
      setLoading(true);
      await API.editFilm(film);
      reloadFilms(filt);
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const changeFavoriteFilm = async (film) => {
    try {
      setLoading(true);
      await API.favoriteFilm(film.id);
      reloadFilms(filt);
      setLoading(false);
    } catch (e) {
      throw (e);
    }
  }

  const changeRatingFilm = async (film, value) => {
    if (value != film.rating) {
      try {
        setLoading(true);
        film.rating = value
        await API.editFilm(film);
        reloadFilms(filt);
        setLoading(false);
      } catch (e) {
        throw (e);
      }
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
      setMessage({ msg: 'Incorrect username or password', type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setFilms([]);
    setMessage('');
  };


  return (
    <div className="App">
      {message && <Row>
        <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row>}

      <BrowserRouter>
        <Routes>
          <Route path='/login' element={
            loggedIn ? <Navigate replace to='/' /> : <LoginPage login={handleLogin} />
          } />

          <Route element={<AppLayout loggedIn={loggedIn} handleLogout={handleLogout} />}>
            <Route path='/' element={loggedIn ? <FilmsPage loading={loading} filt={''} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/favorites' element={loggedIn ? <FilmsPage loading={loading} filt={'favorites'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/bestrated' element={loggedIn ? <FilmsPage loading={loading} filt={'bestrated'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/lastmonth' element={loggedIn ? <FilmsPage loading={loading} filt={'lastmonth'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/unseen' element={loggedIn ? <FilmsPage loading={loading} filt={'unseen'} setFilt={setFilt} films={films} changeFavoriteFilm={changeFavoriteFilm} changeRatingFilm={changeRatingFilm} openEdit={openEdit} removeFilm={removeFilm} setMode={setMode} /> : <Navigate replace to='/login' />} />
            <Route path='/addFilm' element={loggedIn ? <AddFilmPage loading={loading} mode={mode} setMode={setMode} addFilm={addFilm} /> : <Navigate replace to='/login' />} />
            <Route path='/editFilm' element={loggedIn ? <EditFilmPage loading={loading} key={editedFilm.id} mode={mode} setMode={setMode} editFilm={editFilm} editedFilm={editedFilm} /> : <Navigate replace to='/login' />} />
          </Route>

          <Route path='*' element={<h1>404 Page not found</h1>} />

        </Routes>
      </BrowserRouter >
    </div>
  );
}

function FilmsPage(props) {

  useEffect(() => {
    props.setFilt(props.filt)
  });

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
        {!props.loading &&
          <FilmTable
            filt={props.filt}
            films={props.films}
            changeFavoriteFilm={props.changeFavoriteFilm}
            changeRatingFilm={props.changeRatingFilm}
            openEdit={props.openEdit}
            removeFilm={props.removeFilm}
          />}
        {!props.loading && <AddButton setMode={props.setMode} />}
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
          {!props.loading && <AddFilmForm
            mode={props.mode}
            setMode={props.setMode}
            addFilm={props.addFilm}
          />}
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
          {!props.loading && <AddFilmForm
            key={props.editedFilm.id}
            mode={props.mode}
            setMode={props.setMode}
            editFilm={props.editFilm}
            editedFilm={props.editedFilm}
          />}
        </div>
      </Col>
    </Row>
  );
}


function LoginPage(props) {
  return (
    <Container className="Auth-form-container">
      <Row className="align-items-center Auth-form" class="fill">
        <Col md={{ span: 6, offset: 3 }}><LoginForm login={props.login} /></Col>
      </Row>
    </Container>
  );
}


function AppLayout(props) {
  return (
    <div>
      <MyNavbar loggedIn={props.loggedIn} handleLogout={props.handleLogout} />
      <Container className="Content">
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
