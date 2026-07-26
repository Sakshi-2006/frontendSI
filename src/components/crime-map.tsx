import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Circle } from "react-leaflet";
import { BENGALURU_CENTER, heatmapPoints as FALLBACK_POINTS } from "@/lib/mock-data";
import { useHeatmap } from "@/hooks/use-app-data";
import { useEffect } from "react";
import L from "leaflet";

// Fix default marker icons for bundlers.
// @ts-expect-error - Leaflet internal
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CrimeMap({
  layer,
  center = BENGALURU_CENTER,
  zoom = 11,
}: {
  layer: "heatmap" | "markers" | "clusters";
  center?: [number, number];
  zoom?: number;
}) {
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 200);
    return () => clearTimeout(t);
  }, []);

  const remote = useHeatmap().data as any[] | undefined;
  const heatmapPoints: Array<[number, number, number]> = (Array.isArray(remote) && remote.length
    ? remote.map((p: any) => Array.isArray(p) ? p as [number, number, number] : [p.lat, p.lng, p.weight ?? 0.5])
    : FALLBACK_POINTS) as Array<[number, number, number]>;


  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {layer === "heatmap" &&
        heatmapPoints.map(([lat, lng, intensity], i) => (
          <Circle
            key={i}
            center={[lat, lng]}
            radius={intensity * 1400}
            pathOptions={{
              color: intensity > 0.75 ? "#c0392b" : intensity > 0.5 ? "#e08c3b" : "#2aa7b8",
              fillOpacity: 0.35,
              weight: 1,
            }}
          />
        ))}

      {layer === "markers" &&
        heatmapPoints.map(([lat, lng, intensity], i) => (
          <Marker key={i} position={[lat, lng]}>
            <Popup>
              <b>Incident #{1000 + i}</b>
              <br />
              Intensity: {(intensity * 100).toFixed(0)}%
            </Popup>
          </Marker>
        ))}

      {layer === "clusters" &&
        heatmapPoints.map(([lat, lng, intensity], i) => (
          <CircleMarker
            key={i}
            center={[lat, lng]}
            radius={6 + intensity * 12}
            pathOptions={{
              color: "#1f2a55",
              fillColor: "#2aa7b8",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>Cluster of {Math.round(intensity * 20)} incidents</Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
