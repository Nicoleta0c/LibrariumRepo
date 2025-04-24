import React from 'react';
import HomePage from '../pages/HomePage';
import Cards from '../pages/Cards';
import Recomendation from '../pages/recomendation';
import { useAppContext } from '../context/AppContext';
import Footer from '../pages/footer';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <div className="landing-page">
      <HomePage />
      {isAuthenticated && <Recomendation />}
      <Cards />
      <Footer/>
    </div>
  );
};

export default LandingPage;
