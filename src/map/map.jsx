import React, { useEffect, useRef } from 'react';
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
  return { lat: 40.2338, lng: -111.6585 };
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

export function Map() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  useEffect(() => {
    const currentUserLoc = get_curr_loc();

    const map = L.map('map').setView(currentUserLoc, 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    markerLayerRef.current = layer;

    function addPlayerMarker(player) {
      const marker = L.marker([player.lat, player.lng]).addTo(layer);
      const popupDiv = L.DomUtil.create('div');
      const title = L.DomUtil.create('strong', '', popupDiv);
      title.innerText = player.name;

      popupDiv.appendChild(document.createElement('br'));

      const btn = L.DomUtil.create('button', 'btn btn-sm btn-primary mt-1', popupDiv);
      btn.innerText = 'View Player';
      btn.onclick = () => navigate('/match');

      marker.bindPopup(popupDiv);
      return marker;
    }

    (async () => {
      const players = await fetchPlayersNear();
      if (!players?.length) return;

      const bounds = L.latLngBounds([]);
      players.forEach((p) => {
        addPlayerMarker(p);
        bounds.extend([p.lat, p.lng]);
      });

      if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));
    })();

    //cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [navigate]);

  return (
    <div className="container-fluid px-4 d-flex flex-column min-vh-100">
      <header className="container-fluid px-4 text-center py-3">
        <h1>Map</h1>
      </header>

      <main className="container flex-grow-1 d-flex flex-column align-items-center" style={{ paddingBottom: '80px' }}>
        <div className="w-100 mb-3" style={{ maxWidth: '600px' }}>
          <label htmlFor="search" className="form-label">SearchBar Standin:</label>
          <input type="search" id="search" name="varSearch" className="form-control" />
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
              {/* <li className="nav-item">
                <button type="button" className="nav-link active btn btn-link" onClick={() => navigate('/profile')}>Profile</button>
              </li> */}
            </ul>
          </div>
        </nav>
      </footer>
    </div>
  );
}