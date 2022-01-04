import React from 'react';
import './HeaderBody.css'

const HeaderBody = () => {
    return (
        <div className='header-body'>
            <div className='banner'>
                <h1> Best Academic Areas <br /> you will find here</h1> <br />
                <p>This interactive tutorial introduces the student to the world of business management. The tutorial is divided into 4 sections: trade, trading activity, the complex sale and the personal sale process.</p>
            </div>
            <div className='header-info'>
                <h2 style={{color: '#583bab'}}>Academic Areas</h2>
                <div className='header-info-details'>
                    <table>
                        <tr>
                            <td>ECONOMIC ENVIRONMENT & PUBLIC AFFAIRS</td>
                            <td>STRATEGY</td>
                        </tr>
                        <tr>
                            <td>ENTREPRENEURSHIP</td>
                            <td>DIGITAL TECHNOLOGIES & DATA SCIENCE</td>
                        </tr>
                        <tr>
                            <td>MARKETING & COMMUNICATIONS</td>
                            <td>FINANCE</td>
                        </tr>
                        <tr>
                            <td>HUMAN RESOURCES</td>
                            <td>FINANCIAL ACCOUNTING</td>
                        </tr>
                        <tr>
                            <td>OPERATIONS & SUPPLY CHAIN MANAGEMENT</td>
                            <td>COST ACCOUNTING & MANAGEMENT CONTROL</td>
                        </tr>
                        <tr>
                            <td>INNOVATION</td>
                            <td>ORGANISATIONAL BEHAVIOUR</td>
                        </tr>
                        <tr>
                            <td>NEGOTIATION</td>
                            <td>ARCHITECTURE</td>
                        </tr>
                        <tr>
                            <td>LAW</td>
                            <td>OTHERS</td>
                        </tr>
                    </table>
                </div>
            </div>
            
        </div>
    );
};

export default HeaderBody;