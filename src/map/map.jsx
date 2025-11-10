import React, { useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './map.css';
import { useNavigate } from 'react-router-dom';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function get_curr_loc() {
  // replace with actual geolocation API call or stored user location
  return [40.2338, -111.6585 ];
}

async function fetchPlayersNear() {
  // Replace with api call to player database
  return [
    { id: 1, name: 'Joe Mama',   lat: 40.2400,  lng: -111.6500 },
    { id: 2, name: 'PicklePlayer', lat: 40.2338,  lng: -111.6585 },
    { id: 3, name: 'AceGamer',     lat: 40.2445,  lng: -111.6602 },
    { id: 4, name: 'SmashMaster',  lat: 40.2261,  lng: -111.6501 },
    { id: 5, name: 'VolleyQueen',  lat: 40.2389,  lng: -111.6705 },
  ];
}

function jitterLatLng(lat, lng, meters = 12) {
  // mimic how we'll want the to be live locations
  const dLat = (Math.random() - 0.5) * (meters / 111);
  const dLng = (Math.random() - 0.5) * (meters / (111 * Math.cos((lat * Math.PI) / 180)));
  return [lat + dLat, lng + dLng];
}

export function PlayerMap() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const markersRef = useRef(new window.Map());
  const playersRef = useRef([]);
  const tickTimerRef = useRef(null);
  const searchInputRef = useRef(null);
  const highlightRef = useRef(null);
  const [weather, setWeather] = React.useState(null);

  const handleChatClick = useCallback((playerId) => {
    // change to a get from player profile database later
    console.log(`Clicked viewPlayer with id: ${playerId}`);
    navigate(`/match/${playerId}`);
  }, [navigate]);

  function focusPlayerByName(query) {
    if (!query || !mapRef.current) return;
    const q = query.trim().toLowerCase();

    // find first name that includes the query
    const match = playersRef.current.find(p => p.name.toLowerCase().includes(q));
    if (!match) {
      // could todo: show a toast/alert here
      return;
    }

    const marker = markersRef.current.get(match.id);
    if (!marker) return;

    mapRef.current.setView([match.lat, match.lng], Math.max(mapRef.current.getZoom(), 15), { animate: true });
    marker.openPopup();

    if (highlightRef.current) {
      mapRef.current.removeLayer(highlightRef.current);
    }
    highlightRef.current = L.circleMarker([match.lat, match.lng], {
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
    // Initialize map with default center and zoom
    const baseCenter = get_curr_loc();
    const mapDiv = L.map('map').setView(baseCenter, 13);
    mapRef.current = mapDiv;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(mapDiv);

    // Try to get user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const userCenter = [pos.coords.latitude, pos.coords.longitude];
        mapDiv.setView(userCenter, 13);
        L.marker(userCenter, { title: 'You are here' })
          .addTo(mapDiv)
          .bindPopup("<b>You</b>");

        (async () => {
          try {
            const pointResp = await fetch(`https://api.weather.gov/points/${userCenter[0]},${userCenter[1]}`);
            if (!pointResp.ok) throw new Error(`Weather.gov points API error: ${pointResp.status}`);
            const pointData = await pointResp.json();
            const forecastUrl = pointData.properties.forecast;

            const forecastResp = await fetch(forecastUrl);
            if (!forecastResp.ok) throw new Error(`Weather.gov forecast error: ${forecastResp.status}`);
            const forecastData = await forecastResp.json();

            const currentPeriod = forecastData.properties.periods[0];
            const weatherInfo = `${currentPeriod.shortForecast}, ${currentPeriod.temperature}°${currentPeriod.temperatureUnit}`;

            setWeather(weatherInfo);
          } catch (err) {
            console.error('Failed to fetch weather:', err);
            setWeather('Weather data unavailable');
          }
        })();
      },
      (error) => {
        console.log('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    const layer = L.layerGroup().addTo(mapDiv);
    markerLayerRef.current = layer;

    function addPlayerMarker(player) {
      const marker = L.marker([player.lat, player.lng]).addTo(layer);
      const popupDiv = L.DomUtil.create('div');
      const title = L.DomUtil.create('strong', '', popupDiv);
      title.innerText = player.name;

      popupDiv.appendChild(document.createElement('br'));

      const btn = L.DomUtil.create('button', 'btn btn-sm btn-primary mt-1', popupDiv);
      btn.innerText = 'View Player';
      btn.onclick = () => handleChatClick(player.id);

      marker.bindPopup(popupDiv);
      markersRef.current.set(player.id, marker);
    }

    (async () => {
      const players = await fetchPlayersNear();
      playersRef.current = players.map((p) => ({...p }));

      const bounds = L.latLngBounds([]);
      players.forEach((p) => {
        addPlayerMarker(p);
        bounds.extend([p.lat, p.lng]);
      });

      if (bounds.isValid()) mapDiv.fitBounds(bounds.pad(0.2));
    })();

    const movers = new Set();

    function chooseMovers() {
      const all = playersRef.current.map(p => p.id);
      while (movers.size < Math.ceil(all.length / 2)) {
        movers.add(all[Math.floor(Math.random() * all.length)]);
      }
    }
    chooseMovers();

    function tick() {
      playersRef.current.forEach((p) => {
        if (!movers.has(p.id)) return;
        const [lat, lng] = jitterLatLng(p.lat, p.lng, 30 + Math.random() * 50);
        p.lat = lat;
        p.lng = lng;

        const marker = markersRef.current.get(p.id);
        if (marker) marker.setLatLng([lat, lng]);
      });

      tickTimerRef.current = setTimeout(tick, 800 + Math.random() * 1200);
    }
    tickTimerRef.current = setTimeout(tick, 1000);

    // Cleanup
    return () => {
      if (tickTimerRef.current) {
        clearTimeout(tickTimerRef.current);
      }
      if (mapRef.current) {
        mapRef.current.remove();
      }
      mapRef.current = null;
      markerLayerRef.current = null;
      markersRef.current.clear();
    };
  }, [navigate]);

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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  focusPlayerByName(e.currentTarget.value);
                }
              }}
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