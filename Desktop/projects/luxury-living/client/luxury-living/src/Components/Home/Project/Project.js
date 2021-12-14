import React from 'react';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Project = ({project}) => {

    return (
        <div className='col-md-4 my-3 py-3 service-card'>
            <img className="img-fluid mb-3" style={{ width: '200px', height: '200px'}} src={`data:image/png;base64,${project.image}`} alt="" />
            <h6>{project.name}</h6>
            <p> <FontAwesomeIcon icon={faMapMarkedAlt} /> {project.location}</p>
        </div>
    );
};

export default Project;