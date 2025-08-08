import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, CircleMarker, Pane, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FitToRoute = ({ positions }) => {
  const map = useMap();
  React.useEffect(() => {
    if (positions && positions.length > 1) {
      const bounds = positions.reduce(
        (b, p) => b.extend([p[0], p[1]]),
        new (window.L).LatLngBounds([positions[0][0], positions[0][1]], [positions[0][0], positions[0][1]])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
};

const TripMap = ({ selectedTrip = null, height = '600px' }) => {
  // נתיב דמו סביב תל אביב אם אין נתיב אמיתי
  const route = useMemo(() => {
    // מבנה: [lat, lng]
    const base = [32.071, 34.78];
    const pts = [
      [base[0] + 0.030, base[1] - 0.030],
      [base[0] + 0.018, base[1] - 0.010],
      [base[0] + 0.010, base[1] + 0.005],
      [base[0] - 0.005, base[1] + 0.015],
      [base[0] - 0.020, base[1] + 0.030],
    ];
    return pts;
  }, [selectedTrip]);

  const start = route[0];
  const end = route[route.length - 1];

  return (
    <div className="relative">
      <div style={{ height: height, width: '100%' }} className="rounded-xl overflow-hidden bg-[#0f0f0f] border border-gray-800 relative">
        <MapContainer center={start} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} className="z-0">
          {/* Dark base layer close to the reference look */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Glow undershadow */}
          <Pane name="route-glow" style={{ zIndex: 350 }}>
            <Polyline positions={route} pathOptions={{ color: '#ff7a1a', opacity: 0.35, weight: 14 }} />
          </Pane>

          {/* Main route line */}
          <Pane name="route" style={{ zIndex: 400 }}>
            <Polyline positions={route} pathOptions={{ color: '#ff7a1a', weight: 6 }} />
          </Pane>

          {/* Waypoints markers (demo) */}
          <Pane name="markers" style={{ zIndex: 450 }}>
            <CircleMarker center={start} radius={8} pathOptions={{ color: '#0f0f0f', weight: 2, fillColor: '#3cff9a', fillOpacity: 1 }} />
            <CircleMarker center={end} radius={9} pathOptions={{ color: '#0f0f0f', weight: 2, fillColor: '#ff7a1a', fillOpacity: 1 }} />
          </Pane>

          <FitToRoute positions={route} />
        </MapContainer>

        {/* Vignette overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />

        {/* Map Title */}
        <div className="absolute top-3 left-3 bg-black/60 rounded px-3 py-1 z-[500] border border-white/10 shadow-lg">
          <span className="text-xs text-white/80 tracking-wide">מפת מסלול • ניטור בזמן אמת</span>
        </div>
      </div>
      
      {/* מקרא המפה */}
      <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg p-3 shadow-lg border border-white/10 z-20 backdrop-blur">
        <h4 className="font-bold text-sm mb-2 text-white">מקרא</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-300">נסיעה הושלמה</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-300">נסיעה פעילה</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-300">נסיעה מתוכננת</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚗</span>
            <span className="text-gray-300">רכב פעיל</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-300">ערים</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-gray-300">נקודות עניין</span>
          </div>
        </div>
      </div>

      {/* Route Information Overlay */}
      <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-3 shadow-lg border border-white/10 z-20 max-w-xs backdrop-blur">
        <h4 className="font-bold text-sm mb-2 text-white">מסלולים פעילים</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-300">נסיעה 1</span>
            <span className="text-xs px-1 py-0.5 rounded bg-green-600">הושלם</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-300">נסיעה 2</span>
            <span className="text-xs px-1 py-0.5 rounded bg-blue-600">בדרך</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-300">נסיעה 3</span>
            <span className="text-xs px-1 py-0.5 rounded bg-yellow-600">ממתין</span>
          </div>
        </div>
      </div>

      {/* Selected Trip Info */}
      {selectedTrip && (
        <div className="absolute top-4 left-4 bg-black/60 rounded-lg p-3 shadow-lg border border-white/10 z-20 max-w-xs backdrop-blur">
          <h4 className="font-bold text-sm mb-2 text-white">נסיעה נבחרת</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <div><strong>לקוח:</strong> {selectedTrip.customer?.name}</div>
            <div><strong>מספר:</strong> {selectedTrip.delivery_number}</div>
            <div><strong>יעד:</strong> {selectedTrip.destination || 'לא צוין'}</div>
            <div><strong>מחיר:</strong> ₪{selectedTrip.price}</div>
            <div><strong>מרחק:</strong> {selectedTrip.distance_km} ק"מ</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMap; 