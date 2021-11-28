import React from 'react';

const Project = ({project}) => {
        console.log(project)
    return (
        <div className='col-md-4'>
            <h6>{project.name}</h6>
        </div>
    );
};

export default Project;