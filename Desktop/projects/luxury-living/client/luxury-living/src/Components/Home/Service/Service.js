import React from 'react';

const Service = ({service}) => {
    return (
        <div className="col-md-4">   
            <img className="img-fluid mb-3" style={{ width: '80px', height: '80px' }} src={`data:image/png;base64,${service.image}`} alt="" />
            <h5>{service.name}</h5>
            <p>{service.description}</p>
        </div>
    );
};

export default Service;