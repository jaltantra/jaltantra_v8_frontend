import React from 'react'
import './Optbar.css'
import { useState, useContext, useRef, useEffect } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthContext } from '../../AuthContext';
import { useLocation } from 'react-router-dom';

// import { SiMicrosoftexcel } from "react-icons/si";
// import { SiGooglecontaineroptimizedos } from "react-icons/si";
// import { TbFileTypeXml } from "react-icons/tb";
// import { FaCodeBranch } from "react-icons/fa";
// import { MdDoneAll } from "react-icons/md";
// import { RiFolderDownloadLine } from "react-icons/ri";
import polyline from '@mapbox/polyline';

const baseURL = import.meta.env.VITE_OPT_BASE_URL;
const WAIT_TIMES = {
  '1min': 90,
  '5min': 330,
  '1hour': 3630,
};

const Optbar = (props) => {
  const location = useLocation();
  const [errorMessages, setErrorMessages] = useState('');
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("Loading...");
  const [failure, setFailure] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [selectedTime, setSelectedTime] = useState('1min');
  const [waiting, setWaiting] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const waitTimerRef = useRef();

  // Helper to start the waiting countdown
  const startWaiting = (timeLabel, retryPayload) => {
    setWaiting(true);
    setWaitTime(WAIT_TIMES[timeLabel] || 90);
    setModalVisible(false); // Hide previous modal
    setFailure(false);

    // Timer logic
    waitTimerRef.current = setInterval(() => {
      setWaitTime((t) => {
        if (t <= 1) {
          clearInterval(waitTimerRef.current);
          // Resend optimization request after wait
          retryOptimizeAfterWait(timeLabel, retryPayload);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  // Helper: re-send the optimize request (payload includes time param)
  const retryOptimizeAfterWait = async (timeLabel, prevPayload) => {
    setWaiting(false);
    setModalVisible(true);
    setModalContent("Loading...");
    setFailure(false);

    const token = localStorage.getItem('jwtToken');
    const url = baseURL + '/loopoptimizer/optimize';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(prevPayload),
    });
    const data = await response.json();
    if (
      data.status === 'Failure' &&
      typeof data.data === 'string' &&
      data.data.includes("The solver is working, refresh the page after 1 minutes to see the results")
    ) {
      // Recursive: wait again, same time
      startWaiting(timeLabel, prevPayload);
    } else if (data.status === 'Failure') {
      setModalContent(`Failure: ${data.data}`);
      setFailure(true);
    } else {
      setModalContent("Optimization completed successfully!");
      props.setSuccess(true);
      props.setResult(data);
      props.setPresentform('results')
      setTimeout(() => setModalVisible(false), 5000);
    }
  };

  const handleOptimizeWithTime = (timeLabel) => {
    setShowTimeOptions(false);
    setSelectedTime(timeLabel);
    optimize(timeLabel);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    // FileReader to load the file
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' }); // Read workbook from the file

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert sheet to JSON
      // Output the data
      props.setPresentform('general');
      parseExcelData(jsonData);// Set the data in the state
    };

    reader.readAsArrayBuffer(file); // Read the file as an array buffer
  };

  useEffect(() => () => clearInterval(waitTimerRef.current), []);

  const optimize = async (timeLabel) => {
    if (!validatedata) return;

    setModalContent("Loading...");
    setModalVisible(true);
    setFailure(false);

    const payload = {
      cmd: "save-record",
      recid: 0,
      version: "2.3.0.0",
      general: {
        name_project: props.projectname,
        min_node_pressure: parseFloat(props.minnodepress),
        def_pipe_roughness: parseFloat(props.defaultroughness),
        max_hl_perkm: parseFloat(props.maxheadloss),
        max_water_speed: parseFloat(props.maxwaterspeed),
        max_pipe_pressure: parseFloat(props.maxpipepress),
        supply_hours: parseFloat(props.supplyhours),
        source_nodeid: Number(props.sourcenodeid),
        source_nodename: props.sourcenodename,
        source_elevation: parseFloat(props.sourceelevation),
        source_head: parseFloat(props.sourcehead),
      },
      nodes: props.noderows.map((node, index) => ({ ...node, recid: index + 1 })),
      pipes: props.piperows.map((pipe, index) => ({ ...pipe, recid: index + 1 })),
      commercialPipes: props.commpiperows.map((pipe, index) => ({ ...pipe, recid: index + 1 })),
      esrCost: props.esrrows.map((pipe, index) => ({ ...pipe, recid: index + 1 })),
      pumpManual: props.pumprows.map((pump, index) => ({ ...pump, recid: index + 1 })),
      valves: props.valverows.map((valve, index) => ({ ...valve, recid: index + 1 })),
    };

    if (location.pathname === '/loop_optimizer') {
      payload.time = timeLabel;
    }

    if (props.esrenabled) {
      payload.esrGeneral = {
        secondary_supply_hours: Number(props.secnethrs),
        esr_capacity_factor: parseFloat(props.esrcapfactor),
        max_esr_height: parseFloat(props.maxesrheight),
        allow_dummy: props.esrat0enabled,
        esr_enabled: true,
      };
      if (props.withesrnodes.length !== 0) payload.esrGeneral.must_esr = props.withesrnodes.map(Number);
      if (props.withoutesrnodes.length !== 0) payload.esrGeneral.must_not_esr = props.withoutesrnodes.map(Number);
    } else {
      payload.esrGeneral = { must_esr: [], must_not_esr: [] };
    }
    if (props.pumpsenabled) {
      payload.pumpGeneral = {
        minpumpsize: parseFloat(props.minpumpsize),
        efficiency: parseFloat(props.pumpeff),
        capitalcost_per_kw: parseFloat(props.ccost),
        energycost_per_kwh: parseFloat(props.ecost),
        design_lifetime: parseFloat(props.designlt),
        discount_rate: parseFloat(props.discount),
        inflation_rate: parseFloat(props.inflation),
        pump_enabled: true,
        energycost_factor: 1,
      };
      if (props.withoutpumps.length !== 0)
        payload.pumpGeneral.must_not_pump = props.withoutpumps.map(Number);
    } else {
      payload.pumpGeneral = { must_not_pump: [], energycost_factor: 1 };
    }

    const token = localStorage.getItem('jwtToken');
    const url =
      location.pathname === '/loop_optimizer'
        ? baseURL + '/loopoptimizer/optimize'
        : baseURL + '/branchoptimizer/optimize';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    try {
      if (
        location.pathname === '/loop_optimizer' &&
        data.status === 'Failure' &&
        typeof data.data === 'string' &&
        data.data.includes("The solver is working, refresh the page after")
      ) {
        // Start waiting modal and timer
        startWaiting(timeLabel, payload);
        return;
      }
      if (data.status === 'Failure') {
        setModalContent(`Failure: ${data.data}`);
        setFailure(true);
      } else {
        setModalContent("Optimization completed successfully!");
        props.setSuccess(true);
        props.setResult(data);
        props.setPresentform('results')
        setTimeout(() => setModalVisible(false), 5000);
      }
    } catch (error) {
      setModalContent("An error occurred!");
      setFailure(true);
    }
  };
  
  const closeModal = () => {
    setModalVisible(false);
    setFailure(false);
  };

  const parseExcelData = (data) => {
    try {
      let row = 0;
      row++;
      row++;
      while (row < data.length) {
        row++;
        if (data[row][0] !== undefined && String(data[row][0]).trim().length !== 0) {
          break;
        }
        console.log("cp1");
      }

      //General Information Upload

      if (data[row][0] === undefined || String(data[row][0]).trim().length === 0) {
        console.log('hi2');
        setErrorMessages("No data found in the excel file");
        throw "";
      }
      if (data[row][0] === "Network Name" && data[row][3] !== null) {
        console.log('hi');
        props.setProjectname(data[row][3]);
      }
      else {
        console.log(data[row][0]);
        setErrorMessages("No Network Name found in the excel file");
      }
      row++;
      if (data[row][0] === "Organization Name" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setOrgname(data[row][3]);
      }
      else if (data[row][0] !== "Organization Name") {
        row--;
      }
      row++;
      if (String(data[row][0]) === "Minimum Node Pressure" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setMinnodepress(data[row][3]);
        console.log(data[row][3]);
      }
      else {
        setErrorMessages("No default Min Node Pressure present in the input file.");
      }
      row++;
      if (data[row][0] === "Default Pipe Roughness 'C'" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setDefaultroughness(data[row][3]);
      }
      else {
        setErrorMessages("No Default Roughness present in the input file.");
      }
      row++;
      if (data[row][0] === "Minimum Headloss per KM" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setMinheadloss(data[row][3]);
      }
      else {
        setErrorMessages("No minHeadLossPerKM present in the input file.");
      }
      row++;
      if (data[row][0] === "Maximum Headloss per KM" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setMaxheadloss(data[row][3]);
      }
      else {
        setErrorMessages("No maxHeadLossPerKM present in the input file.");
      }
      row++;
      if (data[row][0] === "Maximum Water Speed" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setMaxwaterspeed(data[row][3]);
      }
      else if (data[row][0] !== "Maximum Water Speed") {
        row--;
      }
      row++;
      if (data[row][0] === "Maximum Pipe Pressure" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setMaxpipepress(data[row][3]);
      }
      else if (data[row][0] !== "Maximum Pipe Pressure") {
        row--;
      }
      row++;
      if (data[row][0] === "Number of Supply Hours" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setSupplyhours(data[row][3]);
      }
      else {
        props.setSupplyhours('24');
      }
      row++;
      if (data[row][0] === "Source Node ID" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setSourcenodeid(data[row][3]);
      }
      else {
        setErrorMessages("No source node id present in the input file.");
      }
      row++;
      if (data[row][0] === "Source Node Name" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setSourcenodename(String(data[row][3]));
      }
      else {
        setErrorMessages("No source name present in the input file.");
      }
      row++;
      if (data[row][0] === "Source Elevation" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setSourceelevation(data[row][3]);
      }
      else {
        setErrorMessages("No source elevation present in the input file.");
      }
      row++;
      if (data[row][0] === "Source Head" && data[row][3] !== null && data[row][3] !== undefined) {
        props.setSourcehead(data[row][3]);
      }
      else {
        setErrorMessages("No source head present in the input file.");
      }

      //Node Data Upload
      while (row < data.length) {
        row++;
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "NODE DATA")
          break;
      }
      if (data[row][0] !== undefined && String(data[row][0]).trim() === "NODE DATA") {
        row++;
        while (row < data.length) {
          row++;
          if (data[row][0] === undefined)
            break;
          let nodeid = data[row][0];
          let nodename = data[row][1] ? data[row][1] : null;
          let elevation = data[row][2] ? data[row][2] : null;
          let demand = data[row][3] ? data[row][3] : null;
          let minpressure = data[row][4] ? data[row][4] : null;

          let newrows = props.noderows;
          newrows.push({ nodeid, nodename, elevation, demand, minpressure })
          props.setNoderows(newrows);
        }
      }
      else {
        setErrorMessages("No node data present in the input file.");
      }

      //Pipe Data Upload

      while (row < data.length) {
        row++;
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "PIPE DATA")
          break;
      }
      if (data[row][0] !== undefined && String(data[row][0]).trim() === "PIPE DATA") {
        row++;
        while (row < data.length) {
          row++;
          if (data[row][0] === undefined)
            break;
          let pipeid = data[row][0];
          let startnode = data[row][1] ? data[row][1] : null;
          let endnode = data[row][2] ? data[row][2] : null;
          let length = data[row][3] ? data[row][3] : null;
          let diameter = data[row][4] ? data[row][4] : null;
          let roughness = data[row][5] ? data[row][5] : null;
          let parallelallowed = data[row][6] ? data[row][6] : null;

          let newrows = props.piperows;
          newrows.push({ pipeid, startnode, endnode, length, diameter, roughness, parallelallowed })
          props.setPiperows(newrows);
        }
      }
      else {
        setErrorMessages("No pipe data present in the input file.");
        throw "";
      }

      //Commercial Pipe Data Upload

      while (row < data.length) {
        row++;
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "COMMERCIAL PIPE DATA")
          break;
      }
      if (data[row][0] !== undefined && String(data[row][0]).trim() === "COMMERCIAL PIPE DATA") {
        row++;
        while (row < data.length) {
          row++;
          if (data[row][0] === undefined || data[row][0] === 0)
            break;
          let diameter = data[row][0] ? data[row][0] : null;
          let roughness = data[row][1] ? data[row][1] : null;
          let cost = data[row][2] ? data[row][2] : null;

          let newrows = props.commpiperows;
          newrows.push({ diameter, roughness, cost });
          props.setCommpiperows(newrows);
        }
      }
      else {
        setErrorMessages("No pipe cost data present in the input file.");
        throw "";
      }

      //ESR Data Upload
      while (row < data.length) {
        row++;
        if (data[row][0] !== undefined && String(data[row][0]).trim().length !== 0)
          break;
      }
      if (data[row][0] !== undefined && String(data[row][0]).trim() === "ESR GENERAL DATA") {
        row++;
        if (data[row][0] === "ESR Enabled" && data[row][3] !== undefined) {
          if (Number(data[row][3]) === 1)
            props.setEsrenabled(true);
        }
        else {
          setErrorMessages("ESR enabled setting is not present in the input file.");
        }
        row++;
        if (data[row][0] !== undefined && data[row][0] === "Secondary Supply Hours" && data[row][3] !== undefined) {
          if (parseFloat(data[row][3]) > 0)
            props.setSecnethrs(data[row][3]);
        }
        else {
          setErrorMessages("No Secondary Supply Hours present in the input file.")
        }
        row++;
        if (data[row][0] !== undefined && data[row][0] === "ESR Capacity Factor" && data[row][3] !== undefined) {
          if (parseFloat(data[row][3]) > 0)
            props.setEsrcapfactor(data[row][3]);
        }
        else {
          setErrorMessages("No ESR capacity factor present in the input file.")
        }
        row++;
        if (data[row][0] !== undefined && data[row][0] === "Maximum ESR Height" && data[row][3] !== undefined) {
          if (parseFloat(data[row][3]) > 0)
            props.setMaxesrheight(data[row][3]);
        }
        else {
          setErrorMessages("No Maximum ESR height present in the input file.")
        }
        row++;
        if (data[row][0] === "Allow ESRs at zero demand nodes" && data[row][3] !== undefined) {
          if (Number(data[row][3]) === 1)
            props.setEsrat0enabled(true);
        }
        else {
          setErrorMessages("No Allow ESRs at zero demand nodes setting present in the input file.");
        }
        row++;
        // if (data[row][0] === "Nodes that must have ESRs" && data[row][3] !== undefined) {
        //   props.setWithesrnodes(String(data[row][3]).split(";"));
        // }
        row++;
        // if (data[row][0] === "Nodes that must not have ESRs" && data[row][3] !== undefined) {
        //   props.setWithoutesrnodes(String(data[row][3]).split(";"));
        // }
        // row++;
        while (row < data.length) {
          row++;
          if (data[row][0] !== undefined && String(data[row][0]).trim() === "ESR COST DATA")
            break;
        }
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "ESR COST DATA") {
          row++;
          while (row < data.length) {
            row++;
            if (data[row][0] === undefined)
              break;
            let mincapacity = data[row][0];
            let maxcapacity = data[row][1] ? data[row][1] : null;
            let basecost = data[row][2];
            let unitcost = data[row][3] ? data[row][3] : null;

            let newrows = props.esrrows;
            newrows.push({ mincapacity, maxcapacity, basecost, unitcost });
            props.setEsrrows(newrows);
          }
        }
        else {
          setErrorMessages("No esrcosts present in the input file.");
          throw "";
        }
      }
        //Pumps Data Upload
        while (row < data.length) {
          row++;
          if (data[row][0] !== undefined && String(data[row][0]).trim().length!==0)
            break;
        }
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "PUMP GENERAL DATA") {
          row++;
          if (data[row][0] === "Pump Enabled" && data[row][3] !== undefined) {
            if (Number(data[row][3]) === 1)
              props.setPumpsenabled(true);
          }
          else {
            setErrorMessages("ESR enabled setting is not present in the input file.");
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Minimum Pump Size" && data[row][3] !== undefined) {
            props.setMinpumpsize(data[row][3]);
          }
          else {
            setErrorMessages("No Minimum Pump Size present in the input file.")
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Pump Efficiency" && data[row][3] !== undefined) {
            if (parseFloat(data[row][3]) > 0)
              props.setPumpeff(data[row][3]);
          }
          else {
            setErrorMessages("No Pump Efficiency present in the input file.")
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Capital Cost per kW" && data[row][3] !== undefined) {
            props.setCcost(data[row][3]);
          }
          else {
            setErrorMessages("No Pump Capital Cost per kW present in the input file.")
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Energy Cost per kWh" && data[row][3] !== undefined) {
            props.setEcost(data[row][3]);
          }
          else {
            setErrorMessages("No Pump Energy Cost per kWh present in the input file.")
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Design Lifetime" && data[row][3] !== undefined) {
            if (parseFloat(data[row][3]) > 0)
              props.setDesignlt(data[row][3]);
          }
          else {
            setErrorMessages("No Pump Design Lifetime present in the input file.")
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Discount Rate" && data[row][3] !== undefined) {
            props.setDiscount(data[row][3]);
          }
          else {
            setErrorMessages("No Discount Rate present in the input file.")
          }
          row++;
          if (data[row][0] !== undefined && data[row][0] === "Inflation Rate" && data[row][3] !== undefined) {
            props.setInflation(data[row][3]);
          }
          else {
            setErrorMessages("No Inflation Rate present in the input file.")
          }
          row++;
          if (data[row][0] === "Pipes that must not have Pumps" && data[row][3] !== undefined) {
            props.setWithoutpumps(String(data[row][3]).split(";"));
          }
          row++;
          while (row < data.length) {
            row++;
            if (data[row][0] !== undefined && String(data[row][0]).trim().length!==0)
              break;
          }
          if (data[row][0] !== undefined && String(data[row][0]).trim() === "MANUAL PUMPS DATA") {
            row++;
            while (row < data.length) {
              row++;
              if (data[row][0] === undefined)
                break;
              let pumppower = data[row][0]? data[row][0]: null;
              let pipeid = data[row][1] ? data[row][1] : null;
  
              let newrows = props.pumprows;
              newrows.push({ pumppower, pipeid });
              props.setPumprows(newrows);
            }
          }

        }
        while (row < data.length) {
          row++;
          if (data[row][0] !== undefined && String(data[row][0]).trim().length!==0)
            break;
        }
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "VALVES DATA") {
          row++;
          while (row < data.length) {
            row++;
            if (data[row][0] === undefined)
              break;
            let pipeid = data[row][0]? data[row][0]: null;
            let valvesetting = data[row][1] ? data[row][1] : null;

            let newrows = props.valverows;
            newrows.push({ pipeid, valvesetting });
            props.setValverows(newrows);
          }
        }
        while (row < data.length) {
          row++;
          if (data[row][0] !== undefined && String(data[row][0]).trim().length!==0)
            break;
        }
        row++;
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "MAP NODE DATA") {
          row++;
          while (row < data.length) {
            row++;
            if (data[row][0] === undefined)
              break;
            let nodename = data[row][0];
            let nodeid = data[row][1];
            let lat = data[row][2];
            let lng = data[row][3];
            let isEsr =data[row][3];
            let newrows = props.mapnodedata;
            newrows.push({ nodename,  nodeid, lat, lng, isEsr });
            props.setMapnodedata(newrows);
          }
        }
        while (row < data.length) {
          row++;
          if (data[row][0] !== undefined && String(data[row][0]).trim().length!==0)
            break;
        }
        if (data[row][0] !== undefined && String(data[row][0]).trim() === "MAP PIPE DATA") {
          row++;
          while (row < data.length) {
            row++;
            if (data[row][0] === undefined)
              break;
            let encodedPath = data[row][3];
            let decodedPath = polyline.decode(encodedPath);
            let path=[]
            decodedPath.forEach((point)=>{
              path.push({lat:point[0], lng:point[1]})
            });

            console.log(decodedPath);
            let newrows = props.mappipedata;
            newrows.push({ path });
            props.setMappipedata(newrows);
          }
        }

    }
    catch (e) {
      console.log(e);
    }
  }

  const validatedata= () => {
    if(props.noderows.length === 0)
    {
      setModalContent("Failure: Please enter node data."); 
      setFailure(true);
      return false;
    }
    else{
      props.noderows.forEach((row)=>{
        if(row.elevation === null ||  row.elevation === "")
        {
          setModalContent("Failure: Please enter elevation details."); 
          setFailure(true);
          return false;
        }
      });
    }
    if(props.piperows.length === 0)
    {
      setModalContent("Failure: Please enter pipe data.");
      setFailure(true);
      return false;
    }
    if(props.commpiperows.length === 0)
    {
      setModalContent("Failure: Please enter commercial pipe data.");
      setFailure(true);
      return false;
    }
    if (props.esrenabled) {
      if (props.secnethrs === null || props.secnethrs.length === 0) {
        setModalContent("Please enter the Secondary Network Supply Hours.");
        setFailure(true);
        return false;
      }
      if (props.esrcapfactor === null || props.esrcapfactor.length === 0) {
        setModalContent("Please enter the ESR Capacity Factor.");
        setFailure(true);
        return false;
      }
      if(props.esrrows.length === 0)
      {
        setModalContent("Please enter esr cost data.");
        setFailure(true);
        return false;
      }
    }
    if(props.pumpsenabled)
    {
      if (props.minpumpsize === null || props.minpumpsize.length === 0) {
        setModalContent("Please enter the minimum Pump Size.");
        setFailure(true);
        return false;
      }
      if (props.pumpeff === null || props.pumpeff.length === 0) {
        setModalContent("Please enter the Pump Efficiency.");
        setFailure(true);
        return false;
      }
      if (props.ccost === null || props.ccost.length === 0) {
        setModalContent("Please enter the Pump Capital Cost per kW.");
        setFailure(true);
        return false;
      }
      if (props.ecost === null || props.ecost.length === 0) {
        setModalContent("Please enter the Pump Energy Cost per kWh.");
        setFailure(true);
        return false;
      }
      if (props.designlt === null || props.designlt.length === 0) {
        setModalContent("Please enter the Pump Energy Cost per kWh.");
        setFailure(true);
        return false;
      }
    }
    return true;
  }

  const handleDownload = () => {
    // Extract the relevant data arrays from props.result
    const { resultnodes, resultpipes, resultcost, resultesrcost, resultpumpcost } = props.result;
  
    // Create a new workbook
    const wb = XLSX.utils.book_new();
  
    // Add each dataset to a separate sheet
    const addSheet = (data, sheetName) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };
  
    // Add different sheets
    if (resultnodes) addSheet(resultnodes, 'Nodes');
    if (resultpipes) addSheet(resultpipes, 'Pipes');
    if (resultcost) addSheet(resultcost, 'Cost');
    if (resultesrcost) addSheet(resultesrcost, 'ESR Cost');
    if (resultpumpcost) addSheet(resultpumpcost, 'Pump Cost');
  
    // Convert the workbook to a binary Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Convert the binary Excel file to a Blob object
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
    // Use file-saver to save the Blob as a file
    saveAs(blob, `${props.projectname}.xlsx`);
  };
  
  const handleSaveInputFile = () => {
  // Rebuild Excel structure according to parseExcelData logic

  const wb = XLSX.utils.book_new();

  // Sheet as 2D array, mimicking uploaded format
  const sheet = [];

  // -- General info (mimicking input template structure) --
  sheet.push(["JalTantra: System For Optimization of Piped Water Networks, version:2.2.2.0"]); // Blank row
  sheet.push(["developed by CSE and CTARA departments of IIT Bombay"]); // Blank row
  sheet.push([]); // Blank row
  sheet.push([]); // Blank row
  sheet.push([]); // Blank row
  sheet.push([]); // Blank row

  // Project Name
  sheet.push(["Network Name", "", "", props.projectname || ""]);

  // Organization Name
  sheet.push(["Organization Name", "", "", props.orgname || ""]);

  // Minimum Node Pressure
  sheet.push(["Minimum Node Pressure", "", "", props.minnodepress || ""]);

  // Default Pipe Roughness
  sheet.push(["Default Pipe Roughness 'C'", "", "", props.defaultroughness || ""]);

  // Minimum Headloss per KM
  sheet.push(["Minimum Headloss per KM", "", "", props.minheadloss || ""]);

  // Maximum Headloss per KM
  sheet.push(["Maximum Headloss per KM", "", "", props.maxheadloss || ""]);

  // Maximum Water Speed
  sheet.push(["Maximum Water Speed", "", "", props.maxwaterspeed || ""]);

  // Maximum Pipe Pressure
  sheet.push(["Maximum Pipe Pressure", "", "", props.maxpipepress || ""]);

  // Number of Supply Hours
  sheet.push(["Number of Supply Hours", "", "", props.supplyhours || ""]);

  // Source Node ID
  sheet.push(["Source Node ID", "", "", props.sourcenodeid || ""]);

  // Source Node Name
  sheet.push(["Source Node Name", "", "", props.sourcenodename || ""]);

  // Source Elevation
  sheet.push(["Source Elevation", "", "", props.sourceelevation || ""]);

  // Source Head
  sheet.push(["Source Head", "", "", props.sourcehead || ""]);

  // -- NODE DATA section --
  sheet.push([]);
  sheet.push(["NODE DATA"]);
  sheet.push(["Node ID", "Node Name", "Elevation", "Demand", "Min Pressure"]);
  (props.noderows || []).forEach(row => {
    sheet.push([
      row.nodeid ?? "",
      row.nodename ?? "",
      row.elevation ?? "",
      row.demand ?? "",
      row.minpressure ?? ""
    ]);
  });

  // -- PIPE DATA section --
  sheet.push([]);
  sheet.push(["PIPE DATA"]);
  sheet.push(["Pipe ID", "Start Node", "End Node", "Length", "Diameter", "Roughness", "Parallel Allowed"]);
  (props.piperows || []).forEach(row => {
    sheet.push([
      row.pipeid ?? "",
      row.startnode ?? "",
      row.endnode ?? "",
      row.length ?? "",
      row.diameter ?? "",
      row.roughness ?? "",
      row.parallelallowed ?? ""
    ]);
  });

  // -- COMMERCIAL PIPE DATA section --
  sheet.push([]);
  sheet.push(["COMMERCIAL PIPE DATA"]);
  sheet.push(["Diameter", "Roughness", "Cost"]);
  (props.commpiperows || []).forEach(row => {
    sheet.push([
      row.diameter ?? "",
      row.roughness ?? "",
      row.cost ?? ""
    ]);
  });

  // -- ESR DATA section (if enabled) --
  if (props.esrenabled) {
    sheet.push([]);
    sheet.push(["ESR GENERAL DATA"]);
    sheet.push(["ESR Enabled", "", "", 1]);
    sheet.push(["Secondary Supply Hours", "", "", props.secnethrs ?? ""]);
    sheet.push(["ESR Capacity Factor", "", "", props.esrcapfactor ?? ""]);
    sheet.push(["Maximum ESR Height", "", "", props.maxesrheight ?? ""]);
    sheet.push(["Allow ESRs at zero demand nodes", "", "", props.esrat0enabled ? 1 : 0]);
    // You can add "Nodes that must have ESRs" and "must not have ESRs" as needed here
    sheet.push([]);
    sheet.push(["ESR COST DATA"]);
    sheet.push(["Min Capacity", "Max Capacity", "Base Cost", "Unit Cost"]);
    (props.esrrows || []).forEach(row => {
      sheet.push([
        row.mincapacity ?? "",
        row.maxcapacity ?? "",
        row.basecost ?? "",
        row.unitcost ?? ""
      ]);
    });
  }

  // -- PUMP DATA section (if enabled) --
  if (props.pumpsenabled) {
    sheet.push([]);
    sheet.push(["PUMP GENERAL DATA"]);
    sheet.push(["Pump Enabled", "", "", 1]);
    sheet.push(["Minimum Pump Size", "", "", props.minpumpsize ?? ""]);
    sheet.push(["Pump Efficiency", "", "", props.pumpeff ?? ""]);
    sheet.push(["Capital Cost per kW", "", "", props.ccost ?? ""]);
    sheet.push(["Energy Cost per kWh", "", "", props.ecost ?? ""]);
    sheet.push(["Design Lifetime", "", "", props.designlt ?? ""]);
    sheet.push(["Discount Rate", "", "", props.discount ?? ""]);
    sheet.push(["Inflation Rate", "", "", props.inflation ?? ""]);
    // Pipes that must not have Pumps (if any)
    sheet.push(["Pipes that must not have Pumps", "", "", (props.withoutpumps||[]).join(";")]);
    sheet.push([]);
    sheet.push(["MANUAL PUMPS DATA"]);
    sheet.push(["Pump Power", "Pipe ID"]);
    (props.pumprows || []).forEach(row => {
      sheet.push([
        row.pumppower ?? "",
        row.pipeid ?? ""
      ]);
    });
  }

  // -- VALVES DATA section --
  if ((props.valverows || []).length > 0) {
    sheet.push([]);
    sheet.push(["VALVES DATA"]);
    sheet.push(["Pipe ID", "Valve Setting"]);
    (props.valverows || []).forEach(row => {
      sheet.push([
        row.pipeid ?? "",
        row.valvesetting ?? ""
      ]);
    });
  }

  // -- MAP NODE DATA section --
  if ((props.mapnodedata || []).length > 0) {
    sheet.push([]);
    sheet.push(["MAP NODE DATA"]);
    sheet.push(["Node Name", "Node ID", "Latitude", "Longitude", "isEsr"]);
    (props.mapnodedata || []).forEach(row => {
      sheet.push([
        row.nodename ?? "",
        row.nodeid ?? "",
        row.lat ?? "",
        row.lng ?? "",
        row.isEsr ?? ""
      ]);
    });
  }

  // -- MAP PIPE DATA section --
  if ((props.mappipedata || []).length > 0) {
    sheet.push([]);
    sheet.push(["MAP PIPE DATA"]);
    sheet.push(["", "", "", "Encoded Path"]);
    (props.mappipedata || []).forEach(row => {
      sheet.push([
        "", "", "", row.path ? row.path : ""
      ]);
    });
  }

  // Convert to worksheet and save
  const ws = XLSX.utils.aoa_to_sheet(sheet);
  XLSX.utils.book_append_sheet(wb, ws, "Input Data");
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${props.projectname || 'input'}.xls`);
};


  return (
    <>
    {isLoggedIn?(
    <div className="optbar">
      
      <div className='fileupload-btn'>
        <button>
          {/* <TbFileTypeXml /> */}
          Load XML File</button>
        <button>
          {/* <FaCodeBranch /> */}
          Load Branch File</button>
        <input type="file" id="fileInput" accept=".xls" onChange={handleFileChange} />
        <label htmlFor="fileInput" className="custom-file-label">
        {/* <SiMicrosoftexcel /> */}
        Load Excel File
      </label>
      <button onClick={handleSaveInputFile}>
    Save Input File
  </button>
      </div>
      <div className='optimize-btn'>
        {props.success && <button onClick={()=>props.setPresentform('results')}>
          {/* <MdDoneAll /> */}
          Results</button>}
        {props.success && <button onClick={handleDownload}>
          {/* <RiFolderDownloadLine /> */}
          Download Results</button>}
          {location.pathname === '/loop_optimizer' ? (
            <div
              className="optimize-dropdown-container"
              onMouseEnter={() => setShowTimeOptions(true)}
              onMouseLeave={() => setShowTimeOptions(false)}
            >
              <button>Optimize</button>
              {showTimeOptions && (
                <div className="optimize-dropdown">
                  <div onClick={() => handleOptimizeWithTime('1min')}>1min</div>
                  <div onClick={() => handleOptimizeWithTime('5min')}>5min</div>
                  <div onClick={() => handleOptimizeWithTime('1hour')}>1hour</div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={optimize}>Optimize</button>
          )}

          {(modalVisible || waiting) && (
              <div className="modal-overlay">
                <div className="modal-content">
                  {waiting ? (
                    <p>
                      Optimizing... <br />
                      <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                        {waitTime} seconds left
                      </span>
                      <br />
                      Please keep this window open. Results will be fetched automatically.
                    </p>
                  ) : (
                    <p>{modalContent}</p>
                  )}
                  {failure && !waiting && (
                    <button onClick={closeModal}>Close</button>
                  )}
                </div>
              </div>
            )}
      </div>
      </div>
      ) 
      :(
        <div className='optbar'> Please login to access optimizing features</div>
      )
      }
    
    </>
  )
}

export default Optbar
