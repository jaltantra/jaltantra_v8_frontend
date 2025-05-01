import React from 'react';

const CostTable = ({ costs }) => {
  return (
    <div className='table-container2'>
    <table>
      <thead>
        <tr>
          <th>Diameter (mm)</th>
          <th>Length (m)</th>
          <th>Cost (Rs)</th>
          <th>Cummulative Cost (Rs)</th>
          {/* Add more headers as needed */}
        </tr>
      </thead>
      <tbody>
        {costs.map((cost, index) => (
          <tr key={index}>
            <td>{cost.diameter}</td>
            <td>{cost.length?.toFixed(2)}</td>
            <td>{cost.cost?.toFixed(2)}</td>
            <td>{cost.cumulativecost?.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default CostTable;
