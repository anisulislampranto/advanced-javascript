import React from 'react';
import { Link } from 'react-router-dom';
import './Service.css'

const Service = (props) => {
    const {title, description, image, _id, price} = props.service;
    
    return (
        <div className="col-md-4 service-card">  
            <Link to={'/book/'+_id} className='text-decoration-none service'>
                <img className="img-fluid mb-3 service-image" src={`data:image/png;base64,${image}`} alt="" />
                <h5>{title}</h5>
                <h5>${price}</h5>
                <p>{description}</p>
            </Link> 
            
        </div>
    );
};

export default Service;