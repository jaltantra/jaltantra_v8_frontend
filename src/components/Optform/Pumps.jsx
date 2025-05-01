import React from 'react'
import { useState } from 'react';

const Pumps = (props) => {
    const [pipeid, setPipe_id] = useState('');
    const [pumppower, setPumppower] = useState('');

    const addRow = () => {
        // Validate inputs
        if (pipeid === '' || pumppower === '') {
          alert("Please fill all fields");
          return;
        }
    
        // Add the new row to the state
        props.setPumprows([...props.pumprows, { pumppower, pipeid }]);
    
        // Clear input fields
        setPumppower('');
        setPipe_id('');
    };

    
    const deleteRow = (index) => {
        const newRows = props.pumprows.filter((row, i) => i !== index);
        props.setPumprows(newRows);
    };
    const handlewithoutSelectChange = (e) => {
        const value = e.target.value;
        if (props.withoutpumps.includes(String(value))) {
            // Remove the node from the selected nodes if already checked
            props.setWithoutpumps(props.withoutpumps.filter((pipe) => pipe !== value));
        } else {
            // Add the node to the selected nodes
            props.setWithoutpumps([...props.withoutpumps, value]);
        }
    };

    const handleCheckboxChange = () => {
        props.setPumpsenabled(!props.pumpsenabled);
        if (!props.pumpsenabled)
        {
            props.setPumprows([]);
            props.setMinpumpsize('');
            props.setPumpeff('');
            props.setCcost('');
            props.setEcost('');
            props.setDesignlt('');
            props.setDiscount('');
            props.setInflation('');
            props.setWithoutpumps([]);
        }
    };
  return (
    <div className='optimizer-form'>
        <div className='esrheading'>
            <h1>Pumps</h1>
            <input
                className='checkbox'
                type="checkbox"
                checked={props.pumpsenabled}
                onChange={handleCheckboxChange}
            />Enable Pump Costing
        </div>
        {props.pumpsenabled && <div className='esrbody'>
            <div className='generalform'>
                <div className='textform'>
                    <input
                    type="number"
                    value={props.minpumpsize}
                    onChange={(e) => props.setMinpumpsize(e.target.value)}
                    placeholder='Min Pump Size(kW)'
                    />
                    <input
                    type="number"
                    value={props.pumpeff}
                    onChange={(e) => props.setPumpeff(e.target.value)}
                    placeholder='Pump Efficiency'
                    />
                    <input
                    type="number"
                    value={props.ccost}
                    onChange={(e) => props.setCcost(e.target.value)}
                    placeholder='Capital Cost per kW'
                    />
                    <input
                    type="number"
                    value={props.ecost}
                    onChange={(e) => props.setEcost(e.target.value)}
                    placeholder='Energy Cost per kWh'
                    />
                    <input
                    type="number"
                    value={props.designlt}
                    onChange={(e) => props.setDesignlt(e.target.value)}
                    placeholder='Design Lifetime'
                    />
                    <input
                    type="number"
                    value={props.discount}
                    onChange={(e) => props.setDiscount(e.target.value)}
                    placeholder='Discount Rate'
                    />
                    <input
                    type="number"
                    value={props.inflation}
                    onChange={(e) => props.setInflation(e.target.value)}
                    placeholder='Inflation Rate'
                    />
                </div>
                  <label className='esrselection'>
                      <p>Pipes without Pumps:</p>
                      {props.piperows.map((option) => (
                          <div key={option.pipeid}>
                              <input
                                  type="checkbox"
                                  value={option.pipeid}
                                  checked={props.withoutpumps.includes(String(option.pipeid))}
                                  onChange={handlewithoutSelectChange}
                              />
                              {option.pipeid}
                          </div>
                      ))}
                  </label>
            </div>
              <div className="table-container">
                  <table className="myTable">
                      <thead>
                          <tr>
                              <th>Pipe ID</th>
                              <th>Pump Power (kWh)</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {props.pumprows.map((row, index) => (
                              <tr key={index}>
                                  <td>{row.pipeid}</td>
                                  <td>{row.pumppower}</td>
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
            onChange={(e) => setPipe_id(e.target.value)}
            placeholder="Pipe ID"
          />
          <input
            type="number"
            value={pumppower}
            onChange={(e) => setPumppower(e.target.value)}
            placeholder="Pump Power (kWh)"
          />
          <button onClick={addRow}>Add</button>
        </div>
        
        </div>}
    </div>
  )
}

export default Pumps
