import React from 'react'
import { useState } from 'react';

const Esrs = (props) => {
    const [mincapacity, setMincap] = useState('');
    const [maxcapacity, setMaxcap] = useState('');
    const [basecost, setBcost] = useState('');
    const [unitcost, setUcost] = useState('');

    const addRow = () => {
        // Validate inputs
        if (mincapacity === '' || maxcapacity === '' || basecost === '' || unitcost === '') {
          alert("Please fill all fields");
          return;
        }
    
        // Add the new row to the state
        props.setEsrrows([...props.esrrows, { maxcapacity, mincapacity, basecost, unitcost}]);
    
        // Clear input fields
        setMaxcap('');
        setMincap('');
        setBcost('');
        setUcost('');
    };

    
    const deleteRow = (index) => {
        const newRows = props.esrrows.filter((row, i) => i !== index);
        props.setEsrrows(newRows);
    };
    const handlewithSelectChange = (e) => {
        const value = e.target.value;
        if (props.withesrnodes.includes(String(value))) {
            // Remove the node from the selected nodes if already checked
            props.setWithesrnodes(props.withesrnodes.filter((node) => node !== value));
        } else {
            // Add the node to the selected nodes
            props.setWithesrnodes([...props.withesrnodes, value]);
        }
    };
    const handlewithoutSelectChange = (e) => {
        const value = e.target.value;
        if (props.withoutesrnodes.includes(String(value))) {
            // Remove the node from the selected nodes if already checked
            props.setWithoutesrnodes(props.withoutesrnodes.filter((node) => node !== value));
        } else {
            // Add the node to the selected nodes
            props.setWithoutesrnodes([...props.withoutesrnodes, value]);
        }
    };

    const handleCheckboxChange = () => {
        props.setEsrenabled(!props.esrenabled);
        if (!props.esrenabled)
        {
            props.setEsrrows([]);
            props.setSecnethrs('');
            props.setEsrcapfactor('');
            props.setMaxesrheight('');
            props.setEsrat0enabled(false);
            props.setWithesrnodes([]);
            props.setWithoutesrnodes([]);
        }
    };
    const handleesrat0Change = () => {
        props.setEsrat0enabled(!props.esrat0enabled);
    };
  return (
    <div className='optimizer-form'>
        <div className='esrheading'>
            <h1>ESRs</h1>
            <input
                className='checkbox'
                type="checkbox"
                checked={props.esrenabled}
                onChange={handleCheckboxChange}
            />Enable ESR Costing
        </div>
        {props.esrenabled && <div className='esrbody'>
            <div className='generalform'>
                <div className='textform'>
                    <input
                    type="number"
                    value={props.secnethrs}
                    onChange={(e) => props.setSecnethrs(e.target.value)}
                    placeholder='Secondary Network Supply Hours'
                    />
                    <input
                    type="number"
                    value={props.esrcapfactor}
                    onChange={(e) => props.setEsrcapfactor(e.target.value)}
                    placeholder='ESR Capacity Factor'
                    />
                    <input
                    type="number"
                    value={props.maxesrheight}
                    onChange={(e) => props.setMaxesrheight(e.target.value)}
                    placeholder='Max ESR Height'
                    />
                </div>
                <input
                className='checkbox'
                type="checkbox"
                checked={props.esrat0enabled}
                onChange={handleesrat0Change}
                />Allow ESRs at zero demand nodes<br></br>
                <label className='esrselection'>
                      <p>Nodes with ESRs:</p>
                      {props.noderows.map((option) => (
                          <div key={option.nodeid}>
                              <input
                                  type="checkbox"
                                  value={option.nodeid}
                                  checked={props.withesrnodes.includes(String(option.nodeid))}
                                  onChange={handlewithSelectChange}
                              />
                              {option.nodeid}
                          </div>
                      ))}
                  </label>
                  <label className='esrselection'>
                      <p>Nodes without ESRs:</p>
                      {props.noderows.map((option) => (
                          <div key={option.nodeid}>
                              <input
                                  type="checkbox"
                                  value={option.nodeid}
                                  checked={props.withoutesrnodes.includes(String(option.nodeid))}
                                  onChange={handlewithoutSelectChange}
                              />
                              {option.nodeid}
                          </div>
                      ))}
                  </label>
            </div>
            <div className='table-container'>
        <table className="myTable">
          <thead>
            <tr>
              <th>Min Capacity (l)</th>
              <th>Max Capacity (l)</th>
              <th>Base Cost (Rs)</th>
              <th>Unit Cost (Rs) </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {props.esrrows.map((row, index) => (
              <tr key={index}>
                <td>{row.mincapacity}</td>
                <td>{row.maxcapacity}</td>
                <td>{row.basecost}</td>
                <td>{row.unitcost}</td>
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
            value={mincapacity}
            onChange={(e) => setMincap(e.target.value)}
            placeholder="Minimum Capacity"
          />
          <input
            type="number"
            value={maxcapacity}
            onChange={(e) => setMaxcap(e.target.value)}
            placeholder="Maximum Capacity"
          />
          <input
            type="number"
            value={basecost}
            onChange={(e) => setBcost(e.target.value)}
            placeholder="Base Cost"
          />
          <input
            type="number"
            value={unitcost}
            onChange={(e) => setUcost(e.target.value)}
            placeholder="Unit Cost"
          />
          <button onClick={addRow}>Add</button>
        </div>
        </div>}
    </div>
  )
}

export default Esrs
