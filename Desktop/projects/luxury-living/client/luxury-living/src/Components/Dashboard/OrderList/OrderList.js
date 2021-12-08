import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const OrderList = () => {

    

    return (
        <div className='container-fluid row'>
            <div className='col-md-2 sidebar' style={{position: 'absolute', right:0}}>
                <Sidebar/>
            </div>
            <div className='col-md-10'>
                <h5>Order List</h5>
            </div>
        </div>
    );
};

export default OrderList;