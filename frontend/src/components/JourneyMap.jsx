import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// ── Fix default Leaflet marker icon (Vite bundler issue) ─────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Custom colored marker for each event type ────────────────────────────────
function createMarker(eventType, index) {
  const colors = {
    harvested:    '#1D9E75',
    received:     '#378ADD',
    dispatched:   '#EF9F27',
    transported:  '#7F77DD',
    delivered:    '#1D9E75',
    ANOMALY_FLAG: '#A32D2D',
  };
  const color = colors[eventType] || '#888780';
  return L.divIcon({
    html: `
      <div style="
        width:32px;height:32px;
        background:${color};
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
        display:flex;align-items:center;
        justify-content:center;
        color:white;font-size:13px;font-weight:600;
      ">${index + 1}</div>`,
    className: '',
    iconSize:   [32, 32],
    iconAnchor: [16, 16],
    popupAnchor:[0, -20],
  });
}

// ── Human-readable event type labels ─────────────────────────────────────────
function eventTypeLabel(eventType) {
  const labels = {
    harvested:    '🌿 Harvested',
    received:     '🏭 Received',
    dispatched:   '🚛 Dispatched',
    transported:  '🔄 In Transit',
    delivered:    '✅ Delivered',
    ANOMALY_FLAG: '⚠️ Anomaly',
  };
  return labels[eventType] ?? eventType;
}

/**
 * JourneyMap — Renders a Leaflet map showing the full GPS route of a batch.
 * Props: { points: [], totalDistanceKm: number, productType: string }
 */
export default function JourneyMap({ points = [], totalDistanceKm = 0, productType = '' }) {
  const { t } = useTranslation();

  // Guard: no GPS data
  if (!points || points.length === 0) {
    return (
      <div className="bg-[#F1EFE8] rounded-xl border border-[#D3D1C7] p-8 text-center">
        <div className="text-2xl mb-2">📍</div>
        <p className="text-[#888780] text-sm">{t('provenance.journey_empty')}</p>
      </div>
    );
  }

  // Calculate map center (average of all points)
  const center = [
    points.reduce((s, p) => s + p.lat, 0) / points.length,
    points.reduce((s, p) => s + p.lng, 0) / points.length,
  ];

  // Route polyline positions
  const polylinePositions = points.map(p => [p.lat, p.lng]);

  // Unique event types for legend
  const uniqueTypes = [...new Set(points.map(p => p.eventType))];
  const dotColors = {
    harvested:    '#1D9E75',
    received:     '#378ADD',
    dispatched:   '#EF9F27',
    transported:  '#7F77DD',
    delivered:    '#1D9E75',
    ANOMALY_FLAG: '#A32D2D',
  };

  return (
    <div className="bg-white rounded-xl border border-[#D3D1C7] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#D3D1C7] flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#444441]">{t('provenance.journey_map')}</p>
          <p className="text-[12px] text-[#888780]">📍 {points.length} {t('provenance.journey_points')}</p>
        </div>
        <span className="bg-[#E1F5EE] text-[#085041] text-xs px-2.5 py-1 rounded-full font-semibold">
          {totalDistanceKm} {t('map.km')} {t('map.total_distance').toLowerCase()}
        </span>
      </div>

      {/* Map */}
      <div className="h-[360px]">
        <MapContainer
          center={center}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Route polyline — only draw with 2+ points */}
          {polylinePositions.length >= 2 && (
            <Polyline
              positions={polylinePositions}
              color="#0F6E56"
              weight={3}
              opacity={0.8}
              dashArray="8 4"
            />
          )}

          {/* Markers */}
          {points.map((point, index) => (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={createMarker(point.eventType, index)}
            >
              <Popup maxWidth={240}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {index + 1}. {eventTypeLabel(point.eventType)}
                  </div>
                  <div style={{ color: '#888780', fontSize: '12px', lineHeight: 1.6 }}>
                    <div>👤 {point.actorName}</div>
                    {point.quantity > 0 && <div>📦 {point.quantity} kg</div>}
                    <div>📍 {point.location}</div>
                    <div>🕐 {new Date(point.timestamp).toLocaleDateString('en-IN')}</div>
                    {point.txHash && (
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#1D9E75', marginTop: 4 }}>
                        ✓ {point.txHash.slice(0, 10)}...
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-[#D3D1C7] flex flex-wrap gap-3">
        {uniqueTypes.map(type => (
          <span key={type} className="flex items-center gap-1.5 text-[12px] text-[#444441]">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: dotColors[type] || '#888780' }}
            />
            {eventTypeLabel(type)}
          </span>
        ))}
      </div>
    </div>
  );
}
