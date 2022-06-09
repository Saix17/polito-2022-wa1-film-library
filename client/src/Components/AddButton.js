import { Button } from "react-bootstrap";
import { PlusCircle } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';

function AddButton(props) {
    return <p align='right'>
        <NavLink to='/addFilm'>
            <Button variant="primary" onClick={() => {
                props.setMode('add')
            }}>
                <PlusCircle size={32} />
            </Button>
        </NavLink>
    </p>;

}

export { AddButton };