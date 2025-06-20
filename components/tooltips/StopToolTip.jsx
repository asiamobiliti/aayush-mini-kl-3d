import { useState, useEffect } from "react";

export default function StopTooltip({ info }) {
  const [livePosition, setLivePosition] = useState(null);
  const reverseGeolocationToken = import.meta.env.VITE_REVERSE_GEOLOCATION_API;

//   if (!info) return null;

  const { x, y, object } = info;

  useEffect(() => {
    if (!object?.stop_lon || !object?.stop_lat) return;

    const lon = object.stop_lon;
    const lat = object.stop_lat;

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
  }, [object?.stop_lat, object?.stop_lon, reverseGeolocationToken]);

  return (
    <div className="tooltip-style" style={{ left: x - 175, top: y - 180, maxWidth: "350px" }}>
      <div><strong>{object.name}</strong></div>
      <hr className="stop-horizontal-row-style"/>
      <div style={{ textAlign: "justify", margin: "4px" }}>
        <strong>Located At: </strong> {livePosition || `${object.stop_lon},  ${object.stop_lat}` || "Loading..."}
      </div>
      <div style={{ textAlign: "justify", margin: "4px" }}>
        <strong>Buses:</strong>{" "}
        {object?.buses && object.buses.length > 0
          ? object.buses.map(bus=>bus.route_id).join(", ")
          : "No buses available"}
      </div>
    </div>
  );
}
