import React, { useState } from 'react';
import EditServiceForm from '../EditServiceForm/EditServiceForm';
import './ManageService.css'

const ManageService = ({service}) => {
    const {_id, title, description, price, image} = service;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState('');

    function openModal(id) {
      setIsOpen(true);
      setSelectedServiceId(id)
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
            <button className='btn btn-primary' onClick={()=>openModal(_id)}>Edit</button>
            <button className='btn btn-primary mx-2' onClick={()=> handelDelete(_id)}>Delete</button>
            <EditServiceForm modalIsOpen={modalIsOpen} closeModal={closeModal} selectedServiceId={selectedServiceId} />
        </div>
    );
};

export default ManageService;