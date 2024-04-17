//import { useState } from "react";
import { Table } from "react-bootstrap";

import FilmRow from "./FilmRow";

function FilmTable(props) {
  return <>
    <Table>
      <tbody>
        {props.films.map((f) => (<FilmRow key={f.id} film={f} changeFavoriteFilm={props.changeFavoriteFilm} changeRatingFilm={props.changeRatingFilm} openEdit={props.openEdit} removeFilm={props.removeFilm}/>))}
      </tbody>
    </Table>
  </>
}



export default FilmTable;