import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './map.css';
import { useNavigate } from 'react-router-dom';

export function Map() {
  const navigate = useNavigate();

  useEffect(() => {
    const provo = [40.2338, -111.6585];

    const map = L.map('map').setView(provo, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(provo).addTo(map);

    // Create popup content using DOM elements
    const popupDiv = L.DomUtil.create('div');
    const title = L.DomUtil.create('strong', '', popupDiv);
    title.innerText = 'PicklePlayer';

    const br = document.createElement('br');
    popupDiv.appendChild(br);

    const button = L.DomUtil.create('button', 'btn btn-sm btn-primary', popupDiv);
    button.innerText = 'View Player';
    button.onclick = () => navigate('/match');

    marker.bindPopup(popupDiv);
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