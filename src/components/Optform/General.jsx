import React from 'react'

const General = (props) => {
  return (
    <div>
      <form  id='generalform' className='optimizer-form'>       
        <h1>General Details</h1>
        <div className='inputtag'>
          <p>Project Name: </p>
          <input
          type="text"
          value={props.projectname}
          onChange={(e) => props.setProjectname(e.target.value)}
          placeholder="Project Name*"
          
        />
        </div>
        <div className='inputtag'>
          <p>Organisation Name: </p>
          <input
            type="text"
            value={props.orgname}
            onChange={(e) => props.setOrgname(e.target.value)}
            placeholder="Organisation Name"
            />
        </div>
        <div className='inputtag'>
          <p>Minimum Node Pressure (m): </p>
        <input
          type="number"
          value={props.minnodepress}
          onChange={(e) => props.setMinnodepress(e.target.value)}
          placeholder="Minimum Node Pressure (m)*"
          required
        />
        </div>
        <div className='inputtag'>
          <p>Default Pipe Roughness (C):</p>
        <input
          type="number"
          value={props.defaultroughness}
          onChange={(e) => props.setDefaultroughness(e.target.value)}
          placeholder="Default Pipe Roughness (C)"
          required
        />
        </div>

        <div className='inputtag'>
          <p>Minimum Headloss/KM (m): </p>
        <input
          type="number"
          value={props.minheadloss}
          onChange={(e) => props.setMinheadloss(e.target.value)}
          placeholder="Minimum Headloss/KM (m)*"
          required
        />
        </div>


        <div className='inputtag'>
          <p>Maximum Headloss/KM (m): </p>
        <input
          type="number"
          value={props.maxheadloss}
          onChange={(e) => props.setMaxheadloss(e.target.value)}
          placeholder="Maximum Headloss/KM (m)*"
          required
        />
        </div>

        <div className='inputtag'>
          <p>Maximum Water Speed (m/s): </p>
        <input
          type="number"
          value={props.maxwaterspeed}
          onChange={(e) => props.setMaxwaterspeed(e.target.value)}
          placeholder="Maximum Water Speed (m/s)"
        />
        </div>

        <div className='inputtag'>
          <p>Maximum Pipe Pressure (m): </p>
        <input
          type="number"
          value={props.maxpipepress}
          onChange={(e) => props.setMaxpipepress(e.target.value)}
          placeholder="Maximum Pipe Pressure (m)"
        />
        </div>

        <div className='inputtag'>
          <p>Number of Supply Hours: </p>
        <input
          type="number"
          value={props.supplyhours}
          onChange={(e) => props.setSupplyhours(e.target.value)}
          placeholder="Number of Supply Hours*"
          required
        />
        </div>

        <div className='inputtag'>
          <p>Source Node ID: </p>
        <input
          type="number"
          value={props.sourcenodeid}
          onChange={(e) => props.setSourcenodeid(e.target.value)}
          placeholder="Source Node ID*"
          required
        />
        </div>

        <div className='inputtag'>
          <p>Source Node Name: </p>
        <input
          type="text"
          value={props.sourcenodename}
          onChange={(e) => props.setSourcenodename(e.target.value)}
          placeholder="Source Node Name*"
          required
        />
        </div>

        <div className='inputtag'>
          <p>Source Head (m): </p>
        <input
          type="number"
          value={props.sourcehead}
          onChange={(e) => props.setSourcehead(e.target.value)}
          placeholder="Source Head (m)*"
          required
        />
        </div>

        <div className='inputtag'>
          <p>Source Elevation (m): </p>
        <input
          type="number"
          value={props.sourceelevation}
          onChange={(e) => props.setSourceelevation(e.target.value)}
          placeholder="Source Elevation (m)*"
          required
        />
        </div>

      </form>
    </div>
  )
}

export default General
