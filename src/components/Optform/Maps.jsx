import React from 'react';
import { APIProvider} from "@vis.gl/react-google-maps";
import MapComponent from './MapComponent';

const Maps = (props) => {

  return (
    <div className='optimizer-form'>
      <h1>Map</h1>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <MapComponent {...props}/>
      </APIProvider>
    </div>
  );
};

export default Maps;
