import React, { useEffect, useState } from 'react';
import Booking from '../Booking/Booking';
import Sidebar from '../Sidebar/Sidebar';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:4040/bookings')
        .then(res => res.json())
        .then(data => setBookings(data))
    },[])

    console.log(bookings);
    

    return (
        <div className='container-fluid row'>
            <div className='col-md-2 sidebar'>
                <Sidebar/>
            </div>
            <div className='col-md-10 row' style={{position: 'absolute', right:0}}>
                    <h1>Bookings</h1>
                    {
                        bookings.map(booking => <Booking booking={booking}></Booking>)
                    }
            </div>
        </div>
    );
};

export default Bookings;