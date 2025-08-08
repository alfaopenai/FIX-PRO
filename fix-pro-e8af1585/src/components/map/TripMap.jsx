import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Pane, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FitToRoutes = ({ routes }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!routes || routes.length === 0) return;

    const first = routes[0]?.path?.[0];
    if (!first) return;

    const initialBounds = new (window.L).LatLngBounds([first[0], first[1]], [first[0], first[1]]);

    const bounds = routes.reduce((accBounds, route) => {
      route.path.forEach((point) => accBounds.extend([point[0], point[1]]));
      return accBounds;
    }, initialBounds);

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, routes]);
  return null;
};

// Utilities: haversine distance and bearing
function toRad(v) { return (v * Math.PI) / 180; }
function haversineMeters(a, b) {
  const R = 6371000;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return R * c;
}
function bearingDeg(a, b) {
  const φ1 = toRad(a[0]);
  const φ2 = toRad(b[0]);
  const λ1 = toRad(a[1]);
  const λ2 = toRad(b[1]);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  return (θ * 180) / Math.PI; // -180..180
}

function accumulateDistances(path) {
  const segMeters = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const d = haversineMeters(path[i], path[i + 1]);
    segMeters.push(d);
    total += d;
  }
  return { segMeters, totalMeters: total };
}

function interpolate(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function pointAtDistance(path, segMeters, distance) {
  let remaining = distance;
  for (let i = 0; i < segMeters.length; i += 1) {
    const seg = segMeters[i];
    if (remaining <= seg) {
      const t = seg === 0 ? 0 : remaining / seg;
      const p = interpolate(path[i], path[i + 1], t);
      const head = bearingDeg(path[i], path[i + 1]);
      return { point: p, heading: head };
    }
    remaining -= seg;
  }
  const lastIdx = path.length - 1;
  return { point: path[lastIdx], heading: bearingDeg(path[lastIdx - 1], path[lastIdx]) };
}

async function fetchOsrmRoute(waypoints) {
  try {
    const coordStr = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&alternatives=false&steps=false`;
    const res = await fetch(url);
    if (!res.ok) {
      return { path: waypoints, distance: 0, duration: 0 };
    }
    const data = await res.json();
    const route = data?.routes?.[0];
    const coords = route?.geometry?.coordinates || [];
    return {
      path: coords.map(([lng, lat]) => [lat, lng]),
      distance: route?.distance || 0,
      duration: route?.duration || 0,
    };
  } catch {
    return { path: waypoints, distance: 0, duration: 0 };
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'he' } });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data?.name || data?.address?.attraction || data?.address?.amenity || data?.address?.road || 'יעד',
      address: data?.display_name || '',
      osmId: data?.osm_id,
      type: data?.type,
    };
  } catch {
    return null;
  }
}

function metersToKm(m) {
  if (!m) return '—';
  return `${(m / 1000).toFixed(1)} ק"מ`;
}

function secondsToTime(s) {
  if (!s) return '—';
  const minutes = Math.round(s / 60);
  if (minutes < 60) return `${minutes} דק'`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} ש' ${m} דק'`;
}

const TripMap = ({ selectedTrip = null, height = '600px' }) => {
  const telAvivCenter = [32.0853, 34.7818];

  const [routes, setRoutes] = useState([]); // [{ path, distance, duration, color, photo, type }]
  const [selectedDestination, setSelectedDestination] = useState(null);

  // מצב רכבים בתנועה
  const [vehicles, setVehicles] = useState([]); // [{ idx, progress, speedKmh, position:[lat,lng], heading, totalMeters, segMeters, color, type }]
  const animRef = useRef(null);
  const lastTsRef = useRef(null);

  // אייקון יעד בסגנון פין עם תמונת פרופיל - מוקטן
  const createPhotoPinIcon = (photoUrl, borderColor = '#ffffff') => {
    if (!window?.L) return null;
    const html = `
      <div style="position:relative;width:32px;height:46px;transform:translateY(-4px)">
        <div style="position:absolute;left:50%;top:0;transform:translate(-50%,0);width:32px;height:32px;background:rgba(33,33,33,0.95);border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid ${borderColor};box-shadow:0 3px 10px rgba(0,0,0,0.5)">
          <div style="width:26px;height:26px;border-radius:50%;overflow:hidden;background:#ddd">
            <img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;display:block"/>
          </div>
        </div>
        <div style="position:absolute;left:50%;top:28px;transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid rgba(33,33,33,0.95);"></div>
      </div>`;
    return window.L.divIcon({ className: 'destination-photo-pin', html, iconSize: [32, 46], iconAnchor: [16, 36] });
  };

  // SVGים שונים לכל סוג רכב (scaled via container)
  const svgByType = (type, colorMain) => {
    switch (type) {
      case 'taxi':
        return `
        <svg viewBox="0 0 28 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="2" y="4" rx="6" ry="6" width="24" height="48" fill="#facc15" stroke="#111827" stroke-width="2"/>
          <rect x="6" y="10" width="16" height="10" rx="2" fill="#111827" opacity="0.75"/>
          <rect x="6" y="36" width="16" height="8" rx="2" fill="#111827" opacity="0.6"/>
          <rect x="9" y="24" width="10" height="6" rx="1" fill="#111827"/>
          <text x="14" y="29" text-anchor="middle" font-size="6" fill="#fef3c7" font-family="Arial, sans-serif">TAXI</text>
        </svg>`;
      case 'truck':
        return `
        <svg viewBox="0 0 28 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="1.5" y="12" width="25" height="46" rx="3" fill="#e5e7eb" stroke="#111827" stroke-width="2"/>
          <rect x="4" y="2" width="20" height="14" rx="4" fill="#9ca3af" stroke="#111827" stroke-width="2"/>
          <rect x="6" y="6" width="16" height="6" rx="2" fill="#111827" opacity="0.5"/>
        </svg>`;
      case 'van':
        return `
        <svg viewBox="0 0 26 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="2" y="8" width="22" height="44" rx="5" fill="#f3f4f6" stroke="#111827" stroke-width="2"/>
          <rect x="6" y="12" width="14" height="10" rx="2" fill="#111827" opacity="0.6"/>
          <rect x="6" y="38" width="14" height="8" rx="2" fill="#111827" opacity="0.4"/>
          <rect x="4" y="2" width="18" height="8" rx="4" fill="#9ca3af" stroke="#111827" stroke-width="2"/>
        </svg>`;
      case 'scooter':
        return `
        <svg viewBox="0 0 16 36" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="5" y="4" width="6" height="24" rx="3" fill="#1f2937"/>
          <rect x="2" y="2" width="12" height="4" rx="2" fill="#111827"/>
          <circle cx="8" cy="32" r="4" fill="#111827"/>
        </svg>`;
      default: // car
        return `
        <svg viewBox="0 0 26 56" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect x="2" y="6" width="22" height="44" rx="8" fill="${colorMain}" stroke="#111827" stroke-width="2"/>
          <rect x="6" y="12" width="14" height="10" rx="2" fill="#111827" opacity="0.6"/>
          <rect x="6" y="38" width="14" height="8" rx="2" fill="#111827" opacity="0.4"/>
        </svg>`;
    }
  };

  // אייקון רכב נע (DivIcon עם SVG ורוטציה) - מוקטן
  const createVehicleIcon = (type, color, heading) => {
    if (!window?.L) return null;
    const svg = svgByType(type, color);
    const size = type === 'scooter' ? [12, 28] : type === 'truck' ? [22, 48] : type === 'van' ? [18, 36] : type === 'taxi' ? [18, 36] : [18, 36];
    const anchor = [size[0] / 2, size[1] / 2];
    const html = `<div style=\"width:${size[0]}px;height:${size[1]}px;transform:rotate(${heading}deg);transform-origin:center center;\">${svg}</div>`;
    return window.L.divIcon({ className: 'moving-vehicle', html, iconSize: size, iconAnchor: anchor });
  };

  useEffect(() => {
    const waypointGroups = [
      [[32.113, 34.798], [32.062, 34.773]],
      [[32.050, 34.757], [32.074, 34.788]],
      [[32.095, 34.835], [32.079, 34.792]],
      [[32.140, 34.817], [32.064, 34.783]],
      [[32.099, 34.770], [32.063, 34.790]],
    ];

    (async () => {
      const fetched = await Promise.all(waypointGroups.map(fetchOsrmRoute));
      const colors = ['#ff7a1a', '#3b82f6', '#22c55e', '#a855f7', '#ef4444'];
      const photos = [11, 12, 13, 14, 15].map((n) => `https://i.pravatar.cc/80?img=${n}`);
      const types = ['taxi', 'car', 'truck', 'scooter', 'van'];
      const prepared = fetched.map((r, i) => ({ ...r, color: colors[i % colors.length], photo: photos[i % photos.length], type: types[i % types.length] }));
      setRoutes(prepared);

      // אתחול רכבים
      const initialVehicles = prepared.map((r, i) => {
        const { segMeters, totalMeters } = accumulateDistances(r.path);
        const type = r.type;
        let speedKmh = 35;
        if (type === 'truck') speedKmh = 20 + Math.random() * 25; // 20-45
        else if (type === 'van') speedKmh = 25 + Math.random() * 25; // 25-50
        else if (type === 'scooter') speedKmh = 25 + Math.random() * 20; // 25-45
        else if (type === 'taxi') speedKmh = 40 + Math.random() * 30; // 40-70
        else speedKmh = 30 + Math.random() * 30; // car
        const startPoint = pointAtDistance(r.path, segMeters, 0);
        return {
          idx: i,
          type,
          progress: 0,
          speedKmh,
          totalMeters,
          segMeters,
          position: startPoint.point,
          heading: startPoint.heading,
          color: r.color,
        };
      });
      setVehicles(initialVehicles);
    })();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [selectedTrip]);

  // לוגיקת אנימציה
  useEffect(() => {
    if (!vehicles || vehicles.length === 0) return;

    const tick = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dtMs = ts - lastTsRef.current;
      lastTsRef.current = ts;

      setVehicles((prev) =>
        prev.map((v) => {
          const metersPerMs = (v.speedKmh * 1000) / 3600000; // km/h -> m/ms
          const deltaMeters = metersPerMs * dtMs;
          let traveledMeters = v.progress * v.totalMeters + deltaMeters;
          // לולאה אינסופית במסלול
          while (traveledMeters > v.totalMeters) traveledMeters -= v.totalMeters;
          const newProgress = traveledMeters / v.totalMeters;
          const { point, heading } = pointAtDistance(routes[v.idx].path, v.segMeters, traveledMeters);
          return { ...v, progress: newProgress, position: point, heading };
        })
      );

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
      lastTsRef.current = null;
    };
  }, [routes, vehicles.length]);

  const onDestinationClick = async (idx) => {
    const route = routes[idx];
    if (!route || route.path.length === 0) return;
    const end = route.path[route.path.length - 1];
    const info = await reverseGeocode(end[0], end[1]);
    setSelectedDestination({ idx, lat: end[0], lng: end[1], info, distance: route.distance, duration: route.duration });
  };

  return (
    <div className="relative">
      <div style={{ height: height, width: '100%' }} className="rounded-xl overflow-hidden bg-[#0f0f0f] border border-gray-800 relative">
        <MapContainer center={telAvivCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <Pane name="routes-glow" style={{ zIndex: 350 }}>
            {routes.map((route, idx) => (
              <Polyline key={`glow-${idx}`} positions={route.path} pathOptions={{ color: route.color, opacity: 0.3, weight: 10 }} />
            ))}
          </Pane>

          <Pane name="routes" style={{ zIndex: 400 }}>
            {routes.map((route, idx) => (
              <Polyline key={`route-${idx}`} positions={route.path} pathOptions={{ color: route.color, weight: 4 }} />
            ))}
          </Pane>

          <Pane name="markers" style={{ zIndex: 450 }}>
            {routes.map((route, idx) => {
              if (!route || route.path.length === 0) return null;
              const start = route.path[0];
              const end = route.path[route.path.length - 1];
              const icon = createPhotoPinIcon(route.photo, '#ffffff');
              return (
                <React.Fragment key={`markers-${idx}`}>
                  {/* נקודת התחלה */}
                  <CircleMarker center={start} radius={5} pathOptions={{ color: '#0f0f0f', weight: 2, fillColor: '#3cff9a', fillOpacity: 1 }} />

                  {/* יעד עם תמונה בסגנון פין */}
                  {icon ? (
                    <Marker position={end} icon={icon} eventHandlers={{ click: () => onDestinationClick(idx) }} />
                  ) : (
                    <CircleMarker center={end} radius={9} pathOptions={{ color: '#ffffff', weight: 3, fillColor: route.color, fillOpacity: 1 }} eventHandlers={{ click: () => onDestinationClick(idx) }} />
                  )}
                </React.Fragment>
              );
            })}

            {/* רכבים בתנועה (סוגים שונים) */}
            {vehicles.map((v) => {
              const icon = createVehicleIcon(v.type, v.color, v.heading);
              return icon ? (
                <Marker key={`veh-${v.idx}`} position={v.position} icon={icon} />
              ) : null;
            })}
          </Pane>

          <FitToRoutes routes={routes} />
        </MapContainer>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />

        {selectedDestination && (
          <div className="pointer-events-auto absolute bottom-4 right-4 w-[340px] max-w-[90vw] bg-black/70 border border-white/10 rounded-xl shadow-2xl backdrop-blur z-[500] overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-gray-700/40 to-gray-900/60 flex items-center justify-center text-gray-300">
              <span className="text-sm">תצוגה מקדימה של היעד</span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: routes[selectedDestination.idx]?.color || '#fff' }} />
                <h4 className="text-white font-semibold text-base line-clamp-1">{selectedDestination.info?.name || 'יעד'}</h4>
              </div>
              <div className="text-gray-300 text-xs leading-6">
                {selectedDestination.info?.address || '—'}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>מרחק: {metersToKm(selectedDestination.distance)}</span>
                <span>זמן משוער: {secondsToTime(selectedDestination.duration)}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => setSelectedDestination(null)}>סגור</button>
                <a className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700" href={`https://www.google.com/maps/search/?api=1&query=${selectedDestination.lat},${selectedDestination.lng}`} target="_blank" rel="noreferrer">נווט</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripMap; 