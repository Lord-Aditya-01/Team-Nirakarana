import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import "../../services/leafletIconFix";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

// ======================
// ICONS
// ======================
const normalIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

// ======================
// COLOR BASED ON AI
// ======================
const getColor = (status) => {
  if (status === "DANGER") return "red";
  if (status === "ALERT") return "orange";
  return "green";
};

// ======================
// VALID LOCATION CHECK
// ======================
const hasValidLocation = (worker) =>
  worker &&
  worker.lat !== undefined &&
  worker.lng !== undefined &&
  worker.lat !== null &&
  worker.lng !== null;

// ======================
// FOCUS SELECTED WORKER
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
// AUTO CENTER
// ======================
const AutoCenter = ({ workers }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    const validWorkers = workers.filter(hasValidLocation);

    if (!hasCentered.current && validWorkers.length > 0) {
      map.setView([validWorkers[0].lat, validWorkers[0].lng], map.getZoom());
      hasCentered.current = true;
    }
  }, [workers, map]);

  return null;
};

// ======================
// MAIN COMPONENT
// ======================
const WorkersMap = ({ workers = [], selectedWorker, aiResults = [] }) => {
  const validWorkers = workers.filter(hasValidLocation);

  const [manholes, setManholes] = useState(null);

  // ======================
  // LOAD MANHOLES
  // ======================
  useEffect(() => {
    fetch("/manholes.geojson")
      .then((res) => res.json())
      .then((data) => setManholes(data))
      .catch((err) => console.error("Failed to load manholes", err));
  }, []);

  return (
    <div style={{ height: "80vh", borderRadius: "12px", overflow: "hidden" }}>
      {validWorkers.length === 0 && (
        <p style={{ color: "white", padding: "8px" }}>No workers live yet…</p>
      )}

      <MapContainer
        center={[18.6785, 73.897]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoCenter workers={validWorkers} />
        <FocusWorker worker={selectedWorker} />

        {/* ======================
            MANHOLES LAYER
        ====================== */}
        {manholes &&
          manholes.features.map((feature, index) => {
            const coords = feature.geometry.coordinates;
            const id = feature.properties?.id || index + 1;

            return (
              <CircleMarker
                key={index}
                center={[coords[1], coords[0]]}
                radius={4}
                pathOptions={{
                  color: "black",
                  fillColor: "black",
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <strong>Manhole ID:</strong> {id} <br />
                  <strong>Lat:</strong> {coords[1].toFixed(5)} <br />
                  <strong>Lng:</strong> {coords[0].toFixed(5)}
                </Popup>
              </CircleMarker>
            );
          })}

        {/* ======================
            WORKERS + AI
        ====================== */}
        {validWorkers.map((worker, index) => {
          const ai = aiResults[index] || {};
          const aiStatus = ai.final_status || "SAFE";

          return (
            <div key={worker.id}>
              {/* 🔥 AI RISK CIRCLE */}
              <CircleMarker
                center={[worker.lat, worker.lng]}
                radius={10}
                pathOptions={{
                  color: getColor(aiStatus),
                  fillColor: getColor(aiStatus),
                  fillOpacity: 0.6,
                }}
              />

              {/* 🔥 WORKER MARKER */}
              <Marker
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
                  {/* AI DATA */}
                  <strong>AI Risk:</strong>{" "}
                  <span
                    style={{
                      color: getColor(aiStatus),
                      fontWeight: "bold",
                    }}
                  >
                    {aiStatus}
                  </span>
                  <br />
                  <strong>Risk Score:</strong> {ai.risk_score || 0}
                  <br />
                  <strong>Entry Decision:</strong> {ai.entry_decision || "-"}
                  <br />
                  {/* 🔥 EXPLAINABILITY */}
                  <strong>Risk Factors:</strong>
                  <ul>
                    {(ai.risk_reason || "").split(",").map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <strong>Updated:</strong>{" "}
                  {worker.updatedAt
                    ? new Date(worker.updatedAt).toLocaleTimeString()
                    : "N/A"}
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorkersMap;
