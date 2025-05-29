import React, { useContext, useState} from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import './Navbar.css';
import toggle_dark from '../../assets/day.png';
import toggle_light from '../../assets/night.png';
import { AuthContext } from '../../AuthContext'; // Import the AuthContext

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Navbar = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const location = useLocation();
  const { isLoggedIn, logout } = useContext(AuthContext); // Get the login state and logout function from context
  const navigate = useNavigate();

  const toggle_mode = () => {
    props.theme === 'light' ? props.setTheme('dark') : props.setTheme('light');
  };

    // Handler for protected nav
  const handleNav = (path, event) => {
    // If leaving /optimizer or /loop_optimizer, show modal
    if (
      (location.pathname === '/optimizer' || location.pathname === '/loop_optimizer') &&
      path !== location.pathname
    ) {
      event.preventDefault();
      setShowModal(true);
      setNextPath(path);
    }
    // Otherwise, allow normal navigation
  };

  const handleModalYes = () => {
    setShowModal(false);
    navigate(nextPath); // Actually navigate
  };

  // Handler for "Cancel"
  const handleModalCancel = () => {
    setShowModal(false);
    setNextPath('');
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
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-message">The uploaded data will be lost. Do you want to continue?</div>
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleModalYes}>Yes</button>
              <button className="modal-btn" onClick={handleModalCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Link to="/" className='logo'><div></div>Jaltantra.</Link>

      <ul>
        <li><Link to="/" className={location.pathname === '/'?'active':''} onClick={(e) => handleNav('/', e)}>Home</Link></li>
        <li><Link to="/optimizer" className={location.pathname === '/optimizer'?'active':''} onClick={(e) => handleNav('/optimizer', e)}>Branch Optimizer</Link></li>
        <li><Link to="/loop_optimizer" className={location.pathname === '/loop_optimizer'?'active':''} onClick={(e) => handleNav('/loop_optimizer', e)}>Loop Optimizer</Link></li>
        <li><Link to="/about" className={location.pathname === '/about'?'active':''} onClick={(e) => handleNav('/about', e)}>Visualizer</Link></li>
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
