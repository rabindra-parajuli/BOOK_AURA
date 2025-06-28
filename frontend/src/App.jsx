import React, { useState } from 'react';
// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LearnMore from './pages/LearnMore';

// Import pages
import LandingPage from './pages/LandingPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'home':
        return <HomePage />;
      case 'learn':
        return <LearnMore setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;