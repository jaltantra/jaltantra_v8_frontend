import React from 'react'
import { useState } from 'react';

const Pipes = (props) => {
    const [pipeid, setPipeid] = useState('');
    const [startnode, setStartnode] = useState('');
    const [endnode, setEndnode] = useState('');
    const [length_, setLength] = useState('');
    const [diameter, setDiameter] = useState('');
    const [roughness, setRoughness] = useState('');
    const [parallelallowed, setParallel] = useState('');

    // Function to handle adding a new row
    const addRow = () => {
      // Validate inputs
      if (pipeid === '' || startnode === '' || endnode === '' || length_ === '') {
        alert("Please fill all fields");
        return;
      }
  
      // Add the new row to the state
      props.setPiperows([...props.piperows, { pipeid, startnode, endnode, length_,  diameter, roughness, parallelallowed }]);
  
      // Clear input fields
      setPipeid('');
      setStartnode('');
      setEndnode('');
      setLength('');
      setDiameter('');
      setRoughness('');
      setParallel('');
    };
  
    // Function to handle deleting a row
    const deleteRow = (index) => {
      const newRows = props.piperows.filter((row, i) => i !== index);
      props.setPiperows(newRows);
    };
  
    return (
      <div className="optimizer-form">
        <h1>Pipes</h1>
        <div className='table-container2'>
        <table className="myTable">
          <thead>
            <tr>
              <th>Pipe ID</th>
              <th>Start Node</th>
              <th>End Node</th>
              <th>Length (m)</th>
              <th>Diameter</th>
              <th>Roughness</th>
              <th>Parallel</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.piperows.map((row, index) => (
              <tr key={index}>
                <td>{row.pipeid}</td>
                <td>{row.startnode}</td>
                <td>{row.endnode}</td>
                <td>{row.length_}</td>
                <td>{row.diameter}</td>
                <td>{row.roughness}</td>
                <td>{row.parallelallowed}</td>
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
            value={pipeid}
            onChange={(e) => setPipeid(e.target.value)}
            placeholder="Pipe ID"
          />
          <input
            type="number"
            value={startnode}
            onChange={(e) => setStartnode(e.target.value)}
            placeholder="Start Node"
          />
          <input
            type="number"
            value={endnode}
            onChange={(e) => setEndnode(e.target.value)}
            placeholder="End Node"
          />
          <input
            type="number"
            value={length_}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Length (m)"
          />
          <input
            type="number"
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="Diameter"
          />
          <input
            type="number"
            value={roughness}
            onChange={(e) => setRoughness(e.target.value)}
            placeholder="Roughness"
          />
          <select
          value={parallelallowed}
          onChange={(e) => setParallel(e.target.value)}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select>
          <button onClick={addRow}>Add</button>
        </div>
      </div>
    );
}

export default Pipes
