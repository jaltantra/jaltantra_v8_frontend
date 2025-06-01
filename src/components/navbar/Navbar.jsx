import React, { useContext, useState, useEffect} from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import './Navbar.css';
import toggle_dark from '../../assets/day.png';
import toggle_light from '../../assets/night.png';
import { AuthContext } from '../../AuthContext'; // Import the AuthContext
import { FaUserCircle } from 'react-icons/fa';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Navbar = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
const [email, setEmail] = useState('');
  const location = useLocation();
  const { isLoggedIn, logout } = useContext(AuthContext); // Get the login state and logout function from context
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('jwtToken');
      fetch(baseURL + '/api/email', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.text())
        .then(data => setEmail(data|| ''))
        .catch(() => setEmail(''));
    }
  }, [isLoggedIn]);

  const handleCopyKey = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return;

  if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(token)
      .then(() => {
        // Optionally: show a success message
      })
      .catch(() => {
        alert("Could not copy to clipboard. Please copy it manually.");
      });
  } else {
    // Fallback for unsupported browsers
    try {
      // Create a temporary textarea to copy
      const tempInput = document.createElement("textarea");
      tempInput.value = token;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      // Optionally: show a success message
    } catch {
      alert("Clipboard API not available. Please copy manually.");
    }
  }
};



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
          <div
            className="profile-dropdown-container"
            onMouseEnter={() => setProfileDropdown(true)}
            onMouseLeave={() => setProfileDropdown(false)}
          >
            <button className="profile-button">
              <FaUserCircle size={22} style={{ marginRight: 6 }} />
              {email || "Profile"}
            </button>
            {profileDropdown && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-item" onClick={handleCopyKey}>
                  Copy Key
                </div>
                <div className="profile-dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link className="login-button" to="/auth">Login/Signup</Link>
        )}
        <img onClick={toggle_mode} src={props.theme === 'light' ? toggle_light : toggle_dark} alt="" className='toggle-icon'/>
      </div>

    </div>
  );
};

export default Navbar;
