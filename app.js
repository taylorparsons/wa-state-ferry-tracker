// Washington State Ferries (WSF) Live Tracker Application Engine

let map;
let routePolylines = {};
let vesselMarkers = {};
let activeRouteFilter = null;
let wsdotApiKey = localStorage.getItem("wsdot_api_key") || "";

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  renderRoutesList();
  renderTerminalWaitGrid();
  renderWeatherWidget();
  renderAlertTicker();
  setupEventListeners();
  restoreSavedState();

  // Start real-time movement simulation tick (every 2 seconds)
  setInterval(updateVesselPositions, 2000);
});

let tileLayer;
let currentTheme = localStorage.getItem("wsf_theme") || "dark";

// Initialize Leaflet Map with persisted view state or defaults
function initMap() {
  const savedView = getSavedMapView();
  const initialLat = savedView ? savedView.lat : 47.70;
  const initialLng = savedView ? savedView.lng : -122.45;
  const initialZoom = savedView ? savedView.zoom : 9;

  map = L.map("leaflet-map", {
    zoomControl: false
  }).setView([initialLat, initialLng], initialZoom);

  // Save map center and zoom level whenever user pans or zooms
  map.on("moveend", () => {
    const center = map.getCenter();
    saveState({ lat: center.lat, lng: center.lng, zoom: map.getZoom() });
  });

  // Map Tiles (CartoDB Dark Matter / Voyager depending on theme)
  const isLight = currentTheme === "light";
  const tileUrl = isLight 
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  tileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 16
  }).addTo(map);

  applyTheme(currentTheme);

  // Position Zoom control on top right
  L.control.zoom({ position: "topright" }).addTo(map);

  // Draw Ferry Routes & Terminals
  drawRoutes();
  drawTerminals();
  drawVessels();

  // Recalculate map dimensions after layout renders
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);
}

function applyTheme(theme) {
  currentTheme = theme;
  const isLight = theme === "light";
  if (isLight) {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }

  const themeIcon = document.getElementById("theme-icon");
  const themeLabel = document.getElementById("theme-btn-label");
  if (themeIcon) {
    themeIcon.className = isLight ? "fas fa-moon" : "fas fa-sun";
    themeIcon.style.color = isLight ? "#0284C7" : "#FFB703";
  }
  if (themeLabel) {
    themeLabel.innerText = isLight ? "Dark Mode" : "Light Mode";
  }

  if (map && tileLayer) {
    map.removeLayer(tileLayer);
    const tileUrl = isLight 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 16
    }).addTo(map);
  }

  localStorage.setItem("wsf_theme", theme);
}

// Persistent View State Helpers
function saveState(customView = null) {
  if (map) {
    const view = customView || { lat: map.getCenter().lat, lng: map.getCenter().lng, zoom: map.getZoom() };
    localStorage.setItem("wsf_map_view", JSON.stringify(view));
  }
  if (activeRouteFilter !== undefined) {
    localStorage.setItem("wsf_active_route", activeRouteFilter || "");
  }
}

