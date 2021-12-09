import React from 'react';

const ManageService = ({service}) => {
    const {_id, name, description, price, image} = service;

    const handleEdit = (_id) => {
            console.log('edit feild', _id);
    }
    const handelDelete = (_id)=> {

        fetch('http://localhost:4040/deleteService/' + _id, {
            method:'DELETE',
        })
        .then(res=> res.json())
        .then(data => {
            if (data) {
                console.log('Service Deleted Succesfully');
            }
        })
        
    }
    return (
        <div className='col-md-4'>
            <img className="img-fluid mb-3 service-image" src={`data:image/png;base64,${image}`} alt="" />
            <h4>{name}</h4>
            <p>{description}</p>
            <p>${price}</p>
            <button onClick={()=> handleEdit(_id)}>Edit</button>
            <button onClick={()=> handelDelete(_id)}>Delete</button>
        </div>
    );
};

export default ManageService;