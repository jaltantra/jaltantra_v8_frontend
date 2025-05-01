import React from 'react'

const General = (props) => {
  return (
    <div>
      <form  id='generalform' className='optimizer-form'>       
        <h1>General Details</h1>
        <input
          type="text"
          value={props.projectname}
          onChange={(e) => props.setProjectname(e.target.value)}
          placeholder="Project Name*"
          
        />
        <input
          type="text"
          value={props.orgname}
          onChange={(e) => props.setOrgname(e.target.value)}
          placeholder="Organisation Name"
        />
        <input
          type="number"
          value={props.minnodepress}
          onChange={(e) => props.setMinnodepress(e.target.value)}
          placeholder="Minimum Node Pressure (m)*"
          required
        />
        <input
          type="number"
          value={props.defaultroughness}
          onChange={(e) => props.setDefaultroughness(e.target.value)}
          placeholder="Default Pipe Roughness (C)"
          required
        />
        <input
          type="number"
          value={props.minheadloss}
          onChange={(e) => props.setMinheadloss(e.target.value)}
          placeholder="Minimum Headloss/KM (m)*"
          required
        />
        <input
          type="number"
          value={props.maxheadloss}
          onChange={(e) => props.setMaxheadloss(e.target.value)}
          placeholder="Maximum Headloss/KM (m)*"
          required
        />
        <input
          type="number"
          value={props.maxwaterspeed}
          onChange={(e) => props.setMaxwaterspeed(e.target.value)}
          placeholder="Maximum Water Speed (m/s)"
        />
        <input
          type="number"
          value={props.maxpipepress}
          onChange={(e) => props.setMaxpipepress(e.target.value)}
          placeholder="Maximum Pipe Pressure (m)"
        />
        <input
          type="number"
          value={props.supplyhours}
          onChange={(e) => props.setSupplyhours(e.target.value)}
          placeholder="Number of Supply Hours*"
          required
        />
        <input
          type="number"
          value={props.sourcenodeid}
          onChange={(e) => props.setSourcenodeid(e.target.value)}
          placeholder="Source Node ID*"
          required
        />
        <input
          type="text"
          value={props.sourcenodename}
          onChange={(e) => props.setSourcenodename(e.target.value)}
          placeholder="Source Node Name*"
          required
        />
        <input
          type="number"
          value={props.sourcehead}
          onChange={(e) => props.setSourcehead(e.target.value)}
          placeholder="Source Head (m)*"
          required
        />
        <input
          type="number"
          value={props.sourceelevation}
          onChange={(e) => props.setSourceelevation(e.target.value)}
          placeholder="Source Elevation (m)*"
          required
        />
      </form>
    </div>
  )
}

export default General
