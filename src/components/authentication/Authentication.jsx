import './Authentication.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

// Notification Modal Component
const NotificationModal = ({ message, isVisible }) => {
    return (
        <div className={`notification-modal ${isVisible ? 'visible' : ''}`}>
            <p>{message}</p>
        </div>
    );
};

const baseURL = import.meta.env.VITE_API_BASE_URL;
const loginEndpoint = `${baseURL}/api/login`;
const signupEndpoint = `${baseURL}/api/register`; // Assuming there's a signup endpoint

const Authentication = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // State for login form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for signup form
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [organization, setOrganization] = useState('');
    const [designation, setDesignation] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    // Notification state
    const [notification, setNotification] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setCountry('');
        setState('');
        setOrganization('');
        setDesignation('');
        setSignupEmail('');
        setSignupPassword('');
    };

    // Handle login form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('jwtToken', data.token);
                login();
                showNotification('Login successful!');
                clearForm(); // Clear the form
                navigate('/');
                window.location.reload();
            } else {
                showNotification(data.message || 'Authentication failed. Please check your credentials.');
            }
        } catch (error) {
            showNotification('An error occurred. Please try again later.');
        }
    };

    // Handle signup form submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: name,
            country: country,
            state: state,
            organization: organization,
            designation: designation,
            email: signupEmail,
            password: signupPassword,
        };

        try {
            const response = await fetch(signupEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Signup successful! Please log in.');
                clearForm(); // Clear the form
                navigate('/');
                window.location.reload(); // Switch to login form after successful signup
            } else {
                showNotification(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            showNotification('An error occurred. Please try again later.');
        }
    };

    // Show notification modal
    const showNotification = (message) => {
        setNotification(message);
        setIsModalVisible(true);

        // Automatically hide the modal after 5 seconds
        setTimeout(() => {
            setIsModalVisible(false);
        }, 5000);
    };

    // Toggle active class for signup and login
    const add_active = () => {
        setIsLogin(false);
        const container = document.getElementById('login-box');
        container.classList.add('active');
    };

    const remove_active = () => {
        setIsLogin(true);
        const container = document.getElementById('login-box');
        container.classList.remove('active');
    };

    return (
        <div className="auth-container">
            {/* Notification Modal */}
            <NotificationModal message={notification} isVisible={isModalVisible} />

            <div className='login-box' id='login-box'>
                <div className="form-container sign-up">
                    <form onSubmit={handleSignupSubmit} id='registerform'>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Organisation/Institute"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={handleLoginSubmit} id='loginform'>
                        <h1>Enter Credentials</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <a href="#">Forgot Password?</a>
                        <button type="submit">LogIn</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Already have an account?</h1>
                            <p>Log in with credentials to use all of the site features.</p>
                            <button className="hidden" id="login" onClick={remove_active}>LogIn</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>New to Jaltantra?</h1>
                            <p>Register with your personal details to use all of the site features.</p>
                            <button className="hidden" id="register" onClick={add_active}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Authentication;
