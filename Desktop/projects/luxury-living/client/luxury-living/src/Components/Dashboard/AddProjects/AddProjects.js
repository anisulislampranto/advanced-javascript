import React, { useState } from 'react';
import Navigation from '../../Shared/Navigation/Navigation';
import Sidebar from '../Sidebar/Sidebar';

const AddProjects = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        if (!image) {
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', location)
        formData.append('image', image); 

        fetch('http://localhost:4040/addProject', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    setSuccess('Doctor added successfully')
                    console.log('doctor added successfully')
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }



    return (
        <div>
            <Navigation/>
            <div className="container-fluid row"> 
                <div className="col-md-2 sidebar"><Sidebar/></div>
                
                <div className="col-md-10" style={{position: 'absolute', right:0}}>

                    <div>
                        <h1>Add Project</h1>
                        <form onSubmit={handleSubmit} className='container'>
                        
                        <div className="form-group">
                            <label for="exampleInputName1">Project Name</label>
                            <input onBlur={e => setName(e.target.value)} type="text" name="name" className="form-control"  placeholder="Enter Name" />
                        </div>
                        <div className="form-group">
                            <label for="exampleInputEmail1">Project Location</label>
                            <input onBlur={e => setLocation(e.target.value)} type="text" name="location" className="form-control"  placeholder="Enter Location" />
                        </div>
                        <div className="form-group">
                            <label for="exampleFormControlFile1">Upload A Image</label>
                            <input onChange={e => setImage(e.target.files[0])} type="file" className="form-control" placeholder="Picture" />
                        </div>
                        
                         <button type="submit" class="btn btn-primary my-3">Submit</button>
                        </form>
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AddProjects;