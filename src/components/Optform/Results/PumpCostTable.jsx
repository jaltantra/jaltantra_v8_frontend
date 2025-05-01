import React from 'react';

const PumpCostTable = ({ pumpCost }) => {
  return (
    <div className='table-container2'>
    <table>
      <thead>
        <tr>
          <th>Pipe ID</th>
          <th>Pump Head</th>
          <th>Pump Power (kW)</th>
          <th>Energy Cost (Rs)</th>
          <th>Capital Cost (Rs)</th>
          <th>Total Cost (Rs)</th>
        </tr>
      </thead>
      <tbody>
        {pumpCost.map((pump, index) => (
          <tr key={index}>
            <td>{pump.pipeid}</td>
            <td>{pump.pumphead?.toFixed(2)}</td>
            <td>{pump.pumppower?.toFixed(2)}</td>
            <td>{pump.energycost?.toFixed(2)}</td>
            <td>{pump.capitalcost?.toFixed(2)}</td>
            <td>{pump.totalcost?.toFixed(2)}</td>
            {/* Add more columns as needed */}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default PumpCostTable;
