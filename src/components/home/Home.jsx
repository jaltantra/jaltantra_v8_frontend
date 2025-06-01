import React, { useRef, useEffect, useState } from 'react';
import "./Home.css";
import Data from './Data';

const Home = () => {
  // Track visibility of about section
  const aboutRef = useRef();
  const howtoRef = useRef();
  const [aboutVisible, setAboutVisible] = useState(false);
  const [howtoVisible, setHowtoVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // About section visibility
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setAboutVisible(true);
        } else {
          setAboutVisible(false);
        }
      }
      // How to use section visibility
      if (howtoRef.current) {
        const rect2 = howtoRef.current.getBoundingClientRect();
        if (rect2.top < window.innerHeight && rect2.bottom > 0) {
          setHowtoVisible(true);
        } else {
          setHowtoVisible(false);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <>
      <section className='home section' id='home' >
        <div className="home__container container grid">
          <div className="home__content grid">
            <div className="home__img"></div>
            <Data/>
          </div>
        </div>
      </section>

      <section
        ref={aboutRef}
        id="about"
        className={`about-section${aboutVisible ? " about-visible" : ""}`}
      >
        <div className="about-content">
          <h2>About</h2>
          <p>
            Jaltantra is a web-based system developed at IIT Bombay for the design and optimization of water distribution networks. It provides free access for public and academic use, integrating advanced optimization algorithms and a user-friendly interface.
          </p>
        </div>
      </section>

      <section
        ref={howtoRef}
        id="howtouse"
        className={`howto-section${howtoVisible ? " howto-visible" : ""}`}
      >
        <div className="howto-content">
          <h2>How to use?</h2>
          <ol>
            <li>Register or login with your email.</li>
            <li>Upload your water network data using the input form or Excel file.</li>
            <li>Adjust parameters and run the optimizer.</li>
            <li>Review results and download output files as needed.</li>
          </ol>
        </div>
      </section>

    </>
  );
};

export default Home;
