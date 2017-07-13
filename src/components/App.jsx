import React from 'react';
import Jumbotron from './Jumbotron';
import UsageSection from './UsageSection';
import DemoSection from './DemoSection';
import Footer from './Footer';

const App = () => (
  <div>
    <div className="container">
      <Jumbotron />
      <UsageSection />
      <DemoSection />
    </div>
    <Footer />
  </div>
);

export default App;
