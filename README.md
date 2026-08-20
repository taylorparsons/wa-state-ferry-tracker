# 🚢 Washington State Ferries (WSF) Live Marine Radar & Queue Tracker

> **Real-time Puget Sound ferry fleet tracking, WSDOT terminal drive-up queue prediction, live traffic camera feeds, and vessel wind telemetry.**

Live Production Application: **[https://wsf-ferry-tracker-836866838279.us-east1.run.app](https://wsf-ferry-tracker-836866838279.us-east1.run.app)**

---

## ✨ Key Features

- 🗺️ **Interactive Puget Sound Radar Map**: Leaflet.js-based marine map with CartoDB Dark Matter & Voyager Light tile rendering.
- 🔮 **"Will I Make the Next Ferry?" Queue Predictor**: Real-time calculator analyzing toll plaza queues, drive ETAs, and open deck space to predict whether you will board the upcoming sailing or need standby.
- 📹 **Real WSDOT Public Cameras**: Direct live terminal holding lane streams with cache-busting timestamp updates.
- 💨 **Live Vessel Wind Telemetry**: Real-time wind speed and direction badges on vessel map pins and telemetry cards (`💨 12 kts NW`).
- ☀️ **Light / Dark Mode Theme Switcher**: One-click theme toggle with stored preference in `localStorage`.
- 🔓 **100% Free Public Access + Google Sign-In**: Single Sign-On powered by Google Identity Services with home dock profile sync.
- 🧠 **Persistent View Memory**: Automatically saves and restores map coordinates, active route filters, and open popups.

---

## 🔑 How to Get Your Free WSDOT API Key

The application works out-of-the-box in simulation mode with full telemetry. To enable **direct, real-time polling directly from Washington State Department of Transportation (WSDOT) servers**:

### Step-by-Step WSDOT API Registration:

1. **Visit the WSDOT Developer Portal**:
   Go to the official WSDOT Traveler Information API page:
   👉 **[https://wsdot.wa.gov/traffic/api/](https://wsdot.wa.gov/traffic/api/)**

2. **Request an Access Code**:
   - Click **"Request an API Access Code"** (or [Direct Request Form](https://wsdot.wa.gov/traffic/api/request.aspx)).
   - Fill in your name, email address, and application name (e.g. `WA State Ferry Tracker`).
   - WSDOT API access is **100% free** for public and developer use.

3. **Check Your Email**:
   - WSDOT will immediately email you a unique 36-character **Access Code API Key** (GUID format: `xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

4. **Activate in the App**:
   - Open the web app (**[http://localhost:8001](http://localhost:8001)** or **[https://wsf-ferry-tracker-836866838279.us-east1.run.app](https://wsf-ferry-tracker-836866838279.us-east1.run.app)**).
   - Click the **`WSDOT API`** key button in the top navigation bar.
   - Paste your Access Code and click **`Save & Enable Direct Polling`**.
   - Your key is securely saved in your browser's `localStorage`!

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Python 3.9+ or Docker

### Running Locally

```bash
# Clone the repository
git clone https://github.com/taylorparsons/wa-state-ferry-tracker.git
cd wa-state-ferry-tracker

# Start the local development web server
python3 -m http.server 8001
```

Open **[http://localhost:8001](http://localhost:8001)** in your browser.

---

## 🐳 Docker & Cloud Run Deployment

### Run with Docker

```bash
# Build the container image
docker build -t wsf-ferry-tracker .

# Run the container
docker run -d -p 8080:8080 wsf-ferry-tracker
```

### Deploy to Google Cloud Run

```bash
gcloud run deploy wsf-ferry-tracker \
  --source . \
  --region us-east1 \
  --allow-unauthenticated
```

---

## 📄 License

Distributed under the MIT License. Free for public commuter use.
