import React, { useState } from 'react';
import Navigation from '../../Shared/Navigation/Navigation';
import Sidebar from '../Sidebar/Sidebar';

const AddReviews = () => {
    const [name, setName] = useState('');
    const [review, setReview] = useState('');
    // const []
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('review', review);

        fetch('http://localhost:4040/addReview', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
        .then(data => { 
            if (data.insertedId) {
                setSuccess('Review added successfully')
                console.log('Review added successfully')
            }
            
        })
    }



    return (
        <div>
            <Navigation/>
            <div className="container-fluid row d-flex">
                <div className="col-md-2 sidebar"><Sidebar/></div>
                <div className="col-md-10" style={{position: 'absolute', right:0}}>

                    <div>
                        <h1>Add Review</h1>
                        <form onSubmit={handleSubmit} className="container">
                        
                        <div className="form-group">
                            <label for="exampleInputName1">Name</label>
                            <input onBlur={e => setName(e.target.value)} type="text" name="name" className="form-control"  placeholder="Enter Name" />
                        </div>
                        <div className="form-group">
                            <label for="exampleInputEmail1">Feedback</label>
                            <textarea onBlur={e => setReview(e.target.value)} type="text" name="review" className="form-control" id="exampleFormControlTextarea1"  placeholder="Enter Your Feedback here" rows="6" />
                        </div>
                        {/* <div className="form-group">
                            <label for="exampleFormControlFile1">Upload A Image</label>
                            <input onChange={e => setImage(e.target.files[0])} type="file" className="form-control" placeholder="Picture" />
                        </div>
                         */}
                        <button type="submit" class="btn btn-primary my-3">Submit</button>
                    </form>
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default AddReviews;