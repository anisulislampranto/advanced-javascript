import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';



const Footer = () => {
    return (
        <div className='row p-5' style={{backgroundColor: '#251d58', color:'white'}}>
            <div className='col-md-3'>
                <p><FontAwesomeIcon icon={faMapMarkerAlt} /> House: 000(20th Floor), Road: 00, Mirpur DOHS, Dhaka 1216</p>
            </div>
            <div className='col-md-3'>
                <p><strong>Company</strong></p>
                <p>About</p>
                <p>Projects</p>
                <p>Our Team</p>
                <p>Terms And Conditions</p>
                <p>Submit Listing</p>
            </div>
            <div className='col-md-3'>
                <p><strong>Quck Links</strong></p>
                <p>Contact</p>
                <p>Sales</p>
                <p>Rental</p>
                <p>Our Blogs</p>
            </div>
            <div className='col-md-3'>
                <p><strong>About us</strong></p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Exercitationem vitae cumque blanditiis nam</p>
                <div className='row'>
                    
                </div>
            </div>

        </div>
    );
};

export default Footer;