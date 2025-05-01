import React from 'react'
import { useState } from 'react';

const Valves = (props) => {
    const [pipeid, setPipeid] = useState('');
    const [valvesetting, setValvepress] = useState('');
  
    // Function to handle adding a new row
    const addRow = () => {
      // Validate inputs
      if (pipeid === '' || valvesetting === '' ) {
        alert("Please fill all fields");
        return;
      }
  
      // Add the new row to the state
      props.setValverows([...props.valverows, { pipeid, valvesetting}]);
  
      // Clear input fields
      setPipeid('');
      setValvepress('');
    };
  
    // Function to handle deleting a row
    const deleteRow = (index) => {
      const newRows = props.valverows.filter((row, i) => i !== index);
      props.setValverows(newRows);
    };
  
    return (
      <div className="optimizer-form">
        <h1>Valves</h1>
        <table className="myTable">
          <thead>
            <tr>
              <th>Pipe ID</th>
              <th>Valve Pressure Reducing Setting (m)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.valverows.map((row, index) => (
              <tr key={index}>
                <td>{row.pipeid}</td>
                <td>{row.valvesetting}</td>
                <td>
                  <button onClick={() => deleteRow(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <div className="table-entry">
          <input
            type="number"
            value={pipeid}
            onChange={(e) => setPipeid(e.target.value)}
            placeholder="Pipe ID"
          />
          <input
            type="number"
            value={valvesetting}
            onChange={(e) => setValvepress(e.target.value)}
            placeholder="Valve Pressure Reducing Setting (m)"
          />
          <button onClick={addRow}>Add</button>
        </div>
      </div>
    );
}

export default Valves
