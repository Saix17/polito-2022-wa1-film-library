import { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Film } from "./Film";
import ReactStars from "react-rating-stars-component";
import { useNavigate, NavLink } from "react-router-dom";

function AddFilmForm(props) {
    var navigate = useNavigate();
    const [title, setTitle] = useState(props.mode === 'edit' ? props.editedFilm.title : '');
    const [favorite, setFavorite] = useState(props.mode === 'edit' ? props.editedFilm.favorite : false);
    const [rating, setRating] = useState(props.mode === 'edit' ? props.editedFilm.rating : 0);
    const [watchDate, setWatchDate] = useState(props.mode === 'edit' && props.editedFilm.watchDate ? props.editedFilm.watchDate.format('YYYY-MM-DD') : '');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (props.mode === 'edit') {
            var id = props.editedFilm.id
            props.editFilm({
                "id": id,
                "title": title,
                "favorite": favorite ? 1 : 0,
                "rating": parseInt(rating),
                "watchDate": watchDate != '' ? watchDate : null,
            });
        }


        if (props.mode === 'add') {
            props.addFilm({
                "title": title,
                "favorite": favorite ? 1 : 0,
                "rating": parseInt(rating),
                "watchDate": watchDate != '' ? watchDate : null,
            });
        }

        setTitle('');
        setFavorite(false);
        setRating(0);
        setWatchDate('');
        props.setMode('show');

        navigate('/');
    }

    return <>
        <div style={{ padding: 10 }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' >
                    <Form.Label>Title</Form.Label>
                    <Form.Control type='text' value={title} required={true} placeholder="Title" onChange={(event) => { setTitle(event.target.value) }} />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Favorite</Form.Label>
                    <br />
                    <input type='checkbox' defaultChecked={favorite} onChange={() => { setFavorite(!favorite) }} />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Rating</Form.Label>
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={(new_rating) => setRating(new_rating)}
                        size={24}
                        isHalf={false}
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Watch date</Form.Label>
                    <Form.Control type='date' value={watchDate} onChange={(event) => { setWatchDate(event.target.value) }} />
                </Form.Group>
                <div align='right'>
                    <NavLink to='/'><Button variant='secondary' onClick={() => props.setMode('show')}>Cancel</Button></NavLink> &nbsp;
                    <Button type='submit' variant='success'>{props.mode === 'add' ? 'Add' : 'Save'}</Button>
                </div>
            </Form></div>
    </>

}

export { AddFilmForm };