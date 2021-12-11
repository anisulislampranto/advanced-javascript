import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

const MakeAdmin = () => {
    const [adminEmail, setAdminEmail] = useState('');
    const [adminName, setAdminName] = useState('');

    const handelSubmit = e => {
        e.preventDefault();

        const formData = new FormData()
        formData.append('adminEmail',adminEmail); 
        formData.append('adminName',adminName)

        fetch('http://localhost:4040/addAdmin', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
        .then(data => {
                if (data) {
                    console.log('admin Added')
                    alert('Admin Added Successfully')
                }
        })

    }

    return (
        <div>
            <div className="container-fluid row">
                <div className='col-md-2 sidebar'>
                    <Sidebar/>
                </div>
                <div className='col-md-10' style={{position: 'absolute', right: 0}}>
                    <h1>Make Admin</h1>
                    <form action="" onSubmit={handelSubmit} className='form-group container'>
                        <label htmlFor="">Name</label>
                        <input className='form-control mb-3' type="text" onBlur={e => setAdminName(e.target.value)} placeholder="Name"/> 
                        <label htmlFor="">Email</label>
                        <input className='form-control' type="text" onBlur={e => setAdminEmail(e.target.value)} placeholder='Email address'/> 
                        <button className='btn btn-primary my-2' type='submit'>Add Admin</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MakeAdmin;