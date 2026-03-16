import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function MapView() {

  const [manholes, setManholes] = useState(null);

  useEffect(() => {
    fetch("/manholes.geojson")
      .then(res => res.json())
      .then(data => setManholes(data));
  }, []);

  return (
    <MapContainer center={[17.67, 75.90]} zoom={12} style={{ height: "500px", width: "100%" }}>
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {manholes && <GeoJSON data={manholes} />}
      
    </MapContainer>
  );
}

export default MapView;