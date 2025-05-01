import React, { useState } from 'react';
import NodesTable from './Results/NodesTable';
import PipesTable from './Results/PipesTable';
import CostTable from './Results/CostTable';
import EsrCostTable from './Results/EsrCostTable';
import PumpCostTable from './Results/PumpCostTable';

const Results = (props) => {
  const [selectedTable, setSelectedTable] = useState('nodes');

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  return (
    <div className='optimizer-form'>
        <h1>Results ({props.projectname})</h1>
      <div className='results'>
        <label>Select Data to View: </label>
        <select onChange={handleTableChange} value={selectedTable}>
          <option value="nodes">Nodes</option>
          <option value="pipes">Pipes</option>
          <option value="cost">Cost</option>
          <option value="esrCost">ESR Cost</option>
          <option value="pumpCost">Pump Cost</option>
        </select>
      </div>

      {selectedTable === 'nodes' && <NodesTable nodes={props.result.resultnodes} />}
      {selectedTable === 'pipes' && <PipesTable pipes={props.result.resultpipes} />}
      {selectedTable === 'cost' && <CostTable costs={props.result.resultcost} />}
      {selectedTable === 'esrCost' && <EsrCostTable esrCost={props.result.resultesrcost} />}
      {selectedTable === 'pumpCost' && <PumpCostTable pumpCost={props.result.resultpumpcost} />}
    </div>
  );
};

export default Results;