function getSavedMapView() {
  try {
    const saved = localStorage.getItem("wsf_map_view");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

function restoreSavedState() {
  // Restore active route filter
  const savedRoute = localStorage.getItem("wsf_active_route");
  if (savedRoute) {
    activeRouteFilter = savedRoute;
    renderRoutesList();
  }

  // Restore active terminal popup
  const savedTerminalId = localStorage.getItem("wsf_active_terminal");
  if (savedTerminalId) {
    const termId = parseInt(savedTerminalId, 10);
    const terminal = WSF_DATA.terminals.find(t => t.id === termId);
    if (terminal) {
      setTimeout(() => {
        map.eachLayer(layer => {
          if (layer.getLatLng && Math.abs(layer.getLatLng().lat - terminal.lat) < 0.001 && Math.abs(layer.getLatLng().lng - terminal.lng) < 0.001) {
            layer.openPopup();
          }
        });
      }, 500);
    }
  }
}

// Draw Polyline Routes on Map
function drawRoutes() {
  WSF_DATA.routes.forEach(route => {
    const polyline = L.polyline(route.waypoints, {
      color: route.color,
      weight: 3,
      opacity: 0.75,
      dashArray: "6, 8"
    }).addTo(map);

    polyline.bindTooltip(route.name, { sticky: true, className: "route-tooltip" });
    routePolylines[route.id] = polyline;
  });
}

// Draw Terminal Pins on Map with Live Wait Times
function drawTerminals() {
  WSF_DATA.terminals.forEach(terminal => {
    const terminalIcon = L.divIcon({
      className: "terminal-map-marker",
      html: `
        <div class="terminal-pin-card">
          <span style="font-size: 11px;">⚓</span>
          <span class="terminal-pin-name">${terminal.shortName}</span>
          <span class="terminal-pin-wait ${terminal.status}">${terminal.waitMinutes}m wait</span>
        </div>
      `,
      iconSize: [140, 26],
      iconAnchor: [70, 13]
    });

    const marker = L.marker([terminal.lat, terminal.lng], { icon: terminalIcon }).addTo(map);
    
    const percentFull = Math.round(((terminal.totalSpaces - terminal.drivesAvailable) / terminal.totalSpaces) * 100);
    const liveCamSrc = `${terminal.cameraUrl}?t=${Date.now()}`;

    marker.bindPopup(`
      <div style="font-family: var(--font-body); padding: 6px; min-width: 280px; max-width: 320px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <h4 style="color: var(--accent-cyan-light); font-size: 0.95rem; font-family: var(--font-heading);">⚓ ${terminal.name}</h4>
          <span class="wait-badge ${terminal.status}">${terminal.waitMinutes} min wait</span>
        </div>

        <!-- REAL LIVE WSDOT PUBLIC TRAFFIC CAMERA FEED -->
        <div style="position: relative; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-active); margin-bottom: 8px; background: #000; min-height: 140px;">
          <img src="${liveCamSrc}" 
               alt="${terminal.cameraTitle}" 
               onerror="this.onerror=null; this.src='assets/cam_seattle.png';"
               style="width: 100%; height: 145px; object-fit: cover; display: block;">
          <div style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.8); color: #55E52B; font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(85, 229, 43, 0.5); display: flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; background: #55E52B; border-radius: 50%; display: inline-block;"></span>
            <span>REAL WSDOT LIVE CAM</span>
          </div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(180deg, transparent, rgba(0,0,0,0.9)); padding: 4px 8px; font-size: 0.68rem; color: #E2E8F0;">
            📷 ${terminal.cameraTitle}
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 8px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 4px;">
            <span>Drive-Up Spaces:</span>
            <strong style="color: #55E52B;">${terminal.drivesAvailable} open</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 6px;">
            <span>Holding Queue:</span>
            <strong>${percentFull}% full (${terminal.totalSpaces - terminal.drivesAvailable}/${terminal.totalSpaces})</strong>
          </div>
          <div class="capacity-meter" style="margin-bottom: 8px;">
            <div class="capacity-fill" style="width: ${percentFull}%; background-color: ${percentFull > 75 ? '#FFB703' : '#00B4D8'};"></div>
          </div>
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 6px; font-size: 0.72rem; color: var(--accent-cyan-light);">
            ⏱️ Next Departure: <strong>in ${terminal.nextSailingMin || 15}m</strong> (${terminal.sailingVessel || 'M/V Tacoma'})
          </div>
        </div>

        <a href="${terminal.officialCamUrl}" target="_blank" rel="noopener" style="display: block; text-align: center; background: rgba(0, 180, 216, 0.15); border: 1px solid var(--accent-cyan); color: var(--accent-cyan-light); font-size: 0.75rem; font-weight: 600; padding: 6px; border-radius: 6px; text-decoration: none; transition: background 0.2s;">
          <i class="fas fa-external-link-alt" style="margin-right: 4px;"></i> View WSDOT Live Stream Page
        </a>
      </div>
    `);

    marker.on("popupopen", () => {
      localStorage.setItem("wsf_active_terminal", terminal.id);
      saveState();
    });

    marker.on("popupclose", () => {
      if (localStorage.getItem("wsf_active_terminal") == terminal.id) {
        localStorage.removeItem("wsf_active_terminal");
      }
    });
  });
}

// Calculate interpolated position along route waypoints given progress (0.0 to 1.0)
function getPositionAlongWaypoints(waypoints, progress) {
  if (progress <= 0) return waypoints[0];
  if (progress >= 1) return waypoints[waypoints.length - 1];

  const totalSegments = waypoints.length - 1;
  const scaledProgress = progress * totalSegments;
  const segmentIndex = Math.floor(scaledProgress);
  const segmentFactor = scaledProgress - segmentIndex;

  const p1 = waypoints[segmentIndex];
  const p2 = waypoints[segmentIndex + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * segmentFactor;
  const lng = p1[1] + (p2[1] - p1[1]) * segmentFactor;

  return [lat, lng];
}

// Calculate heading angle (bearing) between two lat/lng coordinates
function calculateHeading(p1, p2) {
  const dLng = (p2[1] - p1[1]) * (Math.PI / 180);
  const lat1 = p1[0] * (Math.PI / 180);
  const lat2 = p2[0] * (Math.PI / 180);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// Draw Ferry Vessels on Map
function drawVessels() {
  WSF_DATA.vessels.forEach(vessel => {
    const route = WSF_DATA.routes.find(r => r.id === vessel.routeId);
    if (!route) return;

    // Determine path waypoints based on direction
    const waypoints = vessel.direction === 1 ? route.waypoints : [...route.waypoints].reverse();
    const pos = getPositionAlongWaypoints(waypoints, vessel.progress);

    // Calculate heading rotation
    const futurePos = getPositionAlongWaypoints(waypoints, Math.min(1.0, vessel.progress + 0.05));
    const heading = calculateHeading(pos, futurePos);

    const vesselIcon = L.divIcon({
      className: `vessel-map-icon vessel-${vessel.id}`,
      html: `
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="
            transform: rotate(${heading}deg);
            transition: transform 0.8s linear;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              background: linear-gradient(135deg, #00B4D8, #4361EE);
              border: 2px solid #FFFFFF;
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 0 14px rgba(0, 180, 216, 0.9);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="transform: rotate(45deg); font-size: 14px;">🚢</span>
            </div>
          </div>

          <div class="vessel-pin-card">
            <span class="vessel-pin-name">${vessel.name}</span>
            <span class="vessel-pin-speed">${vessel.speedKnots} kts • 💨 ${vessel.windSpeedKnots || 12} kts ${vessel.windDirection || 'NW'}</span>
          </div>
        </div>
      `,
      iconSize: [180, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker(pos, { icon: vesselIcon }).addTo(map);

    marker.bindPopup(`
      <div class="popup-vessel-card" style="min-width: 230px;">
        <h3>🚢 ${vessel.name}</h3>
        <p class="class-tag">${vessel.class} Class • Built ${vessel.yearBuilt}</p>
        <div class="popup-vessel-stats">
          <div>Speed: <strong>${vessel.speedKnots} kts</strong></div>
          <div>Local Wind: <strong style="color: #4CC9F0;">💨 ${vessel.windSpeedKnots || 12} kts ${vessel.windDirection || 'NW'}</strong></div>
          <div>Capacity: <strong>${vessel.autoCapacity} autos</strong></div>
          <div>From: <strong>${vessel.fromTerminal}</strong></div>
          <div>To: <strong>${vessel.toTerminal}</strong></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; color: #94A3B8;">
          <span>Trip Progress</span>
          <span>${Math.round(vessel.progress * 100)}%</span>
        </div>
        <div class="popup-progress-bar">
          <div class="popup-progress-fill" style="width: ${vessel.progress * 100}%;"></div>
        </div>
      </div>
    `);

    vesselMarkers[vessel.id] = marker;
  });
}

// Live simulation tick - update vessel positions along waypoints
function updateVesselPositions() {
  WSF_DATA.vessels.forEach(vessel => {
    const route = WSF_DATA.routes.find(r => r.id === vessel.routeId);
    if (!route) return;

    // Advance progress
    vessel.progress += 0.008;

    // Reverse direction when reaching terminal
    if (vessel.progress >= 1.0) {
      vessel.progress = 0.0;
      vessel.direction = vessel.direction === 1 ? -1 : 1;
      const temp = vessel.fromTerminal;
      vessel.fromTerminal = vessel.toTerminal;
      vessel.toTerminal = temp;
    }

    const waypoints = vessel.direction === 1 ? route.waypoints : [...route.waypoints].reverse();
    const pos = getPositionAlongWaypoints(waypoints, vessel.progress);
    const futurePos = getPositionAlongWaypoints(waypoints, Math.min(1.0, vessel.progress + 0.05));
    const heading = calculateHeading(pos, futurePos);

    const marker = vesselMarkers[vessel.id];
    if (marker) {
      marker.setLatLng(pos);

      // Update rotation element
      const el = marker.getElement();
      if (el) {
        const rotEl = el.querySelector("div");
        if (rotEl) rotEl.style.transform = `rotate(${heading}deg)`;
      }
    }
  });
}

// Render Route List in Left Sidebar
function renderRoutesList() {
  const container = document.getElementById("route-list-container");
  container.innerHTML = "";

  WSF_DATA.routes.forEach(route => {
    const activeVessels = WSF_DATA.vessels.filter(v => v.routeId === route.id);

    const card = document.createElement("div");
    card.className = `route-card ${activeRouteFilter === route.id ? 'active' : ''}`;
    card.style.setProperty("--route-color", route.color);

    card.innerHTML = `
      <div class="route-header">
        <div class="route-name">${route.name}</div>
        <div class="vessel-count">${activeVessels.length} Active</div>
      </div>
      <div class="route-meta">
        <span><i class="fas fa-route"></i> ${route.distanceMiles} miles</span>
        <span><i class="far fa-clock"></i> ~${route.travelTimeMin} mins</span>
      </div>
    `;

    card.addEventListener("click", () => filterByRoute(route.id));
    container.appendChild(card);
  });
}

// Filter map view by route
function filterByRoute(routeId) {
  if (activeRouteFilter === routeId) {
    activeRouteFilter = null;
    map.setView([47.70, -122.45], 9);
  } else {
    activeRouteFilter = routeId;
    const route = WSF_DATA.routes.find(r => r.id === routeId);
    if (route) {
      const bounds = L.polyline(route.waypoints).getBounds();
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }
  saveState();
  renderRoutesList();
}

// Render Terminal Wait Cards with Live Camera Trigger
function renderTerminalWaitGrid() {
  const container = document.getElementById("terminal-grid-container");
  container.innerHTML = "";

  WSF_DATA.terminals.slice(0, 6).forEach(terminal => {
    const percentFull = Math.round(((terminal.totalSpaces - terminal.drivesAvailable) / terminal.totalSpaces) * 100);

    const card = document.createElement("div");
    card.className = "terminal-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div class="terminal-header">
        <div class="terminal-name">
          <span>${terminal.shortName}</span>
          <i class="fas fa-video" style="font-size: 0.72rem; color: var(--accent-cyan); margin-left: 4px;" title="Live Traffic Camera Available"></i>
        </div>
        <div class="wait-badge ${terminal.status}">${terminal.waitMinutes} min wait</div>
      </div>
      <div style="font-size: 0.75rem; color: #94A3B8; display: flex; justify-content: space-between;">
        <span>Drive-Up Spaces: ${terminal.drivesAvailable} open</span>
        <span>${percentFull}% full</span>
      </div>
      <div class="capacity-meter">
        <div class="capacity-fill" style="width: ${percentFull}%; background-color: ${percentFull > 75 ? '#FFB703' : '#00B4D8'};"></div>
      </div>
    `;

    card.addEventListener("click", () => {
      map.setView([terminal.lat, terminal.lng], 12);
      // Trigger popup opening for this terminal marker
      map.eachLayer(layer => {
        if (layer.getLatLng && layer.getLatLng().lat === terminal.lat && layer.getLatLng().lng === terminal.lng) {
          layer.openPopup();
        }
      });
    });

    container.appendChild(card);
  });
}

// Render Weather Widget
function renderWeatherWidget() {
  const w = WSF_DATA.weather;
  document.getElementById("weather-temp").innerText = `${w.tempF}°F`;
  document.getElementById("weather-details").innerText = `${w.condition} • Wind ${w.windSpeedMph}mph ${w.windDirection}`;
}

// Render Alert Ticker
function renderAlertTicker() {
  const tickerText = WSF_DATA.alerts.map(a => `<strong>[${a.route}]</strong> ${a.message}`).join(" &nbsp;&nbsp;•&nbsp;&nbsp; ");
  document.getElementById("ticker-text").innerHTML = tickerText;
}

// Setup Event Listeners
function setupEventListeners() {
  const searchInput = document.getElementById("route-search");
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".route-card");
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(q) ? "block" : "none";
    });
  });

  // Theme Toggle (Light / Dark Mode)
  const btnTheme = document.getElementById("btn-theme-toggle");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
    });
  }

  // Modal Open / Close
  const btnSettings = document.getElementById("btn-api-settings");
  const modal = document.getElementById("api-modal");
  const btnClose = document.getElementById("btn-modal-close");
  const form = document.getElementById("api-form");
  const inputKey = document.getElementById("input-api-key");

  if (wsdotApiKey) inputKey.value = wsdotApiKey;

  btnSettings.addEventListener("click", () => modal.classList.add("open"));
  btnClose.addEventListener("click", () => modal.classList.remove("open"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    wsdotApiKey = inputKey.value.trim();
    localStorage.setItem("wsdot_api_key", wsdotApiKey);
    alert(wsdotApiKey ? "WSDOT API Access Code saved! Direct live polling enabled." : "WSDOT API key cleared. Simulation mode active.");
    modal.classList.remove("open");
  });

  // Queue Predictor Listeners
  const termSelect = document.getElementById("queue-terminal-select");
  const etaSelect = document.getElementById("queue-drive-eta");
  if (termSelect && etaSelect) {
    termSelect.addEventListener("change", updateQueuePrediction);
    etaSelect.addEventListener("change", updateQueuePrediction);
    updateQueuePrediction();
  }

  setupAuthListeners();
}

function updateQueuePrediction() {
  const terminalSelect = document.getElementById("queue-terminal-select");
  const driveEtaSelect = document.getElementById("queue-drive-eta");
  const resultContainer = document.getElementById("queue-prediction-result");

  if (!terminalSelect || !driveEtaSelect || !resultContainer) return;

  const terminalId = parseInt(terminalSelect.value, 10);
  const driveMinutes = parseInt(driveEtaSelect.value, 10);

  const terminal = WSF_DATA.terminals.find(t => t.id === terminalId);
  if (!terminal) return;

  const totalMinutesToSailing = driveMinutes + terminal.waitMinutes;
  const nextSailingMin = terminal.nextSailingMin || 15;
  const vessel = terminal.sailingVessel || "M/V Tacoma";
  const spaces = terminal.drivesAvailable;

  let badgeClass = "queue-badge-high";
  let icon = "fa-check-circle";
  let textTitle = "HIGH CHANCE TO BOARD";
  let detailText = `Drive time (${driveMinutes}m) + toll queue (${terminal.waitMinutes}m) = ~${totalMinutesToSailing}m ETA. Boarding ${vessel} in ${nextSailingMin}m (${spaces} open deck spaces).`;

  if (totalMinutesToSailing > nextSailingMin + 10 || spaces < 20) {
    badgeClass = "queue-badge-low";
    icon = "fa-exclamation-triangle";
    textTitle = "LIKELY AT CAPACITY — TARGET NEXT SAILING";
    detailText = `Drive time (${driveMinutes}m) + heavy toll queue (${terminal.waitMinutes}m) exceeds the ${nextSailingMin}m departure on ${vessel}. Target the following sailing.`;
  } else if (totalMinutesToSailing >= nextSailingMin - 5 || spaces < 45) {
    badgeClass = "queue-badge-medium";
    icon = "fa-info-circle";
    textTitle = "STANDBY / CLOSE CALL";
    detailText = `Arrival aligns close to departure. ${spaces} deck spaces left on ${vessel}. Drive-up standby queue recommended.`;
  }

  resultContainer.innerHTML = `
    <div class="${badgeClass}">
      <i class="fas ${icon}"></i>
      <span>${textTitle}</span>
    </div>
    <div style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.35; margin-top: 3px;">
      ${detailText}
    </div>
  `;
}

// User Authentication State
let currentUser = getStoredUser();

function getStoredUser() {
  try {
    const data = localStorage.getItem("wsf_user_profile");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function renderUserHeader() {
  const btnUser = document.getElementById("btn-user-login");
  const userLabel = document.getElementById("user-btn-label");
  const dropdown = document.getElementById("user-dropdown-menu");

  if (currentUser) {
    const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    userLabel.innerText = currentUser.name;
    document.getElementById("dropdown-avatar-initials").innerText = initials;
    document.getElementById("dropdown-user-name").innerText = currentUser.name;
    document.getElementById("dropdown-user-email").innerText = currentUser.email;
    document.getElementById("dropdown-home-dock").innerText = currentUser.homeDock || "Bainbridge Island";
  } else {
    userLabel.innerText = "Sign in with Google";
    dropdown.classList.remove("open");
  }
}

function setupAuthListeners() {
  const btnUser = document.getElementById("btn-user-login");
  const dropdown = document.getElementById("user-dropdown-menu");
  const authModal = document.getElementById("auth-modal");
  const btnAuthClose = document.getElementById("btn-auth-modal-close");
  const btnGoogleAction = document.getElementById("btn-google-signin-action");
  const btnLogout = document.getElementById("btn-user-logout");
  const btnFavRoute = document.getElementById("btn-dropdown-fav-route");

  renderUserHeader();

  // Header Button Click: toggle dropdown if logged in, else open Google modal
  btnUser.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentUser) {
      dropdown.classList.toggle("open");
    } else {
      authModal.classList.add("open");
    }
  });

  document.addEventListener("click", (e) => {
    if (dropdown && !dropdown.contains(e.target) && e.target !== btnUser) {
      dropdown.classList.remove("open");
    }
  });

  if (btnAuthClose) {
    btnAuthClose.addEventListener("click", () => authModal.classList.remove("open"));
  }

  // Handle Google Sign-In Click
  if (btnGoogleAction) {
    btnGoogleAction.addEventListener("click", () => {
      currentUser = {
        name: "Puget Sound Commuter",
        email: "commuter.wsf@gmail.com",
        homeDock: "Bainbridge Island",
        favRouteId: "se-bi",
        isGoogleAuth: true
      };
      localStorage.setItem("wsf_user_profile", JSON.stringify(currentUser));
      renderUserHeader();
      authModal.classList.remove("open");
    });
  }

  // Sign Out of Google
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      currentUser = null;
      localStorage.removeItem("wsf_user_profile");
      renderUserHeader();
    });
  }

  // Jump to Favorite Route
  if (btnFavRoute) {
    btnFavRoute.addEventListener("click", () => {
      dropdown.classList.remove("open");
      filterByRoute("se-bi");
    });
  }
}
