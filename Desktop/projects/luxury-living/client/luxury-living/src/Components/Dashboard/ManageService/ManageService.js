import React from 'react';

const ManageService = ({service}) => {
    const {name, description, price, image} = service;

    return (
        <div className='col-md-4'>
            <img className="img-fluid mb-3 service-image" src={`data:image/png;base64,${image}`} alt="" />
            <h4>{name}</h4>
            <p>{description}</p>
            <p>${price}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    );
};

export default ManageService;