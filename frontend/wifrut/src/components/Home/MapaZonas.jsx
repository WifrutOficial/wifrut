

import React from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import zonas from "../../data/envios.json";
import style from "../../styles/Send.module.css";


const logoIcon = new L.Icon({
  iconUrl: '/logo.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const MapaZonas = () => {

  const getZonaStyle = (feature) => {
    return {
      fillColor: feature.properties.fill || "#999999",
      color: feature.properties.stroke || "#333333",
      fillOpacity: feature.properties["fill-opacity"] || 0.5,
      weight: feature.properties["stroke-width"] || 1.5,
    };
  };


  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name?.trim() || "Zona sin nombre";
    const description = feature.properties.description || "Sin descripción";
    layer.bindPopup(`<strong>${name}</strong><br/>${description}`);
  };

  return (
    <MapContainer
      center={[-38.95, -68.06]}
      zoom={11}
      scrollWheelZoom={false}
      className={style.map}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {zonas.features.map((feature, index) => {

        if (feature.geometry.type === "Point") {
          const pointCoords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
          return (
            <Marker key={index} position={pointCoords} icon={logoIcon}>
              <Popup><b>{feature.properties.name}</b></Popup>
            </Marker>
          );
        }


        if (feature.geometry.type === "Polygon") {
          return (
            <GeoJSON
              key={index}
              data={feature}
              style={getZonaStyle(feature)}
              onEachFeature={onEachFeature}
            />
          );
        }

        return null;
      })}
    </MapContainer>
  );
};

export default MapaZonas;