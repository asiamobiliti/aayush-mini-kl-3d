function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function filterStopsWithinRadius(userLocation, stopsData, radiusKm) {
  const userLat = userLocation.latitude;
  const userLon = userLocation.longitude;

  return stopsData.filter(stop => {
    const stopLat = stop.stop_lat;
    const stopLon = stop.stop_lon;
    const distance = haversineDistance(userLat, userLon, stopLat, stopLon);
    return distance <= radiusKm;
  });
}

export async function getNearestStop(userLocation, stopsData, apiKey) {
  const userLat = userLocation.latitude;
  const userLon = userLocation.longitude;

  console.log("Working lat: " + userLat);
  console.log("Working lon: " + userLon);

  const batch = filterStopsWithinRadius(userLocation, stopsData, 2.5);
  if (batch.length == 0) return null;
  console.log("Stops sieved through: " + batch.length);
  const results = await Promise.all(
    batch.map(async stop => {
      const stopLat = stop.stop_lat;
      const stopLon = stop.stop_lon;

      const url = `https://api.geoapify.com/v1/routing?waypoints=${userLat},${userLon}|${stopLat},${stopLon}&mode=walk&apiKey=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const travelTime = data.features?.[0]?.properties?.time;

        if (travelTime == null) throw new Error("No time data");

        return {
          name: stop.name,
          distance: (travelTime / 60)
        };
      } catch (err) {
        console.error(`Failed for stop "${stop.name}":`, err.message);
        return {
          name: stop.name,
          distance: Infinity // treat unreachable as infinitely far
        };
      }
    })
  );
  const nearestStop = results.reduce((min, curr) => 
    curr.distance < min.distance ? curr : min
  );

  return nearestStop;
}

export function calculateBearing([lon1, lat1], [lon2, lat2]) { // Function to calculate orientation of an object
    const toRadians = deg => deg * Math.PI / 180;
    const toDegrees = rad => rad * 180 / Math.PI;

    const angleOne = toRadians(lat1);
    const angleTwo = toRadians(lat2);
    const delta = toRadians(lon2 - lon1);

    const y = Math.sin(delta) * Math.cos(angleTwo);
    const x = Math.cos(angleOne) * Math.sin(angleTwo) -
              Math.sin(angleOne) * Math.cos(angleTwo) * Math.cos(delta);
    const theta = Math.atan2(y, x);

    return 180 - (toDegrees(theta) + 360) % 360;
}

export function fetchETASchedule(selectedStopId, stopsData, stopTimesData) {
  const now = new Date();
  const stop = stopsData.find(s => s.stop_id === selectedStopId);

  if (!stop) {
    console.error(`Stop ID ${selectedStopId} not found.`);
    return {};
  }

  if (!stop.buses || stop.buses.length === 0) {
    console.error(`No buses found for stop ID ${selectedStopId}`);
    return {};
  }

  const etaMap = {};

  for (const bus of stop.buses) {
    const { route_id, trips } = bus;

    const upcoming = stopTimesData
      .filter(st => st.stop_id === selectedStopId && trips.includes(st.trip_id))
      .map(st => {
        const [h, m, s] = st.arrival_time.split(":").map(Number);
        const arrival = new Date(now);
        if (h >= 24) {
          arrival.setDate(arrival.getDate() + 1);
          arrival.setHours(h - 24, m, s, 0);
        } else {
          arrival.setHours(h, m, s, 0);
        }
        return { ...st, arrival };
      })
      .filter(st => st.arrival > now)
      .sort((a, b) => a.arrival - b.arrival);

    etaMap[route_id] = upcoming.length > 0
      ? upcoming[0].arrival.toLocaleTimeString()
      : "No upcoming arrival";
  }

  return etaMap;
}
