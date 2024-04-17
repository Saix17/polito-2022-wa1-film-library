import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

function Sidebar(props) {

  return (
    <ListGroup as="ul" className="Drawer" variant="flush">
      <NavLink className='navItem' to={'/'}><ListGroup.Item as="li" action active={props.filt === ''}>All</ListGroup.Item></NavLink>
      <NavLink className='navItem' to={'/favorites'}><ListGroup.Item as="li" action active={props.filt === 'favorites'}>Favorites</ListGroup.Item></NavLink>
      <NavLink className='navItem' to={'/bestrated'}><ListGroup.Item as="li" action active={props.filt === 'bestrated'}>Best Rated</ListGroup.Item></NavLink>
      <NavLink className='navItem' to={'/lastmonth'}><ListGroup.Item as="li" action active={props.filt === 'lastmonth'}>Seen Last Month</ListGroup.Item></NavLink>
      <NavLink className='navItem' to={'/unseen'}><ListGroup.Item as="li" action active={props.filt === 'unseen'}>Unseen</ListGroup.Item></NavLink>
    </ListGroup>
  )
}

export { Sidebar };