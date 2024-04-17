import { ListGroup, Col, Row } from "react-bootstrap";
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import ReactStars from "react-rating-stars-component";
import React from 'react';
import { NavLink } from 'react-router-dom';

function FilmRow(props) {
  return <tr>
    <FilmData film={props.film} changeFavoriteFilm={props.changeFavoriteFilm} changeRatingFilm={props.changeRatingFilm} openEdit={props.openEdit} removeFilm={props.removeFilm} />
  </tr>;
}

function FilmData(props) {
  return (
    <ListGroup as="td" variant="flush">
      <ListGroup.Item as="li" variant="light">
        <Row>
          <Col xs={1}>
            <NavLink to='/editFilm'>
              <PencilSquare onClick={() => {
                props.openEdit(props.film)
              }} />
            </NavLink>
          </Col>
          <Col xs={1}><Trash onClick={() => props.removeFilm(props.film.id)} /></Col>
          <Col xs={3} className={props.film.favorite ? "Favorite" : ""}  >{props.film.title}</Col>
          <Col xs={3}>
            <label>
              <input
                type="checkbox"
                checked={props.film.favorite}
                onChange={() => {
                  props.changeFavoriteFilm(props.film)
                }}
              />
              Favorite
            </label>
          </Col>
          <Col xs={2}>{props.film.watchDate ? props.film.watchDate.format('YYYY-MM-DD') : ""}</Col>
          <Col xs={2}>
            <ReactStars
              key={props.film.rating}
              count={5}
              value={props.film.rating}
              onChange={(new_rating) => props.changeRatingFilm(props.film, new_rating)}
              size={24}
              isHalf={false}
            />
          </Col>
        </Row>
      </ListGroup.Item>
    </ListGroup>
  )
}

export default FilmRow;