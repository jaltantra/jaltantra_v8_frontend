import React from 'react'
import './Sidebar.css'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GrNodes } from "react-icons/gr";
import { PiPipeBold } from "react-icons/pi";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { GiWaterTower } from "react-icons/gi";
import { FaArrowUpFromWaterPump } from "react-icons/fa6";
import { GiValve } from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa";
import { BiReset } from "react-icons/bi";

const Sidebar = (props) => {
  return (
    
    <div className="sidebar open">
        
        <div className="menu-bar">
            <div className="menu">
                <ul className="menu-links">
                    <li className="nav-link">
                        <a className={props.presentform==='general'?'active':''} onClick={()=>props.setPresentform('general')}>
                        <IoMdInformationCircleOutline />
                            <span className="text nav-text">General</span>
                        </a>
                    </li>
                    <li className="nav-link">
                        <a className={props.presentform==='nodes'?'active':''} onClick={()=>props.setPresentform('nodes')}>
                            <GrNodes />
                            <span className="text nav-text">Nodes</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a className={props.presentform==='pipes'?'active':''} onClick={()=>props.setPresentform('pipes')}>
                            <PiPipeBold />
                            <span className="text nav-text">Pipes</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a className={props.presentform==='comm-pipes'?'active':''} onClick={()=>props.setPresentform('comm-pipes')}>
                    <RiMoneyRupeeCircleFill />
                            <span className="text nav-text">Commercial Pipes</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a className={props.presentform==='esrs'?'active':''} onClick={()=>props.setPresentform('esrs')}>
                    <GiWaterTower />
                            <span className="text nav-text">ESRs</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a className={props.presentform==='pumps'?'active':''} onClick={()=>props.setPresentform('pumps')}>
                    <FaArrowUpFromWaterPump />
                            <span className="text nav-text">Pumps</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a className={props.presentform==='valves'?'active':''} onClick={()=>props.setPresentform('valves')}>
                    <GiValve />
                            <span className="text nav-text">Valves</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a className={props.presentform==='map'?'active':''} onClick={()=>props.setPresentform('map')}>
                    <FaMapMarkedAlt />
                            <span className="text nav-text">Map</span>
                        </a>
                    </li>
                    <li className="nav-link">
                    <a onClick={()=> props.reset()}>
                    <BiReset />
                            <span className="text nav-text">Reset</span>
                        </a>
                    </li>
                </ul>
                
                <p>Jaltantra Version: 8.0.0</p>
            </div>
            
        </div>
    </div>
    
  )
}

export default Sidebar
