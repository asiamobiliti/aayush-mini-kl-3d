import { useState, useEffect } from "react";
import { getNearestStop } from "../../utils";
import stopsData from '../../data/stops.json';

export default function PersonTooltip({ info, userLocation }) {
    const [livePosition, setLivePosition] = useState(null);
    const [stopName, setStopName] = useState(null);
    const [stopTiming, setStopTiming] = useState(null);

    const { x, y, object } = info;
    const reverseGeolocationToken = import.meta.env.VITE_REVERSE_GEOLOCATION_API;
    const routingToken = import.meta.env.VITE_ROUTING_API;

    getNearestStop(userLocation, stopsData, routingToken)
      .then(stop => {
        setStopName(stop.name);
        setStopTiming(Math.ceil(stop.distance));
      })
      .catch(err => console.error("Error:", err));

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
                console.log("Live Position:", data.results[0].formatted);
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

  const stopTimeDisplay = stopTiming != null ? (stopTiming != 1 ? `~ ${stopTiming} minutes` : `~ ${stopTiming} minute`) : "Loading...";

  const timeDisplay = <div 
        className="stop-timing-style"
        style={{color: !stopTiming ? "black" : stopTiming > 20 ? "#DC143C" : stopTiming > 10 ? "#F28500" : "#00704A"}}
      >
        <strong style={{color: "black", fontWeight: "700"}}>Time to Travel:</strong> {stopTimeDisplay}
      </div>

  return (
    <div className="tooltip-style" style={{ left: x - 225, top: y - 245, maxWidth: "450px" }}>
      <div>
        <strong>Current Location</strong>
      </div>
      <hr className="person-horizontal-row-style"/>
      <div style={{ textAlign: "justify", margin: "4px" }}>
        <strong>Position:</strong> {livePosition || object.coordinates.join(", ") || "Loading..."}
      </div>
      <div style={{ textAlign: "justify", margin: "4px", fontWeight: "600" }}>
        <strong style={{fontWeight:"700"}}>Nearest Stop:</strong> {stopName || "Loading..."}
      </div>
      {timeDisplay}
    </div>
  );
}
