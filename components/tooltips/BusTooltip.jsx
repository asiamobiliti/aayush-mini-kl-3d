import { useState, useEffect } from "react";
import '../../componentStyles/Tooltips.css';

export default function BusTooltip({ info, data }) {
  const [livePosition, setLivePosition] = useState(null);
  // if (!info) return null;

  const { x, y, object } = info;

  function nextStop(object) {
  if (!object) return;
  const stopId = object.nextStop;
  return data
          .filter(x => x.stop_id == stopId)
          .map(x => x.name);
  }
  const reverseGeolocationToken = import.meta.env.VITE_REVERSE_GEOLOCATION_API;
  

  useEffect(() => {
      if (!object?.coordinates) return;

    const [lon, lat] = object.coordinates;

    const fetchLivePosition = async () => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lon}&key=${reverseGeolocationToken}`
        );
        const data = await response.json();
        console.log("Remaining Calls: " + data.rate.remaining);
        if (data.results && data.results[0]) {
          setLivePosition(data.results[0].formatted);
        } else {
          console.warn("No geolocation result found.");
        }
      } catch (error) {
        console.error("Error fetching live position:", error);
      }
    };

    fetchLivePosition();
    const intervalId = setInterval(fetchLivePosition, 60000);

    return () => clearInterval(intervalId);
  }, [object?.coordinates, reverseGeolocationToken]);

  return (
    <div className="tooltip-style" style={{ left: x - 190, top: y - 250, maxWidth: "380px" }}>
      <div><strong>{object.name}</strong></div>
      <hr className="bus-horizontal-row-style"/> 
      <div><strong>Next Station: </strong>{nextStop(object)}</div>
      {object.status == 0 && <div style={{color: "#F28500", fontWeight: "600"}}><strong style={{color: "black", fontWeight: "700"}}>Status: </strong>Arriving</div>}
      {object.status == 1 && <div style={{color: "#00704A", fontWeight: "600"}}><strong style={{color: "black", fontWeight: "700"}}>Status: </strong>Arrived</div>}
      {object.status == 2 && <div style={{color: "#4A90E2", fontWeight: "600"}}><strong style={{color: "black", fontWeight: "700"}}>Status: </strong>In Transit</div>}
      <div style={{textAlign: "justify",margin: "4px"}}>
        <strong>Current Position:</strong> {livePosition || object.coordinates.join(", ") || "Loading..."}
      </div>
    </div>
  );
};