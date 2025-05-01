import React from 'react'
import { useState } from 'react';

const Nodes = (props) => {
    const [nodeid, setNodeid] = useState('');
    const [nodename, setNodename] = useState('');
    const [elevation, setElevation] = useState('');
    const [demand, setDemand] = useState('');
    const [minpressure, setMinpress] = useState('');
  
    // Function to handle adding a new row
    const addRow = () => {
      // Validate inputs
      if (nodeid === '' || nodename === '' || elevation === '' || minpressure === '') {
        alert("Please fill all fields");
        return;
      }
  
      // Add the new row to the state
      props.setNoderows([...props.noderows, { nodeid, nodename, elevation,  demand, minpressure }]);
  
      // Clear input fields
      setNodeid('');
      setNodename('');
      setElevation('');
      setDemand('');
      setMinpress('');
    };
  
    // Function to handle deleting a row
    const deleteRow = (index) => {
      const newRows = props.noderows.filter((row, i) => i !== index);
      props.setNoderows(newRows);
    };
  
    return (
      <div className="optimizer-form">
        <h1>Nodes</h1>
        <div className='table-container2'>
        <table className="myTable">
          <thead>
            <tr>
              <th>Node ID</th>
              <th>Node Name</th>
              <th>Elevation (m)</th>
              <th>Demand (lps)</th>
              <th>Min. Pressure (m)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.noderows.map((row, index) => (
              <tr key={index}>
                <td>{row.nodeid}</td>
                <td>{row.nodename}</td>
                <td>{row.elevation}</td>
                <td>{row.demand}</td>
                <td>{row.minpressure}</td>
                <td>
                  <button onClick={() => deleteRow(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
  
        <div className="table-entry">
          <input
            type="number"
            value={nodeid}
            onChange={(e) => setNodeid(e.target.value)}
            placeholder="Node ID"
          />
          <input
            type="text"
            value={nodename}
            onChange={(e) => setNodename(e.target.value)}
            placeholder="Node Name"
          />
          <input
            type="number"
            value={elevation}
            onChange={(e) => setElevation(e.target.value)}
            placeholder="Elevation (m)"
          />
          <input
            type="float"
            value={demand}
            onChange={(e) => setDemand(e.target.value)}
            placeholder="Demand (lps)"
          />
          <input
            type="number"
            value={minpressure}
            onChange={(e) => setMinpress(e.target.value)}
            placeholder="Min. Pressure"
          />
          <button onClick={addRow}>Add</button>
        </div>
      </div>
    );
}

export default Nodes
