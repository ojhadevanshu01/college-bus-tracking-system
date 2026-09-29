import { useEffect, useRef } from "react";
import L from "leaflet";

const busIcon = L.divIcon({
  className: "bus-marker",
  html: '<div class="bus-marker-inner">🚌</div>',
  iconSize: [42, 42],
  iconAnchor: [21, 21]
});

export default function MapView({ buses = [], center, zoom = 14, selectedId, onSelect, className = "" }) {
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

  useEffect(() => {
    if (!mapRef.current) return;
    const fallback = center || [22.7196, 75.8577];
    const map = L.map(mapRef.current).setView(fallback, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    mapRef.current._leaflet = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current?._leaflet;
    if (!map) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    const valid = buses.filter(b => b.currentLocation?.latitude != null && b.currentLocation?.longitude != null);
    valid.forEach(bus => {
      const marker = L.marker(
        [bus.currentLocation.latitude, bus.currentLocation.longitude],
        { icon: busIcon }
      ).addTo(map);

      marker.bindPopup(
        `<strong>Bus ${bus.busNumber}</strong><br>${bus.startPoint?.name || ""} → ${bus.endPoint?.name || ""}<br><small>${bus.status === "RUNNING" ? "Live" : "Not running"}</small>`
      );
      if (onSelect) marker.on("click", () => onSelect(bus));
      markersRef.current.set(bus._id, marker);
    });

    if (valid.length) {
      const bounds = L.latLngBounds(valid.map(b => [b.currentLocation.latitude, b.currentLocation.longitude]));
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 });
    } else if (center) {
      map.setView(center, zoom);
    }
  }, [buses, center, zoom, onSelect]);

  useEffect(() => {
    if (!selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker) marker.openPopup();
  }, [selectedId]);

  return <div ref={mapRef} className={`map ${className}`} />;
}