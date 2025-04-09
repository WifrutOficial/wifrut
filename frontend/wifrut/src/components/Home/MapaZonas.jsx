import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import zonas from "../../data/envios.json";
import style from "../../styles/Send.module.css";

const MapaZonas = () => {
  const getZonaStyle = (feature) => {
    const fill = feature.properties.fill || "#999999";
    const stroke = feature.properties.stroke || "#333333";
    const fillOpacity = feature.properties["fill-opacity"] || 0.5;
    const weight = feature.properties["stroke-width"] || 1.5;

    return {
      fillColor: fill,
      color: stroke,
      fillOpacity: fillOpacity,
      weight: weight,
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
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={zonas}
        onEachFeature={onEachFeature}
        style={getZonaStyle}
      />
    </MapContainer>
  );
};

export default MapaZonas;
