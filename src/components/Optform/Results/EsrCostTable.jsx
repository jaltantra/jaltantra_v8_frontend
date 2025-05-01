import React from 'react';

const EsrCostTable = ({ esrCost }) => {
  return (
    <div className='table-container2'>
    <table>
      <thead>
        <tr>
          <th>ESR Node ID</th>
          <th>Node Name</th>
          <th>Elevation (m)</th>
          <th>Capacity (l)</th>
          <th>Esr Height (m)</th>
          <th>Cost (Rs)</th>
          <th>Cumulative Cost (Rs)</th>
          
          {/* Add more headers as needed */}
        </tr>
      </thead>
      <tbody>
        {esrCost.map((esr, index) => (
          <tr key={index}>
            <td>{esr.nodeid}</td>
            <td>{esr.nodename}</td>
            <td>{esr.elevation}</td>
            <td>{esr.capacity}</td>
            <td>{esr.esrheight?.toFixed(2)}</td>
            <td>{esr.cost}</td>
            <td>{esr.cumulativecost}</td>
            {/* Add more columns as needed */}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default EsrCostTable;
