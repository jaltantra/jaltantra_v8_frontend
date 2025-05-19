import React, { useEffect, useLayoutEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import About from './components/about/About';
import Optimizer from './components/optimizer/Optimizer';
import LOptimizer from './components/optimizer/LOptimizer';
import Authentication from './components/authentication/Authentication';
import Ping from './components/Ping';
import { AuthProvider } from './AuthContext';


const App = () => {

  const current_theme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light'); 

  useEffect(() => {
    localStorage.setItem('theme', theme); 
  }, [theme]);

  return (
    <Router>
      <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme}/>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/optimizer" element={<Optimizer />} />
          <Route path="/loop_optimizer" element={<LOptimizer />} />
          <Route path="/ping" element={<Ping />} />
        </Routes>
        </AuthProvider>
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App;