import React, { useEffect, useState } from 'react';
import Project from '../Project/Project';

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:4040/projects')
        .then(res => res.json())
        .then(data => setProjects(data))
    },[])
    
    return (
        <div className='text-center'>
            <p> {projects.length} Projects</p>
            <h2>Discover the latest Interior Design available today</h2>
            <div className='container-fluid row'>
                {
                    projects.map(project=> <Project project={project}></Project>)
                }
            </div>
        </div>
    );
};

export default Projects;