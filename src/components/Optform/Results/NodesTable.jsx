import React from 'react';

const NodesTable = ({ nodes }) => {
  return (
    <div className='table-container2'>
    <table>
      <thead>
        <tr>
          <th>Node ID</th>
          <th>Node Name</th>
          <th>Elevation (m)</th>
          <th>Demand (lps)</th>
          <th>Head (m)</th>
          <th>Pressure (m)</th>
          <th>Min. Pressure (m)</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((node) => (
          <tr key={node.nodeid}>
            <td>{node.nodeid}</td>
            <td>{node.nodename}</td>
            <td>{node.elevation}</td>
            <td>{node.demand?.toFixed(2)}</td>
            <td>{node.head?.toFixed(2)}</td>
            <td>{node.pressure?.toFixed(2)}</td>
            <td>{node.minpressure}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default NodesTable;
