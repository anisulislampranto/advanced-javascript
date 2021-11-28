import { faCommentDots, faListUl, faPlus, faShoppingCart, faTasks, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';


const Sidebar = () => {
    return (
        <div>
            <ul className="list-unstyled">
                <li>
                    <Link className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faListUl}/> Order List</Link>
                </li>
                <li>
                    <Link to='/addservice' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faPlus}/> Add Service</Link>
                </li>
                <li>
                    <Link to='/addprojects' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faPlus}/> Add Project</Link>
                </li>
                <li>
                    <Link className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faUserCog}/> Make Admin</Link>
                </li>
                <li>
                    <Link className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faTasks}/> Manage Services</Link>
                </li>
                <li>
                    <Link className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faShoppingCart}/> Book</Link>
                </li>
                <li>
                    <Link className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faListUl}/> Booking List</Link>
                </li>
                <li>
                    <Link to='/addReview' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faCommentDots}/> Add Review </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;