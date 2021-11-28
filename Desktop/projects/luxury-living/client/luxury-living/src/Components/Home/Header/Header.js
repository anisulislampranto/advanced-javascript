import React from 'react';
import Navigation from '../../Shared/Navigation/Navigation';
import HeaderMain from '../HeaderMain/HeaderMain';

const Header = () => {
    return (
        <div className='header'>
            <Navigation/>
            <HeaderMain/>
        </div>
    );
};

export default Header;