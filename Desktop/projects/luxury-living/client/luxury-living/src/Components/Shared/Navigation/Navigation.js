import React from "react";
import logo from "../../../images/logo.png";
import './Navigation.css';
import {Link} from 'react-router-dom';

const Navigation = () => {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                <img style={{width: '100px'}} src={logo} alt="" />
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
                    <li class="nav-item px-3">
                        <Link to='/home' class="nav-link active" aria-current="page" href="#">Home</Link>
                    </li>
                    <li class="nav-item px-3">
                        <Link to='/admin' class="nav-link active" href="#">Admin</Link>
                    </li>
                    <li class="nav-item px-3">
                        <Link to='/about' class="nav-link active" href="#" >About us</Link>
                    </li>
                    <li class="nav-item px-3">
                        <Link to='/projects' class="nav-link active" href="#">Projects</Link>
                    </li>
                    <li class="nav-item px-3">
                        <Link to='/contact' class="nav-link active" href="#">Contact</Link>
                    </li>
                    
                </ul>
                <button class="btn btn-primary">Login</button>
            </div>
        </div>
    </nav>
  );
};

export default Navigation;
