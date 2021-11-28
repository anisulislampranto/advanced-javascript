import React from 'react';
import Navigation from '../../Shared/Navigation/Navigation';
import Sidebar from '../Sidebar/Sidebar';

const DashboardHome = () => {
    
    return (
        <div>
            <Navigation/>
            <div className="container-fluid row d-flex">
                <div className="col-md-2 sidebar"><Sidebar/></div>
                <div className="col-md-10" style={{position: 'absolute', right:0}}>
                    <h2>hello pete</h2>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;