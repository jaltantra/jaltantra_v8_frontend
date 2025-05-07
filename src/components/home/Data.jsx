import React from 'react'
import "./Home.css"
import { CgMoreO } from "react-icons/cg";

const Data = () => {
  return (
    <div className='home__data'>
      <h1 className="home__title">
        Jaltantra.
      </h1>
      

      <h3 className="home__subtitle">
        IIT Bombay
      </h3>
      <p className="home__description">
      A Free and Publicly Available System for Design and <br></br>Optimization of Water Distribution Networks
      </p>
      <button>
        Learn More <CgMoreO />
      </button>

    </div>

  )
}

export default Data
