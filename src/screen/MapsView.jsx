import { MapContainer, TileLayer, useMap } from "react-leaflet";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css"; // REQUIRED for correct tile rendering

// Component to fix map resize issues
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100); // Delay slightly to allow layout to settle
  }, [map]);
  return null;
}

export default function OpenMapView() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[8.15549, 125.127467]}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <ResizeMap />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
}
