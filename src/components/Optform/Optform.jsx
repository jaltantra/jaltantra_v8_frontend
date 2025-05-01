import React from 'react'
import './Optform.css'
import General from  './General'
import Nodes from  './Nodes'
import Pipes from  './Pipes'
import CommPipes from  './CommPipes'
import Valves from  './Valves'
import Esrs from  './Esrs'
import Pumps from  './Pumps'
import Maps from  './Maps'
import Results from  './Results'






const Optform = (props) => {
  
  return (
    <div className='optform'>
      {props.presentform==='general' && <General {...props}/>}
      {props.presentform==='nodes' && <Nodes noderows={props.noderows} setNoderows={props.setNoderows}/>}
      {props.presentform==='pipes' && <Pipes piperows={props.piperows} setPiperows={props.setPiperows}/>}
      {props.presentform==='comm-pipes' && <CommPipes commpiperows={props.commpiperows} setCommpiperows={props.setCommpiperows}/>}
      {props.presentform==='valves' && <Valves valverows={props.valverows} setValverows={props.setValverows}/>}
      {props.presentform==='esrs' && <Esrs {...props}/>}
      {props.presentform==='pumps' && <Pumps {...props}/>}
      {props.presentform==='map' && <Maps {...props}/>}
      {props.presentform==='results' && <Results {...props}/>}
    </div>
  )
}

export default Optform
