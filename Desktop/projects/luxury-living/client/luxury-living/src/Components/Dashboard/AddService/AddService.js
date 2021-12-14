import React, { useState } from 'react';
import Navigation from '../../Shared/Navigation/Navigation';
import Sidebar from '../Sidebar/Sidebar';


const AddService = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [icon, setIcon] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        if (!icon) {
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description)
        formData.append('price', price)
        formData.append('icon', icon); 

        fetch('http://localhost:4040/addServices', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    setSuccess('Service added successfully')
                    console.log('Service added successfully')
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    return (
        <div>
            <Navigation/>
            <div className="container-fluid row d-flex">
                <div className="col-md-2 sidebar"><Sidebar/></div>
                <div className="col-md-10" style={{position: 'absolute', right:0}}>

                    <div>
                        <h1>Add Service</h1>
                        <form onSubmit={handleSubmit} className="container">
                            
                            <div className="form-group">
                                <label for="exampleInputName1">Service title</label>
                                <input onBlur={e => setTitle(e.target.value)} type="text" name="title" className="form-control"  placeholder="Enter Service title" />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Service Description</label>
                                <input onBlur={e => setDescription(e.target.value)} type="text" name="description" className="form-control"  placeholder="Enter Service Description" />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Service Price</label>
                                <input onBlur={e => setPrice(e.target.value)} type="number" name="price" className="form-control"  placeholder="Enter Service Price" />
                            </div>
                            <div className="form-group">
                                <label for="exampleFormControlFile1">Upload Service Icon</label>
                                <input onChange={e => setIcon(e.target.files[0])} type="file" className="form-control" placeholder="Service Icon" />
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

export default AddService;