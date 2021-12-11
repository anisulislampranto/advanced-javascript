import React, { useState } from 'react';
import EditService from '../EditServiceForm/EditServiceForm';
import './ManageService.css'

const ManageService = ({service}) => {
    const {_id, title, description, price, image} = service;
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
      setIsOpen(true);
    }
  
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
    }
  
    function closeModal() {
        setIsOpen(false);
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
        <div className='col-md-4 service-card'>
            <img className="img-fluid mb-3 service-image" src={`data:image/png;base64,${image}`} alt="" />
            <h4>{title}</h4>
            <p>{description}</p>
            <p>${price}</p>
            <button className='btn btn-primary' onClick={openModal}>Edit</button>
            <button className='btn btn-primary mx-2' onClick={()=> handelDelete(_id)}>Delete</button>
            <EditService modalIsOpen={modalIsOpen} closeModal={closeModal} />
        </div>
    );
};

export default ManageService;