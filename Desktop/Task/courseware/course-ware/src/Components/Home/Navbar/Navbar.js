import React from 'react';
import './Navbar.css'

const Navbar = () => {
    return (
        <div className='navbar'>
            <a href="logo" className='logo'>CourseWare</a>
            <div className='nav-links'>
                <a href="home">Home</a>
                <a href="about">About</a>
                <a href="esources">Resources</a>
                <a href="contact">Contact Us</a>
                <a style={{color: 'white'}} className='login' href="login">Log In</a>
                <a className='registration' href="registration">Registration</a>
            </div>
        </div>
    );
};

export default Navbar;