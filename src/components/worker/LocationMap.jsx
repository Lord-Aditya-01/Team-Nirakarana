import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  CircleMarker,
  Polyline
} from "react-leaflet";

import { useEffect, useState } from "react";
import "../../services/leafletIconFix";
import socket from "../../socket";
import ManholeInput from "./ManholeInput"; // ✅ correct import

// ======================
// Recenter Map
// ======================
const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 18);
  }, [position, map]);

  return null;
};

// ======================
// MAIN COMPONENT
// ======================
const LocationMap = () => {

  const [position, setPosition] = useState([18.6770, 73.8987]);
  const [accuracy, setAccuracy] = useState(null);
  const [manholes, setManholes] = useState(null);
  const [route, setRoute] = useState(null); // ✅ moved inside

  // ======================
  // Navigation Function
  // ======================
  const handleNavigate = async (targetId) => {

    if (!manholes || !targetId) return;

    const target = manholes.features.find(
      f => String(f.properties?.id) === targetId
    );

    if (!target) {
      alert("Manhole not found");
      return;
    }

    const [destLng, destLat] = target.geometry.coordinates;
    const [startLat, startLng] = position;

    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const coords = data.routes[0].geometry.coordinates;

      const routeLatLng = coords.map(c => [c[1], c[0]]);

      setRoute(routeLatLng);

    } catch (err) {
      console.error("Routing error:", err);
    }
  };

  // ======================
  // GPS Logic
  // ======================
  useEffect(() => {

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(

      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setAccuracy(pos.coords.accuracy);
        setPosition([lat, lng]);

        socket.emit("worker-location-update", {
          latitude: lat,
          longitude: lng,
          updatedAt: Date.now()
        });
      },

      (err) => {
        console.error("GPS error:", err.message);
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, []);

  // ======================
  // Load GeoJSON
  // ======================
  useEffect(() => {
    fetch("/manholes.geojson")
      .then((res) => res.json())
      .then((data) => setManholes(data))
      .catch((err) => console.error("Error loading manholes:", err));
  }, []);

  return (
    <div className="worker-card">

      <div className="location-title">📍 Live Location</div>

      <div className="map-wrapper">

        {/* ✅ Input OUTSIDE map */}
        <ManholeInput onNavigate={handleNavigate} />

        <MapContainer
          center={position}
          zoom={18}
          scrollWheelZoom={false}
          className="leaflet-map"
        >

          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap position={position} />

          {/* Worker */}
          <Marker position={position}>
            <Popup>
              You are here <br />
              Accuracy: {accuracy ? accuracy.toFixed(0) : "--"} m
            </Popup>
          </Marker>

          {/* Accuracy circle */}
          {accuracy && (
            <Circle
              center={position}
              radius={accuracy}
              pathOptions={{
                color: "blue",
                fillOpacity: 0.15,
              }}
            />
          )}

          {/* Manholes */}
          {manholes &&
            manholes.features.map((feature, index) => {

              const coords = feature.geometry.coordinates;
              const id = feature.properties?.id || index + 1;

              return (
                <CircleMarker
                  key={index}
                  center={[coords[1], coords[0]]}
                  radius={3}
                  pathOptions={{
                    color: "black",
                    fillColor: "black",
                    fillOpacity: 1
                  }}
                >
                  <Popup>
                    <strong>ID:</strong> {id}
                  </Popup>
                </CircleMarker>
              );
            })}

          {/* Route */}
          {route && (
            <Polyline
              positions={route}
              pathOptions={{ color: "blue", weight: 4 }}
            />
          )}

        </MapContainer>

      </div>

      <p className="gps-note">
        GPS accuracy depends on device & signal
      </p>

    </div>
  );
};

export default LocationMap;