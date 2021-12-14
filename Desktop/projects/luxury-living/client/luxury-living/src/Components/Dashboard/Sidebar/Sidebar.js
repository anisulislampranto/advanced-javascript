import { faCommentDots, faListUl, faPlus, faShoppingCart, faTasks, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../App';
import './Sidebar.css';


const Sidebar = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [adminEmail, setAdminEmail] = useState([]);

    useEffect(()=> {
        fetch('http://localhost:4040/adminPanel')
        .then(res => res.json())
        .then(data => setAdminEmail(data[0].adminEmail))
    },[])
    

    return (
        <div>
            <ul className="list-unstyled">
                {
                    loggedInUser.email === adminEmail ? 
                    <>
                        <li>
                            <Link to='/orderList' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faListUl}/> Order List</Link>
                        </li>
                        <li>
                            <Link to='/addservices' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faPlus}/> Add Service</Link>
                        </li>
                        <li>
                            <Link to='/addprojects' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faPlus}/> Add Project</Link>
                        </li>
                        <li>
                            <Link to='/makeadmin' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faUserCog}/> Make Admin</Link>
                        </li>
                        <li>
                            <Link to='/manageservices' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faTasks}/> Manage Services</Link>
                        </li> 
                        
                    </> 
                    : 
                    <>
                        <li>
                            <Link to='/book' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faShoppingCart}/> Book</Link>
                        </li>
                        <li>
                            <Link to='/bookings' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faListUl}/> Bookings</Link>
                        </li>
                        <li>
                            <Link to='/addReview' className="text-decoration-none" style={{color: '#251d58'}}> <FontAwesomeIcon icon={faCommentDots}/> Add Review </Link>
                        </li>
                    </>
                }

            </ul>
        </div>
    );
};

export default Sidebar;