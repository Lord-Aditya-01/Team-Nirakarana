import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {

  const [manholes, setManholes] = useState(null);

  useEffect(() => {
    fetch("/manholes.geojson")
      .then((res) => res.json())
      .then((data) => setManholes(data))
      .catch((err) => console.error("Error loading manholes:", err));
  }, []);

  return (
    <div style={{ height: "600px", width: "100%" }}>
      
      <MapContainer
        center={[17.67, 75.90]} // Solapur center
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

{manholes && (
  <GeoJSON
    data={manholes}
    pointToLayer={(feature, latlng) => {
      return new L.CircleMarker(latlng, {
        radius: 4,
        fillColor: "#000000",
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      });
    }}
    onEachFeature={(feature, layer) => {
      layer.bindPopup(
        "Manhole ID: " + (feature.properties?.id || "N/A")
      );
    }}
  />
)}

      </MapContainer>

    </div>
  );
};

export default MapView;