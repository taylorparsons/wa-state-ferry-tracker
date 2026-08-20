// Washington State Ferries (WSF) Data & Waypoints

const WSF_DATA = {
  terminals: [
    { id: 1, name: "Seattle (Colman Dock)", shortName: "Seattle", lat: 47.6025, lng: -122.3385, city: "Seattle", drivesAvailable: 120, totalSpaces: 200, waitMinutes: 15, nextSailingMin: 18, sailingVessel: "M/V Tacoma", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Seattle Colman Dock Holding Lanes & Terminal Approach", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 2, name: "Bainbridge Island", shortName: "Bainbridge", lat: 47.6235, lng: -122.5110, city: "Bainbridge Island", drivesAvailable: 45, totalSpaces: 180, waitMinutes: 30, nextSailingMin: 12, sailingVessel: "M/V Wenatchee", status: "busy", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Bainbridge Island Terminal Toll Plaza & Holding Lanes", officialCamUrl: "https://wsdot.com/travel/real-time/ferries?route=se-bi" },
    { id: 3, name: "Edmonds", shortName: "Edmonds", lat: 47.8130, lng: -122.3835, city: "Edmonds", drivesAvailable: 80, totalSpaces: 160, waitMinutes: 20, nextSailingMin: 22, sailingVessel: "M/V Puyallup", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Edmonds Ferry Terminal Dock Approach Cam", officialCamUrl: "https://wsdot.com/travel/real-time/ferries?route=ed-ki" },
    { id: 4, name: "Kingston", shortName: "Kingston", lat: 47.7945, lng: -122.5020, city: "Kingston", drivesAvailable: 30, totalSpaces: 150, waitMinutes: 45, nextSailingMin: 15, sailingVessel: "M/V Spokane", status: "delayed", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Kingston Terminal Vehicle Holding Queue", officialCamUrl: "https://wsdot.com/travel/real-time/ferries?route=ed-ki" },
    { id: 5, name: "Mukilteo", shortName: "Mukilteo", lat: 47.9500, lng: -122.3045, city: "Mukilteo", drivesAvailable: 95, totalSpaces: 140, waitMinutes: 10, nextSailingMin: 10, sailingVessel: "M/V Suquamish", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Mukilteo Ferry Terminal Landing Dock Cam", officialCamUrl: "https://wsdot.com/travel/real-time/ferries?route=mu-cl" },
    { id: 6, name: "Clinton", shortName: "Clinton", lat: 47.9745, lng: -122.3505, city: "Whidbey Island", drivesAvailable: 110, totalSpaces: 140, waitMinutes: 10, nextSailingMin: 25, sailingVessel: "M/V Tokitae", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Clinton Terminal Vehicle Queue Cam", officialCamUrl: "https://wsdot.com/travel/real-time/ferries?route=mu-cl" },
    { id: 7, name: "Fauntleroy (West Seattle)", shortName: "Fauntleroy", lat: 47.5230, lng: -122.3925, city: "Seattle", drivesAvailable: 25, totalSpaces: 120, waitMinutes: 40, nextSailingMin: 14, sailingVessel: "M/V Cathlamet", status: "busy", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Fauntleroy Terminal Queue Cam 1", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 8, name: "Vashon Island", shortName: "Vashon", lat: 47.5105, lng: -122.4635, city: "Vashon", drivesAvailable: 60, totalSpaces: 120, waitMinutes: 15, nextSailingMin: 20, sailingVessel: "M/V Kitsap", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Vashon Heights Terminal Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 9, name: "Southworth", shortName: "Southworth", lat: 47.5130, lng: -122.5050, city: "Port Orchard", drivesAvailable: 70, totalSpaces: 110, waitMinutes: 15, nextSailingMin: 30, sailingVessel: "M/V Issaquah", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Southworth Ferry Dock Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 10, name: "Anacortes", shortName: "Anacortes", lat: 48.5075, lng: -122.6780, city: "Anacortes", drivesAvailable: 140, totalSpaces: 220, waitMinutes: 25, nextSailingMin: 35, sailingVessel: "M/V Samish", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Anacortes San Juan Ferry Dock Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 11, name: "Friday Harbor (San Juan)", shortName: "Friday Harbor", lat: 48.5355, lng: -123.0135, city: "San Juan Island", drivesAvailable: 50, totalSpaces: 130, waitMinutes: 35, nextSailingMin: 40, sailingVessel: "M/V Chelan", status: "busy", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Friday Harbor Ferry Landing Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 12, name: "Orcas Island", shortName: "Orcas", lat: 48.5975, lng: -122.9435, city: "Orcas Island", drivesAvailable: 40, totalSpaces: 110, waitMinutes: 20, nextSailingMin: 28, sailingVessel: "M/V Yakama", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Orcas Island Terminal Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 13, name: "Point Defiance", shortName: "Pt Defiance", lat: 47.3060, lng: -122.5135, city: "Tacoma", drivesAvailable: 35, totalSpaces: 80, waitMinutes: 15, nextSailingMin: 16, sailingVessel: "M/V Chetzemoka", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Point Defiance Ferry Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" },
    { id: 14, name: "Tahlequah", shortName: "Tahlequah", lat: 47.3325, lng: -122.5080, city: "Vashon Island", drivesAvailable: 40, totalSpaces: 80, waitMinutes: 10, nextSailingMin: 18, sailingVessel: "M/V Chetzemoka", status: "normal", cameraUrl: "https://images.wsdot.wa.gov/nw/005vc16939.jpg", cameraTitle: "Tahlequah Dock Cam", officialCamUrl: "https://wsdot.com/travel/real-time-map/?hotspot=ferries" }
  ],

  routes: [
    {
      id: "sea-bain",
      name: "Seattle / Bainbridge Island",
      color: "#00B4D8",
      terminals: [1, 2],
      distanceMiles: 8.6,
      travelTimeMin: 35,
      waypoints: [
        [47.6025, -122.3385],
        [47.6040, -122.3600],
        [47.6110, -122.4100],
        [47.6180, -122.4700],
        [47.6235, -122.5110]
      ]
    },
    {
      id: "edm-king",
      name: "Edmonds / Kingston",
      color: "#7209B7",
      terminals: [3, 4],
      distanceMiles: 7.4,
      travelTimeMin: 30,
      waypoints: [
        [47.8130, -122.3835],
        [47.8110, -122.4200],
        [47.8050, -122.4600],
        [47.7945, -122.5020]
      ]
    },
    {
      id: "muk-clin",
      name: "Mukilteo / Clinton",
      color: "#4CC9F0",
      terminals: [5, 6],
      distanceMiles: 3.3,
      travelTimeMin: 20,
      waypoints: [
        [47.9500, -122.3045],
        [47.9610, -122.3250],
        [47.9745, -122.3505]
      ]
    },
    {
      id: "fau-vas-sou",
      name: "Fauntleroy / Vashon / Southworth",
      color: "#F72585",
      terminals: [7, 8, 9],
      distanceMiles: 6.2,
      travelTimeMin: 40,
      waypoints: [
        [47.5230, -122.3925],
        [47.5150, -122.4250],
        [47.5105, -122.4635],
        [47.5130, -122.5050]
      ]
    },
    {
      id: "ana-sj",
      name: "Anacortes / San Juan Islands",
      color: "#4361EE",
      terminals: [10, 12, 11],
      distanceMiles: 20.1,
      travelTimeMin: 65,
      waypoints: [
        [48.5075, -122.6780],
        [48.5350, -122.7500],
        [48.5800, -122.8500],
        [48.5975, -122.9435],
        [48.5600, -122.9800],
        [48.5355, -123.0135]
      ]
    },
    {
      id: "ptdef-tah",
      name: "Point Defiance / Tahlequah",
      color: "#3A0CA3",
      terminals: [13, 14],
      distanceMiles: 1.7,
      travelTimeMin: 15,
      waypoints: [
        [47.3060, -122.5135],
        [47.3180, -122.5100],
        [47.3325, -122.5080]
      ]
    }
  ],

  vessels: [
    {
      id: 101,
      name: "M/V Tacoma",
      class: "Jumbo Mark II",
      yearBuilt: 1997,
      autoCapacity: 202,
      passengerCapacity: 2500,
      lengthFt: 460,
      speedKnots: 16.4,
      windSpeedKnots: 12,
      windDirection: "NW",
      routeId: "sea-bain",
      fromTerminal: "Seattle (Colman Dock)",
      toTerminal: "Bainbridge Island",
      progress: 0.65, // 0.0 to 1.0 along route waypoints
      direction: 1, // 1 forward, -1 reverse
      status: "In Transit",
      lastUpdated: "Just now"
    },
    {
      id: 102,
      name: "M/V Wenatchee",
      class: "Jumbo Mark II",
      yearBuilt: 1998,
      autoCapacity: 202,
      passengerCapacity: 2500,
      lengthFt: 460,
      speedKnots: 15.8,
      windSpeedKnots: 11,
      windDirection: "NW",
      routeId: "sea-bain",
      fromTerminal: "Bainbridge Island",
      toTerminal: "Seattle (Colman Dock)",
      progress: 0.25,
      direction: -1,
      status: "In Transit",
      lastUpdated: "1 min ago"
    },
    {
      id: 103,
      name: "M/V Puyallup",
      class: "Jumbo Mark II",
      yearBuilt: 1999,
      autoCapacity: 202,
      passengerCapacity: 2500,
      lengthFt: 460,
      speedKnots: 16.1,
      windSpeedKnots: 15,
      windDirection: "WNW",
      routeId: "edm-king",
      fromTerminal: "Edmonds",
      toTerminal: "Kingston",
      progress: 0.80,
      direction: 1,
      status: "Approaching Terminal",
      lastUpdated: "Just now"
    },
    {
      id: 104,
      name: "M/V Spokane",
      class: "Jumbo",
      yearBuilt: 1972,
      autoCapacity: 188,
      passengerCapacity: 2000,
      lengthFt: 440,
      speedKnots: 14.5,
      windSpeedKnots: 14,
      windDirection: "WNW",
      routeId: "edm-king",
      fromTerminal: "Kingston",
      toTerminal: "Edmonds",
      progress: 0.40,
      direction: -1,
      status: "In Transit",
      lastUpdated: "2 mins ago"
    },
    {
      id: 105,
      name: "M/V Suquamish",
      class: "Olympic",
      yearBuilt: 2018,
      autoCapacity: 144,
      passengerCapacity: 1500,
      lengthFt: 362,
      speedKnots: 15.2,
      windSpeedKnots: 9,
      windDirection: "W",
      routeId: "muk-clin",
      fromTerminal: "Mukilteo",
      toTerminal: "Clinton",
      progress: 0.50,
      direction: 1,
      status: "In Transit",
      lastUpdated: "Just now"
    },
    {
      id: 106,
      name: "M/V Tokitae",
      class: "Olympic",
      yearBuilt: 2014,
      autoCapacity: 144,
      passengerCapacity: 1500,
      lengthFt: 362,
      speedKnots: 15.0,
      windSpeedKnots: 10,
      windDirection: "W",
      routeId: "muk-clin",
      fromTerminal: "Clinton",
      toTerminal: "Mukilteo",
      progress: 0.10,
      direction: -1,
      status: "Departed Terminal",
      lastUpdated: "Just now"
    },
    {
      id: 107,
      name: "M/V Cathlamet",
      class: "Issaquah",
      yearBuilt: 1981,
      autoCapacity: 124,
      passengerCapacity: 1200,
      lengthFt: 328,
      speedKnots: 13.8,
      windSpeedKnots: 13,
      windDirection: "SSW",
      routeId: "fau-vas-sou",
      fromTerminal: "Fauntleroy",
      toTerminal: "Vashon Island",
      progress: 0.35,
      direction: 1,
      status: "In Transit",
      lastUpdated: "3 mins ago"
    },
    {
      id: 108,
      name: "M/V Samish",
      class: "Olympic",
      yearBuilt: 2015,
      autoCapacity: 144,
      passengerCapacity: 1500,
      lengthFt: 362,
      speedKnots: 16.5,
      windSpeedKnots: 18,
      windDirection: "SW",
      routeId: "ana-sj",
      fromTerminal: "Anacortes",
      toTerminal: "Friday Harbor",
      progress: 0.60,
      direction: 1,
      status: "In Transit",
      lastUpdated: "Just now"
    },
    {
      id: 109,
      name: "M/V Chelan",
      class: "Issaquah",
      yearBuilt: 1981,
      autoCapacity: 124,
      passengerCapacity: 1200,
      lengthFt: 328,
      speedKnots: 14.1,
      windSpeedKnots: 17,
      windDirection: "SW",
      routeId: "ana-sj",
      fromTerminal: "Orcas Island",
      toTerminal: "Anacortes",
      progress: 0.30,
      direction: -1,
      status: "In Transit",
      lastUpdated: "1 min ago"
    },
    {
      id: 110,
      name: "M/V Chetzemoka",
      class: "Kwa-di-Tabil",
      yearBuilt: 2010,
      autoCapacity: 64,
      passengerCapacity: 750,
      lengthFt: 274,
      speedKnots: 12.5,
      routeId: "ptdef-tah",
      fromTerminal: "Point Defiance",
      toTerminal: "Tahlequah",
      progress: 0.70,
      direction: 1,
      status: "In Transit",
      lastUpdated: "Just now"
    }
  ],

  alerts: [
    {
      id: 1,
      severity: "warning",
      route: "Seattle / Bainbridge",
      title: "Heavy Travel Alert",
      message: "Expect 30-45 minute vehicle wait times at Colman Dock during peak commute hours."
    },
    {
      id: 2,
      severity: "info",
      route: "Edmonds / Kingston",
      title: "Normal Service",
      message: "Both M/V Puyallup and M/V Spokane are operating on schedule."
    },
    {
      id: 3,
      severity: "notice",
      route: "Anacortes / San Juan Islands",
      title: "Reservation Reminder",
      message: "Vehicle reservations are strongly recommended for weekend sailings to Friday Harbor."
    }
  ],

  weather: {
    location: "Puget Sound Waters",
    tempF: 62,
    condition: "Partly Cloudy",
    windSpeedMph: 11,
    windDirection: "NW",
    waveHeightFt: "1-2 ft",
    waterTempF: 52,
    tideStage: "Rising (High Tide at 11:42 PM)"
  }
};
