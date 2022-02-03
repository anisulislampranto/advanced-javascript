import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <div>
            <nav className='navbar navbar-light bg-light'>
                <a className='navbar-brand mx-3' href="">ATG WORLD</a>
                <div style={{width:'350px'}} class="form-group has-search">
                    <span class="fa fa-search form-control-feedback"> <FontAwesomeIcon icon={faSearch}/> </span>
                    <input style={{borderRadius:'20px', background:'#F2F2F2'}} type="text" class="form-control" placeholder="Search For Your Favorite groups in ATG" />
                </div>
                <a className='navbar text-decoration-none text-black mx-3' href="">Create Account. <span style={{color:'blue'}}>Its Free!</span></a>
            </nav>
        </div>
    );
};

export default Navbar;