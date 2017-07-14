import React from 'react';
import Jumbotron from './Jumbotron';
import DemoSection from './DemoSection';
import Footer from './Footer';

const App = () => (
  <div>
    <div className="container">
      <Jumbotron />
      <DemoSection />
    </div>
    <Footer />
  </div>
);

export default App;
