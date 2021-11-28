import React from 'react';
import headerBanner from './../../../images/Image/headerBanner .png';
import  './HeaderMain.css'

const HeaderMain = () => {
    return (
        <div className='container-fluid row my-5'>
            <div className='col-md-6 p-4 align-self-center'>
                <h1>We Build <br /> Your Dream </h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia repellat animi dolores odit laborum quas dignissimos laboriosam Quod veritatis facere quibusdam harum suscipit corrupti voluptatum quasi libero ipsum, nihil a quas?</p>
                <button className='btn btn-primary'>Booking</button>
            </div>
            <div className='col-md-6'>
                <img width='500px' src={headerBanner} alt="" />
            </div>
        </div>
    );
};

export default HeaderMain;