import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

const MakeAdmin = () => {
    const [adminEmail, setAdminEmail] = useState('')

    const handelSubmit = e => {
        e.preventDefault();
        

    }
    console.log(adminEmail);

    return (
        <div>
            <div className="container-fluid row">
                <div className='col-md-2 sidebar'>
                    <Sidebar/>
                </div>
                <div className='col-md-10' style={{position: 'absolute', right: 0}}>
                        <h5>Make Admin</h5>
                        <form action="" onSubmit={handelSubmit}>
                            <input type="text" onBlur={e => setAdminEmail(e.target.value)} placeholder='Insert email address'/> <br />
                            <button type='submit'>Add Admin</button>
                        </form>
                        
                </div>
            </div>
        </div>
    );
};

export default MakeAdmin;