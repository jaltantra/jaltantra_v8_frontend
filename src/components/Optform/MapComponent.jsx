import React, { useEffect , useRef} from 'react';
import { Map, AdvancedMarker, useMap} from "@vis.gl/react-google-maps";


const containerStyle = {
    width: "97%",
    height: "600px",
    margin: "20px",
    boxShadow: "0 0 0 9px #522da85d"
};
const Pin = ({ text }) => {
    const pinStyle = {
      backgroundColor: "#522da8a6",
      color: "white",
      border: `3px solid #522da8`,
      borderRadius: '50% 50% 50% 0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '12px',
      position: 'relative',
      transform: 'rotate(-45deg)',
      bottom: '5px',
    };
  
    return (
      <div style={pinStyle}>
        {text}
        {/* Optional Glyph/Icon can go here */}
      </div>
    );
  };

  const calculateCenter = (locations) => {
    if(locations.length===0)
        return {lat:0, lng:0};
    // Initialize min and max values
    let minLat = locations[0].lat, maxLat = locations[0].lat;
    let minLng = locations[0].lng, maxLng = locations[0].lng;
  
    // Loop through locations to find the min/max lat and lng
    locations.forEach(loc => {
      if (loc.lat < minLat) minLat = loc.lat;
      if (loc.lat > maxLat) maxLat = loc.lat;
      if (loc.lng < minLng) minLng = loc.lng;
      if (loc.lng > maxLng) maxLng = loc.lng;
    });
  
    // Calculate the center by averaging the min and max lat/lng
    const center = {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    };
  
    return center;
  };
  

const MapComponent = (props) => {
    const map=useMap();


    useEffect(() =>{
        if(!map)
            return;

        props.mappipedata.forEach((pipe)=>{
            const path = new google.maps.Polyline({
                path: pipe.path,
                geodesic: true,
                strokeColor: '#4169E1',
              strokeOpacity: 1.0,
              strokeWeight: 2,
              icons: [
                {
                  icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    strokeColor: '#8B0000',
                  },
                  offset: '60%',
                },
              ],
            });
            path.setMap(map);
        })
      }, [map, props.mapnodedata, props.mappipedata]);
      const center = calculateCenter(props.mapnodedata);

  return (
    <div>
      <Map
        mapId={'jaltantra'}
        style={containerStyle}
        defaultCenter={center}
        defaultZoom={13}
        gestureHandling={"greedy"}
      >
        {
          props.mapnodedata.map((loc, index)=>{
            return (
              <AdvancedMarker key={index} position={{lat: parseFloat(loc.lat), lng: parseFloat(loc.lng)}} label={{text: String(loc.nodeid), color: 'black'}}>
                <Pin text={String(loc.nodeid)}/>
              </AdvancedMarker>
            )
          })
        }
        
      </Map>
    </div>
  )
}

export default MapComponent
