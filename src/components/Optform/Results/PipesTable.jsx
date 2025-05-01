import React from 'react';

const PipesTable = ({ pipes }) => {
  return (
    <div className='table-container2'>
    <table>
      <thead>
        <tr>
          <th>Pipe ID</th>
          <th>Start Node</th>
          <th>End Node</th>
          <th>Length (m)</th>
          <th>Diameter (mm)</th>
          <th>Flow (lps)</th>
          <th>Speed (m/s)</th>
          <th>Roughness</th>
          <th>Headloss (m)</th>
          <th>Headloss per KM (m)</th>
          <th>Cost (Rs)</th>
          <th>Pump Head (m)</th>
          <th>Pump Power (kW)</th>
          <th>Valve Setting (m)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {pipes.map((pipe, index) => (
          <tr key={index}>
            <td>{pipe.pipeid}</td>
            <td>{pipe.startnode}</td>
            <td>{pipe.endnode}</td>
            <td>{pipe.length?.toFixed(2)}</td>
            <td>{pipe.diameter}</td>
            <td>{pipe.flow?.toFixed(2)}</td>
            <td>{pipe.speed?.toFixed(2)}</td>
            <td>{pipe.roughness}</td>
            <td>{pipe.headloss?.toFixed(2)}</td>
            <td>{pipe.headlossperkm?.toFixed(2)}</td>
            <td>{pipe.cost?.toFixed(2)}</td>
            <td>{pipe.pumphead?.toFixed(2)}</td>
            <td>{pipe.pumppower?.toFixed(2)}</td>
            <td>{pipe.valvesetting}</td>
            <td>{pipe.parallelallowed?'Parallel':''}</td>
            {/* Add more columns as needed */}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default PipesTable;
