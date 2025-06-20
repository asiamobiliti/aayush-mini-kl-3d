import { Map, Source, Layer } from 'react-map-gl/mapbox';
import { FlyToInterpolator } from "deck.gl";
import DeckGL from '@deck.gl/react';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import React, { useState, useEffect, useRef, useContext } from 'react';
import stopsData from '../data/stops.json';
import { ViewStateContext } from './ViewStateContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import BusTooltip from './tooltips/BusTooltip';
import StopTooltip from './tooltips/StopToolTip';
import PersonTooltip from './tooltips/PersonToolTip';
import BusPopUp from './popups/BusPopUp';
import StopPopUp from './popups/StopPopUp';
import PersonPopUp from './popups/PersonPopUp';
import { calculateBearing } from '../utils';
import "../componentStyles/Map.css"

const mapboxToken = import.meta.env.VITE_MAPBOX_API; 


const tamanDesaZone = { // Sample Zone Data
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [101.679101, 3.113982],
          [101.678461, 3.110433],
          [101.678669, 3.107082],
          [101.677876, 3.103237],
          [101.676564, 3.100371],
          [101.675433, 3.097033],
          [101.678389, 3.095605],
          [101.684187, 3.095009],
          [101.687839, 3.095248], 
          [101.689955, 3.097331],
          [101.692802, 3.097629],
          [101.695381, 3.098418],
          [101.697229, 3.104653],
          [101.690060, 3.110339],
          [101.688137, 3.112184],
          [101.682339, 3.112973],
          [101.679101, 3.113982]
        ]],
      },
      properties: {
      },
    },
  ],
};

const fillLayer = { // Sample Zone Data
  id: 'box-fill',
  type: 'fill',
  source: 'box',
  minzoom: 11,
  maxzoom: 16,
  paint: {
    'fill-color': '#7FE5D9',     // Background color inside the box
    'fill-opacity': 0.2          // Optional transparency
  }
};

const lineLayer = { // Sample Zone Data
  id: 'route-line',
  type: 'line',
  source: 'box',
  minzoom: 11,
  maxzoom: 16,
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#7FE5D9',
    'line-width': 6,
  },
};

