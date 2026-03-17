import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "../../services/leafletIconFix";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { CircleMarker } from "react-leaflet";

const normalIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const sosIcon = L.divIcon({
  className: "",
  html: `<div class="sos-marker"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const warningIcon = L.divIcon({
  className: "",
  html: `<div class="warning-marker"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ✅ Safe coordinate check
const hasValidLocation = (worker) =>
  worker &&
  worker.lat !== undefined &&
  worker.lng !== undefined &&
  worker.lat !== null &&
  worker.lng !== null;

// ======================
// Focus selected worker
// ======================
const FocusWorker = ({ worker }) => {
  const map = useMap();

  useEffect(() => {
    if (hasValidLocation(worker)) {
      map.setView([worker.lat, worker.lng], 17);
    }
  }, [worker, map]);

  return null;
};

// ======================
// Auto center first worker
// ======================
const AutoCenter = ({ workers }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    const validWorkers = workers.filter(hasValidLocation);

    if (!hasCentered.current && validWorkers.length > 0) {
      map.setView(
        [validWorkers[0].lat, validWorkers[0].lng],
        map.getZoom()
      );
      hasCentered.current = true;
    }
  }, [workers, map]);

  return null;
};

// ======================
// MAIN MAP
// ======================
const WorkersMap = ({ workers = [], selectedWorker }) => {

  const validWorkers = workers.filter(hasValidLocation);

  const [manholes, setManholes] = useState(null);

  // Load manholes GeoJSON
  useEffect(() => {
    fetch("/manholes.geojson")
      .then((res) => res.json())
      .then((data) => setManholes(data))
      .catch((err) => console.error("Failed to load manholes", err));
  }, []);

  return (
    <div style={{ height: "80vh", borderRadius: "12px", overflow: "hidden" }}>

      {validWorkers.length === 0 && (
        <p style={{ color: "white", padding: "8px" }}>
          No workers live yet…
        </p>
      )}

      <MapContainer
        center={[18.6785, 73.8970]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoCenter workers={validWorkers} />
        <FocusWorker worker={selectedWorker} />

        {/* Manholes Layer */}
        {manholes &&
          manholes.features.map((feature, index) => {
            const coords = feature.geometry.coordinates;

            return (
              <CircleMarker
                key={index}
                center={[coords[1], coords[0]]} // lat, lng
                radius={3}
                pathOptions={{
                  color: "black",
                  fillColor: "black",
                  fillOpacity: 1
                }}
              />
            );
          })}

        {/* Worker Markers */}
        {validWorkers.map((worker) => (
          <Marker
            key={worker.id}
            position={[worker.lat, worker.lng]}
            icon={
              worker.status === "EMERGENCY"
                ? sosIcon
                : worker.status === "WARNING"
                ? warningIcon
                : normalIcon
            }
          >
            <Popup>
              <strong>{worker.name}</strong>
              <br />
              ID: {worker.id}
              <br />
              Status:{" "}
              <span
                style={{
                  color:
                    worker.status === "EMERGENCY"
                      ? "red"
                      : worker.status === "WARNING"
                      ? "orange"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {worker.status}
              </span>
              <br />
              Updated:{" "}
              {worker.updatedAt
                ? new Date(worker.updatedAt).toLocaleTimeString()
                : "N/A"}
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default WorkersMap;