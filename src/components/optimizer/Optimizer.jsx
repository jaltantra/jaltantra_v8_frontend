import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Optform from '../Optform/Optform'
import Optbar from '../Optbar/Optbar'
import { useState } from 'react'

import './Optimizer.css'
const Optimizer = () => {
  const [presentform, setPresentform] = useState('general');
  const [commpiperows, setCommpiperows] = useState([]);
  const [piperows, setPiperows] = useState([]);
  const [noderows, setNoderows] = useState([]);
  const [valverows, setValverows] = useState([]);
  const [esrenabled, setEsrenabled]=useState(false);
  const [esrrows, setEsrrows] = useState([]);
  const [withesrnodes, setWithesrnodes] = useState([]);
  const [withoutesrnodes, setWithoutesrnodes]= useState([]);
  const [secnethrs,  setSecnethrs] = useState('');
  const [esrcapfactor, setEsrcapfactor] = useState('');
  const [maxesrheight, setMaxesrheight] =useState ('');
  const [esrat0enabled, setEsrat0enabled] = useState(false);
  const [pumpsenabled, setPumpsenabled]= useState(false);
  const [minpumpsize,  setMinpumpsize] = useState('');
  const [pumpeff,  setPumpeff] = useState('');
  const [ccost,   setCcost] = useState('');
  const [ecost,    setEcost] = useState('');
  const [designlt,   setDesignlt] = useState('');
  const [discount,   setDiscount] = useState('');
  const [inflation,    setInflation] = useState('');
  const [withoutpumps,  setWithoutpumps] = useState([]);
  const [pumprows,   setPumprows] = useState([]);
  const [projectname,   setProjectname] = useState('');
  const [orgname,    setOrgname] = useState('');
  const [minnodepress,   setMinnodepress] = useState('');
  const [maxheadloss,    setMaxheadloss] = useState('');
  const [minheadloss,     setMinheadloss] = useState('');
  const [maxwaterspeed,    setMaxwaterspeed] = useState('');
  const [maxpipepress,     setMaxpipepress] = useState('');
  const [supplyhours,     setSupplyhours] = useState('');
  const [sourcenodeid,      setSourcenodeid] = useState('');
  const [sourcenodename,      setSourcenodename] = useState('');
  const [sourcehead,       setSourcehead] = useState('');
  const [sourceelevation,    setSourceelevation] = useState('');
  const [defaultroughness,    setDefaultroughness] = useState('');
  const [success,  setSuccess] = useState(false);
  const [result, setResult] =useState(null);
  const [mapnodedata, setMapnodedata]=useState([])
  const [mappipedata, setMappipedata]=useState([])


  const reset =  () => {
    if(confirm("Are you sure? You will lose all the form data."))
    {
      setPresentform('general');
      setCommpiperows([]);
      setPiperows([]);
      setNoderows([]);
      setValverows([]);
      setEsrrows([]);
      setWithesrnodes([]);
      setWithoutesrnodes([]);
      setSecnethrs('');
      setEsrcapfactor('');
      setMaxesrheight('');
      setEsrat0enabled(false);
      setPumpsenabled(false);
      setMinpumpsize('');
      setPumpeff('');
      setCcost('');
      setEcost('');
      setDesignlt('');
      setDiscount('');
      setInflation('');
      setWithoutpumps([]);
      setPumprows([]);
      setProjectname('');
      setOrgname('');
      setMinnodepress('');
      setMaxheadloss('');
      setMinheadloss('');
      setMaxwaterspeed('');
      setMaxpipepress('');
      setSupplyhours('');
      setSourcenodeid('');
      setSourcenodename('');
      setSourcehead('');
      setSourceelevation('');
      setDefaultroughness('');
      setSuccess(false);
      setResult(null);
      setEsrenabled(false);
      setPumpenabled(false);
      setMapnodedate([]);
      setMappipedate([]);
    }
  }

  const props = {
    presentform: presentform,
    setPresentform: setPresentform,
    commpiperows: commpiperows,
    setCommpiperows: setCommpiperows,
    piperows: piperows,
    setPiperows: setPiperows,
    noderows: noderows,
    setNoderows: setNoderows,
    valverows: valverows,
    setValverows: setValverows,
    esrenabled: esrenabled,
    setEsrenabled: setEsrenabled,
    esrrows: esrrows,
    setEsrrows: setEsrrows,
    withesrnodes: withesrnodes,
    setWithesrnodes: setWithesrnodes,
    withoutesrnodes: withoutesrnodes,
    setWithoutesrnodes: setWithoutesrnodes,
    secnethrs: secnethrs,
    setSecnethrs: setSecnethrs,
    esrcapfactor: esrcapfactor,
    setEsrcapfactor: setEsrcapfactor,
    maxesrheight: maxesrheight,
    setMaxesrheight: setMaxesrheight,
    esrat0enabled: esrat0enabled,
    setEsrat0enabled: setEsrat0enabled,
    pumpsenabled: pumpsenabled,
    setPumpsenabled: setPumpsenabled,
    minpumpsize:  minpumpsize,
    setMinpumpsize: setMinpumpsize,
    pumpeff: pumpeff,
    setPumpeff: setPumpeff,
    ccost: ccost,
    setCcost: setCcost,
    ecost: ecost,
    setEcost: setEcost,
    designlt: designlt,
    setDesignlt: setDesignlt,
    discount: discount,
    setDiscount: setDiscount,
    inflation: inflation,
    setInflation: setInflation,
    withoutpumps:  withoutpumps,
    setWithoutpumps: setWithoutpumps,
    pumprows: pumprows,
    setPumprows: setPumprows,
    projectname: projectname,
    setProjectname: setProjectname,
    orgname: orgname,
    setOrgname: setOrgname,
    minnodepress: minnodepress,
    setMinnodepress: setMinnodepress,
    maxheadloss: maxheadloss,
    setMaxheadloss: setMaxheadloss,
    minheadloss: minheadloss,
    setMinheadloss: setMinheadloss,
    maxwaterspeed: maxwaterspeed,
    setMaxwaterspeed: setMaxwaterspeed,
    maxpipepress: maxpipepress,
    setMaxpipepress: setMaxpipepress,
    supplyhours: supplyhours,
    setSupplyhours: setSupplyhours,
    sourcenodeid: sourcenodeid,
    setSourcenodeid: setSourcenodeid,
    sourcenodename: sourcenodename,
    setSourcenodename: setSourcenodename,
    sourcehead: sourcehead,
    setSourcehead: setSourcehead,
    sourceelevation: sourceelevation,
    setSourceelevation: setSourceelevation,
    defaultroughness:  defaultroughness,
    setDefaultroughness: setDefaultroughness,
    success:  success,
    setSuccess: setSuccess,
    result:  result,
    setResult: setResult,
    reset: reset,
    mapnodedata: mapnodedata,
    setMapnodedata: setMapnodedata,
    mappipedata:  mappipedata,
    setMappipedata: setMappipedata
  }
  return (
    <div  className="optimizer">
    <Sidebar {...props}/>
    <Optform {...props}/>
    <Optbar  {...props}/>
    </div>
  )
}

export default Optimizer