export default function MapView({userLocation, setUserLocation}) {
  const { viewState, setViewState } = useContext(ViewStateContext);
  const [busData, setBusData] = useState([]);
  const [hoverInfo, setHoverInfo] = useState(null);
  //const [isClicked, setIsClicked] = useState(false);
  const [clickedInfo, setClickedInfo] = useState(null);
  const hasFetchedInitialRef = useRef(false);

  useEffect(() => { // For setting User Location
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        console.log("Currently at " + longitude + ", " + latitude);
        setUserLocation({ latitude, longitude });
        setViewState(prev => ({
          ...prev,
          longitude,
          latitude
        }));
      },
      err => console.log(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const stopsLayer = new ScenegraphLayer({ // Rendering of bus stops
    id: 'stops-layer',
    data: stopsData,
    pickable: true, 
    scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/BoxAnimated/glTF/BoxAnimated.gltf',
    getPosition: d => [d.stop_lon, d.stop_lat],
    getOrientation: () => [0, 90, 90],
    _animations: {
      '*': { speed: 3 }
    },
    sizeScale: 10,
    _lighting: 'pbr',

  });

  const updateBusPositions = (newPositions) => { // Helper function (Only to log number of buses -> Remove in final product)
    console.log(`Number of buses: ${newPositions.length}`);
    setBusData(prevData => {
      const updated = prevData.map(bus => {
        const latest = newPositions.find(b => b.name == bus.name);
        if (!latest) {
          console.log(`NOT FOUND: ${bus.name}`);
          return bus;
        } else if (latest.coordinates[0] == bus.headingTo[0] && latest.coordinates[1] == bus.headingTo[1]) {
          return bus;
        } else {
          console.log(`NEW UPDATE: ${bus.name}`);
          return {
            ...bus,
            coordinates: bus.headingTo, 
            headingTo: latest.coordinates,
          };
        };
      });

      const newBuses = newPositions.filter(
        b => !prevData.some(bus => bus.name === b.name)
      );

      const newBusesPrint = newBuses.map(bus => bus.name);
      if (newBusesPrint.length > 0) {
        console.log(`New Additions: ${newBusesPrint}`);
      }

      return [...updated, ...newBuses];
    });
  };

  useEffect(() => { // MAIN CALL TO API HAPPENS HERE
    const fetchLiveBusData = async () => {
      try {
        const response = await fetch('http://localhost:3000/gtfs/realtime/json');
        const data = await response.json();

        const liveData = data.entityList.map(obj => ({
          id: obj.id,
          name: obj.vehicle.vehicle.id,
          coordinates: [obj.vehicle.position.longitude, obj.vehicle.position.latitude],
          headingTo: [obj.vehicle.position.longitude, obj.vehicle.position.latitude],
          nextStop: obj.vehicle.stopId,
          status: obj.vehicle.currentStatus
        }));

        if (!hasFetchedInitialRef.current) {
          setBusData(liveData);
          hasFetchedInitialRef.current = true;
        } else {
          updateBusPositions(liveData);
        }
      } catch (error) {
        console.error('Error fetching live bus data:', error);
      }
    };

    fetchLiveBusData();
    const intervalId = setInterval(fetchLiveBusData, 7000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => { // Refresh data every 5 minutes
    const intervalId = setInterval(() => {
      console.log(`[${new Date().toLocaleTimeString()}] Resetting bus data`);
      setBusData([]); 
      hasFetchedInitialRef.current = false;
    }, 300000); 
    return () => clearInterval(intervalId); 
  }, []);

  const busLayer = new ScenegraphLayer({ // Rendering of buses
    id: 'bus-layer',
    data: busData,
    pickable: true,
    scenegraph: 'https://raw.githubusercontent.com/abhatia2003/blenderfiles/refs/heads/main/Trial1.gltf',
    getPosition: d => d.coordinates,
    getOrientation: d => {
                      const bearing = calculateBearing(d.coordinates, d.headingTo);
                      return [0, bearing, 180];
                    },
    _animations: {
      '*': {speed: 3}
    },
    sizeScale: 7,
    _lighting: 'pbr'
  });
    
  const personalData = userLocation ? [ // To store User Location
    {
      id: '0000001',
      name: 'Me',
      coordinates: [userLocation.longitude, userLocation.latitude],
      headingTo: [userLocation.longitude, userLocation.latitude]
    }
  ] : [];
   
  const personalLayer = new ScenegraphLayer({ // Rendering of User location
    id: 'personal-layer',
    data: personalData,
    pickable: true,
    scenegraph: 'https://raw.githubusercontent.com/abhatia2003/blenderfiles/refs/heads/main/Person1.gltf',
    getPosition: d => d.coordinates,
    getOrientation: d => {
                      const bearing = calculateBearing(d.coordinates, d.headingTo);
                      return [0, bearing, 180];
                    },
    _animations: {
      '*': {speed: 3}
    },
    sizeScale: 7,
    _lighting: 'pbr'
  });
  
  useEffect(() => { //NOT SURE - REVIEW!
    if (userLocation) {
      setViewState({
        ...viewState,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude
      });
    }
  }, [userLocation]);


  const recenter = (object, layer) => { // Recenter animation when an object is clicked
            let lon, lat;
            if (layer.id === "stops-layer") {
              lon = object.stop_lon;
              lat = object.stop_lat;
            } else {
              lon = object.coordinates[0];
              lat = object.coordinates[1];
            }

            setViewState(prev => ({
              ...prev,
              longitude: lon,
              latitude: lat,
              zoom: 17,
              pitch: 60,
              bearing: 0,
              transitionDuration: 500,
              transitionInterpolator: new FlyToInterpolator()
            }));
             if (object) {
              setClickedInfo({ object, layer });  
            } else {
              setClickedInfo(null);
            }
      };

  return ( // Formatted components that make up the MapView 
    <>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={[
          ...(userLocation ? [personalLayer] : []),
          busLayer,
          stopsLayer
        ]}
        onHover={({x, y, object, layer}) => {
          if (object) {
            setHoverInfo({ x, y, object, layer })
          } else {
            setHoverInfo(null)
          }
        }}
        onClick={({object, layer}) => {
          setHoverInfo(null);
          if (clickedInfo) {
            setClickedInfo(null);
          }
          recenter(object, layer);
        }}
      >
        <Map
          mapStyle="mapbox://styles/bakudan00/clf7q6xta000201n0nz1ua242"
          mapboxAccessToken={mapboxToken}
          style={{ width: '100%', height: '100%' }}
        >
          <Source id="box" type="geojson" data={tamanDesaZone} />
          <Layer {...fillLayer} />
          <Layer {...lineLayer} />
        </Map>
      </DeckGL>

      {hoverInfo?.layer?.id === 'bus-layer' && (
        <BusTooltip info={hoverInfo} data={stopsData}/>
      )}

      {hoverInfo?.layer?.id === 'stops-layer' && (
        <StopTooltip info={hoverInfo} />
      )}

      {hoverInfo?.layer?.id === 'personal-layer' && (
        <PersonTooltip info={hoverInfo} userLocation={userLocation} />
      )}
      {clickedInfo && (<div className="popup"
      >
        {clickedInfo.layer.id === 'stops-layer' && (
          <StopPopUp data={clickedInfo.object} />
        )}
        {clickedInfo.layer.id === 'bus-layer' && (
          <BusPopUp data={clickedInfo.object} />
        )}
        {clickedInfo.layer.id === 'personal-layer' && (
          <PersonPopUp data={clickedInfo.object} />
        )}
      </div>
    )}
    </>
  );
}