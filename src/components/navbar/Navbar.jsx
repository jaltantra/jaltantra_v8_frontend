import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import toggle_dark from '../../assets/day.png';
import toggle_light from '../../assets/night.png';
import { AuthContext } from '../../AuthContext'; // Import the AuthContext

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Navbar = (props) => {
  const { isLoggedIn, logout } = useContext(AuthContext); // Get the login state and logout function from context
  const navigate = useNavigate();

  const toggle_mode = () => {
    props.theme === 'light' ? props.setTheme('dark') : props.setTheme('light');
  };

  const handleLogout = async () => {
    try {
      // Send the logout request to the server
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(baseURL+'/api/logout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
        logout(); // Update the context to log out
        localStorage.removeItem('jwtToken'); // Remove the token from localStorage
        navigate('/auth'); // Redirect to home after logout
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <div className="navbar">
      <Link to="/" className='logo'><div></div>Jaltantra.</Link>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/optimizer">Branch Optimizer</Link></li>
        <li><Link to="/loop_optimizer">Loop Optimizer</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <div className='side-nav'>
        {isLoggedIn ? (
          <button className="login-button" onClick={handleLogout}>Logout</button> // Show Logout button if logged in
        ) : (
          <Link className="login-button" to="/auth">Login/Signup</Link> // Show Login/Signup link if not logged in
        )}
        <img onClick={toggle_mode} src={props.theme === 'light' ? toggle_light : toggle_dark} alt="" className='toggle-icon'/>
      </div>
    </div>
  );
};

export default Navbar;
