import React from 'react'
import { useState } from 'react';

const CommPipes = (props) => {
    const [diameter, setDiameter] = useState('');
    const [roughness, setRoughness] = useState('');
    const [cost, setCost] = useState('');
  
    // Function to handle adding a new row
    const addRow = () => {
      // Validate inputs
      if (diameter === '' || cost === '' ) {
        alert("Please fill all fields");
        return;
      }
  
      // Add the new row to the state
      props.setCommpiperows([...props.commpiperows, { diameter, roughness, cost }]);
  
      // Clear input fields
      setDiameter('');
      setRoughness('');
      setCost('');
    };
  
    // Function to handle deleting a row
    const deleteRow = (index) => {
      const newRows = props.commpiperows.filter((row, i) => i !== index);
      props.setCommpiperows(newRows);
    };
  
    return (
      <div className="optimizer-form">
        <h1>Commercial Pipes</h1>
        <table className="myTable">
          <thead>
            <tr>
              <th>Diameter (mm)</th>
              <th>Roughness</th>
              <th>Cost (Rs)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.commpiperows.map((row, index) => (
              <tr key={index}>
                <td>{row.diameter}</td>
                <td>{row.roughness}</td>
                <td>{row.cost}</td>
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
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="Diameter (mm)"
          />
          <input
            type="number"
            value={roughness}
            onChange={(e) => setRoughness(e.target.value)}
            placeholder="Roughness"
          />
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost"
          />
          <button onClick={addRow}>Add</button>
        </div>
      </div>
    );
}

export default CommPipes
