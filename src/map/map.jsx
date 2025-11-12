import React, { useEffect, useRef, useCallback, use } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './map.css';
import { useNavigate } from 'react-router-dom';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function norm(s) {
  return (s || '').trim().toLowerCase();
}

function matchScore(name, q) {
  const n = norm(name);
  if (!q || !n.includes(q)) return 0;
  if (n === q) return 3;           // exact match
  if (n.startsWith(q)) return 2;   // prefix match
  return 1;                        // substring match
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function get_curr_loc() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using fallback.');
      return resolve([40.2338, -111.6585]); // fallback (Provo-ish)
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve([latitude, longitude]);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // fallback location if user blocks or errors
        resolve([40.2338, -111.6585]);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

// --- helpers ---
function throttle(fn, wait) {
  let last = 0;
  let t;
  return (...args) => {
    const now = Date.now();
    const remain = wait - (now - last);
    clearTimeout(t);
    if (remain <= 0) {
      last = now;
      fn(...args);
    } else {
      t = setTimeout(() => {
        last = Date.now();
        fn(...args);
      }, remain);
    }
  };
}

// --- API calls ---
async function apiFetchPlayersNear([lat, lng]) {
  const r = await fetch(`/api/map/players?lat=${lat}&lng=${lng}`);
  if (!r.ok) throw new Error('players fetch failed');
  const data = await r.json();
  return data.players ?? [];
}
async function apiPostLocation({ lat, lng }) {
  const r = await fetch(`/api/map/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  });
  if (!r.ok) throw new Error('share on failed');
  return r.json(); // { ok, expiresAt }
}
async function apiDeleteLocation() {
  const r = await fetch(`/api/map/location`, { method: 'DELETE' });
  if (!r.ok) throw new Error('share off failed');
  return r.json();
}

export function PlayerMap() {
  const navigate = useNavigate();
  const [pendingViewId, setPendingViewId] = React.useState(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const markersRef = useRef(new window.Map());
  const playersRef = useRef([]);
  const searchInputRef = useRef(null);
  const highlightRef = useRef(null);

  const refreshTimerRef = useRef(null);
  const watchIdRef = useRef(null);
  const autoOffTimerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [weather, setWeather] = React.useState(null);
  const [sharing, setSharing] = React.useState(false);

  const handleViewClick = useCallback((playerId) => {
    console.log(`Clicked viewPlayer with id: ${playerId}`);
    setPendingViewId(playerId); // defer actual navigation to React
    //navigate(`/match/${playerId}`);
  }, [/*navigate*/]);

  function focusPlayerByName(query) {
    if (!query || !mapRef.current) return;

    const q = norm(query);
    const center = mapRef.current.getCenter();

    // score candidates
    const candidates = playersRef.current
      .map(p => ({
        p,
        score: matchScore(p.name, q),
        // tie-breaker: distance to current map center
        dist: Math.hypot((p.lat - center.lat), (p.lng - center.lng)),
      }))
      .filter(x => x.score > 0)
      .sort((a, b) => (b.score - a.score) || (a.dist - b.dist));

    if (candidates.length === 0) {
      // no match found
      alert(`No player found matching "${query}"`);
      return;
    }

    const { p } = candidates[0]; // best match

    const marker = markersRef.current.get(p.id);
    if (!marker) return;

    // zoom & show popup
    mapRef.current.setView([p.lat, p.lng], Math.max(mapRef.current.getZoom(), 15), { animate: true });
    marker.openPopup();

    // quick highlight pulse
    if (highlightRef.current) {
      mapRef.current.removeLayer(highlightRef.current);
    }
    highlightRef.current = L.circleMarker([p.lat, p.lng], {
      radius: 18,
      color: '#2a81ea',
      weight: 3,
      opacity: 0.9,
      fillOpacity: 0.1,
    }).addTo(mapRef.current);

    setTimeout(() => {
      if (highlightRef.current) {
        mapRef.current.removeLayer(highlightRef.current);
        highlightRef.current = null;
      }
    }, 2000);
  }

  useEffect(() => {
    if (pendingViewId) {
      navigate(`/match/${pendingViewId}`);
      setPendingViewId(null);
    }
  }, [pendingViewId, navigate]);

  useEffect(() => {
    let mapDiv; // so we can clean it up

    (async () => {
      const baseCenter = await get_curr_loc();

      // init map AFTER we have real coords
      mapDiv = L.map('map').setView(baseCenter, 13);
      mapRef.current = mapDiv;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapDiv);

      const layer = L.layerGroup().addTo(mapDiv);
      markerLayerRef.current = layer;

      // try geolocation for weather (optional)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const userCenter = [pos.coords.latitude, pos.coords.longitude];
          mapDiv.setView(userCenter, 13);
          const m = L.marker(userCenter, { title: 'You are here' })
            .addTo(mapDiv)
            .bindPopup("<b>You</b>");
          userMarkerRef.current = m;

          try {
            const pointResp = await fetch(`https://api.weather.gov/points/${userCenter[0]},${userCenter[1]}`);
            if (!pointResp.ok) throw new Error(`Weather.gov points API error: ${pointResp.status}`);
            const pointData = await pointResp.json();
            const forecastUrl = pointData.properties.forecast;
            const forecastResp = await fetch(forecastUrl);
            if (!forecastResp.ok) throw new Error(`Weather.gov forecast error: ${forecastResp.status}`);
            const forecastData = await forecastResp.json();
            const currentPeriod = forecastData.properties.periods[0];
            setWeather(`${currentPeriod.shortForecast}, ${currentPeriod.temperature}°${currentPeriod.temperatureUnit}`);
          } catch (err) {
            console.error('Failed to fetch weather:', err);
            setWeather('Weather data unavailable');
          }
        }, (error) => console.log('Geolocation error:', error), { enableHighAccuracy: true, timeout: 5000 });
      }

      // refresh loop
      async function refreshPlayers() {
        try {
          if (!mapRef.current) return;
          const c = mapRef.current.getCenter();
          const players = await apiFetchPlayersNear([c.lat, c.lng]);
          playersRef.current = players.map(p => ({ ...p }));
          const seen = new Set(players.map(p => p.id));

          players.forEach(p => {
            console.log("processing player with id:", p.id);
            const m = markersRef.current.get(p.id);
            if (m) {
              m.setLatLng([p.lat, p.lng]);
            } else {
              const marker = L.marker([p.lat, p.lng]).addTo(markerLayerRef.current);
              const popupDiv = L.DomUtil.create('div');
              const title = L.DomUtil.create('strong', '', popupDiv);
              title.innerText = p.name ?? 'Player';
              popupDiv.appendChild(document.createElement('br'));
              const btn = L.DomUtil.create('button', 'btn btn-sm btn-primary mt-1', popupDiv);
              btn.innerText = 'View Player';
              console.log("creating view button for playerId:", p.id);
              L.DomEvent.on(btn, 'click', (e) => {
                // stop Leaflet/map from eating the click
                L.DomEvent.stopPropagation(e);
                L.DomEvent.preventDefault(e);
                console.log("Button clicked for playerId:", p.id);
                handleViewClick(p.id);
              });
              // btn.addEventListener('click', () => {
              //   console.log("Button clicked for playerId:", p.id);
              //   handleViewClick(p.id);
              // });
              btn.style.pointerEvents = 'auto';
              marker.bindPopup(popupDiv);
              markersRef.current.set(p.id, marker);
            }
          });

          // remove disappeared
          for (const [id, marker] of markersRef.current) {
            if (!seen.has(id)) {
              mapRef.current.removeLayer(marker);
              markersRef.current.delete(id);
            }
          }
        } catch (e) {
          console.error('refreshPlayers failed', e);
        }
      }

      refreshPlayers();
      refreshTimerRef.current = setInterval(refreshPlayers, 12000);
    })();

    // ✅ return cleanup from useEffect (not inside the IIFE)
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      if (autoOffTimerRef.current) clearTimeout(autoOffTimerRef.current);
      if (mapRef.current) { mapRef.current.remove() }
      mapRef.current = null;
      markerLayerRef.current = null;
      markersRef.current.clear();
    };
  }, []);//navigate, handleViewClick]);

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 text-center py-3">
        <h1>Map</h1>
      </header>

      {weather && (
        <div className="weather-box container text-center my-2">
          <div className="alert alert-info d-inline-block px-3 py-2 m-0">
            <strong>Current Weather:</strong> {weather}
          </div>
        </div>
      )}

      {/* Share toggle */}
      <div className="container text-center my-2">
        <div className="form-check form-switch d-inline-flex align-items-center gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="shareSwitch"
            checked={sharing}
            onChange={async (e) => {
              const enable = e.target.checked;
              if (enable) {
                if (!navigator.geolocation) {
                  alert('Geolocation not supported');
                  return;
                }
                const send = throttle(async (coords) => {
                  try { await apiPostLocation({ lat: coords.latitude, lng: coords.longitude }); }
                  catch (err) { console.error('share on failed', err); }
                }, 10000);

                watchIdRef.current = navigator.geolocation.watchPosition(
                  (pos) => {
                    if (userMarkerRef.current) {
                      userMarkerRef.current.setLatLng([pos.coords.latitude, pos.coords.longitude]);
                    }
                    send(pos.coords);
                  },
                  (err) => {
                    console.error('geo error', err);
                    setSharing(false);
                    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
                    alert('Could not get location.');
                  },
                  { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
                );

                setSharing(true);
              } else {
                setSharing(false);
                if (watchIdRef.current) {
                  navigator.geolocation.clearWatch(watchIdRef.current);
                  watchIdRef.current = null;
                }
                if (autoOffTimerRef.current) {
                  clearTimeout(autoOffTimerRef.current);
                  autoOffTimerRef.current = null;
                }
                try { await apiDeleteLocation(); } catch (err) { console.error('share off failed', err); }
              }
            }}
          />
          <label className="form-check-label" htmlFor="shareSwitch">
            {sharing ? 'Sharing location (3h max)' : 'Share my location'}
          </label>
        </div>
      </div>

      <main className="container flex-grow-1 d-flex flex-column align-items-center" style={{ paddingBottom: '80px' }}>
        <div className="w-100 mb-3" style={{ maxWidth: '600px' }}>
          <label htmlFor="search" className="form-label">Find a friend:</label>
          <div className="d-flex gap-2">
            <input
              ref={searchInputRef}
              type="search"
              id="search"
              name="varSearch"
              className="form-control"
              placeholder="Type a name, e.g., AceGamer"
              onKeyDown={(e) => { if (e.key === 'Enter') { focusPlayerByName(e.currentTarget.value); } }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => focusPlayerByName(searchInputRef.current?.value || '')}
              style={{ whiteSpace: 'nowrap' }}
            >
              Find
            </button>
          </div>
        </div>

        <div className="w-100" style={{ height: '400px', maxWidth: '95%' }}>
          <div id="map" style={{ height: '100%', width: '100%' }}></div>
        </div>
      </main>

      <footer>
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-bottom">
          <div className="container-fluid">
            <ul className="navbar-nav mx-auto d-flex flex-row gap-3">
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/login')}>Logout</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/match')}>Match</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link btn btn-link text-secondary disabled" disabled>Map</button>
              </li>
              <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/chat_list')}>Chats</button>
              </li>
            </ul>
          </div>
        </nav>
      </footer>
    </div>
  );
}