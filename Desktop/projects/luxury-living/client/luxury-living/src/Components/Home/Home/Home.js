import React from 'react';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Projects from '../Projects/Projects';
import Services from '../Services/Services';
import Reviews from '../Reviews/Reviews'

const Home = () => {
    return (
        <div>
            <Header/>
            <Projects/>
            <Services/>
            <Reviews />
            <Contact/>
            <Footer/>
        </div>
    );
};

export default Home;