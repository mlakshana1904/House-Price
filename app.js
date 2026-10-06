// sqV (Square Value) - AI Real Estate Price Prediction & Market Intelligence Platform
const { useState, useEffect, useRef, useMemo } = React;

// --- DYNAMIC INDIAN REAL ESTATE BENCHMARK DATASET ---
const INDIAN_LOCATIONS = {
  "Maharashtra": {
    "Mumbai": [
      { name: "Bandra West", baseRate: 42000, tier: "Luxury Prime", demandIndex: 96, growthRate: 11.2 },
      { name: "Worli", baseRate: 46500, tier: "Luxury Prime", demandIndex: 98, growthRate: 12.8 },
      { name: "Andheri West", baseRate: 24500, tier: "High Growth", demandIndex: 92, growthRate: 9.5 },
      { name: "Powai", baseRate: 21800, tier: "Mid Tier", demandIndex: 88, growthRate: 8.7 },
      { name: "Juhu", baseRate: 44000, tier: "Luxury Prime", demandIndex: 95, growthRate: 10.5 },
      { name: "Thane West", baseRate: 13500, tier: "High Growth", demandIndex: 89, growthRate: 10.2 },
      { name: "Navi Mumbai (Vashi)", baseRate: 12800, tier: "Mid Tier", demandIndex: 84, growthRate: 9.0 }
    ],
    "Pune": [
      { name: "Baner", baseRate: 9800, tier: "High Growth", demandIndex: 91, growthRate: 11.5 },
      { name: "Wakad", baseRate: 8400, tier: "Mid Tier", demandIndex: 86, growthRate: 9.8 },
      { name: "Kharadi", baseRate: 9500, tier: "High Growth", demandIndex: 94, growthRate: 12.1 },
      { name: "Viman Nagar", baseRate: 11800, tier: "Luxury Prime", demandIndex: 90, growthRate: 10.4 },
      { name: "Kothrud", baseRate: 12900, tier: "Luxury Prime", demandIndex: 87, growthRate: 8.5 }
    ]
  },
  "Karnataka": {
    "Bengaluru": [
      { name: "Whitefield", baseRate: 8900, tier: "High Growth", demandIndex: 95, growthRate: 13.2 },
      { name: "Indiranagar", baseRate: 18500, tier: "Luxury Prime", demandIndex: 97, growthRate: 10.8 },
      { name: "HSR Layout", baseRate: 12400, tier: "High Growth", demandIndex: 94, growthRate: 12.0 },
      { name: "Koramangala", baseRate: 16200, tier: "Luxury Prime", demandIndex: 96, growthRate: 11.0 },
      { name: "Electronic City", baseRate: 6500, tier: "Budget Prime", demandIndex: 85, growthRate: 8.4 },
      { name: "Yelahanka", baseRate: 7400, tier: "High Growth", demandIndex: 88, growthRate: 11.4 }
    ]
  },
  "Delhi-NCR": {
    "Gurgaon": [
      { name: "Golf Course Road", baseRate: 24500, tier: "Luxury Prime", demandIndex: 98, growthRate: 14.5 },
      { name: "DLF Phase 5", baseRate: 22000, tier: "Luxury Prime", demandIndex: 96, growthRate: 13.2 },
      { name: "Cyber City Sector 24", baseRate: 18800, tier: "High Growth", demandIndex: 94, growthRate: 12.0 },
      { name: "Sohna Road", baseRate: 9200, tier: "Mid Tier", demandIndex: 87, growthRate: 9.6 }
    ],
    "Delhi": [
      { name: "Connaught Place", baseRate: 36000, tier: "Luxury Prime", demandIndex: 95, growthRate: 7.8 },
      { name: "Vasant Vihar", baseRate: 32000, tier: "Luxury Prime", demandIndex: 94, growthRate: 8.5 },
      { name: "Dwarka Sector 12", baseRate: 11500, tier: "Mid Tier", demandIndex: 89, growthRate: 9.2 }
    ],
    "Noida": [
      { name: "Sector 150 Noida", baseRate: 8600, tier: "High Growth", demandIndex: 92, growthRate: 13.8 },
      { name: "Sector 62 Noida", baseRate: 7800, tier: "Mid Tier", demandIndex: 86, growthRate: 9.5 },
      { name: "Greater Noida West", baseRate: 5400, tier: "Budget Prime", demandIndex: 88, growthRate: 11.0 }
    ]
  },
  "Telangana": {
    "Hyderabad": [
      { name: "Gachibowli", baseRate: 9800, tier: "High Growth", demandIndex: 97, growthRate: 14.2 },
      { name: "HITEC City", baseRate: 11500, tier: "High Growth", demandIndex: 98, growthRate: 15.0 },
      { name: "Jubilee Hills", baseRate: 21500, tier: "Luxury Prime", demandIndex: 96, growthRate: 11.8 },
      { name: "Kondapur", baseRate: 8700, tier: "High Growth", demandIndex: 93, growthRate: 13.0 },
      { name: "Tellapur", baseRate: 7200, tier: "High Growth", demandIndex: 90, growthRate: 13.5 }
    ]
  },
  "Tamil Nadu": {
    "Chennai": [
      { name: "Anna Nagar", baseRate: 14800, tier: "Luxury Prime", demandIndex: 93, growthRate: 9.2 },
      { name: "Adyar", baseRate: 16900, tier: "Luxury Prime", demandIndex: 94, growthRate: 9.8 },
      { name: "OMR IT Corridor", baseRate: 7400, tier: "High Growth", demandIndex: 91, growthRate: 11.2 },
      { name: "Velachery", baseRate: 9100, tier: "Mid Tier", demandIndex: 88, growthRate: 9.5 }
    ]
  },
  "West Bengal": {
    "Kolkata": [
      { name: "Salt Lake Sector 5", baseRate: 8700, tier: "High Growth", demandIndex: 90, growthRate: 10.4 },
      { name: "New Town", baseRate: 6900, tier: "High Growth", demandIndex: 92, growthRate: 11.8 },
      { name: "Park Street", baseRate: 14500, tier: "Luxury Prime", demandIndex: 91, growthRate: 8.0 },
      { name: "Ballygunge", baseRate: 13400, tier: "Luxury Prime", demandIndex: 89, growthRate: 8.5 }
    ]
  },
  "Gujarat": {
    "Ahmedabad": [
      { name: "Bodakdev", baseRate: 8400, tier: "Luxury Prime", demandIndex: 91, growthRate: 10.6 },
      { name: "Satellite", baseRate: 7600, tier: "High Growth", demandIndex: 89, growthRate: 9.8 },
      { name: "SG Highway", baseRate: 6600, tier: "High Growth", demandIndex: 93, growthRate: 12.2 }
    ],
    "Surat": [
      { name: "Vesu", baseRate: 7100, tier: "High Growth", demandIndex: 92, growthRate: 11.5 },
      { name: "Adajan", baseRate: 5800, tier: "Mid Tier", demandIndex: 86, growthRate: 9.2 }
    ]
  }
};

const AMENITIES_LIST = [
  { id: "gated", label: "Gated Community", bonus: 2.5 },
  { id: "security", label: "24/7 Security & CCTV", bonus: 2.0 },
  { id: "elevator", label: "High-Speed Elevator", bonus: 2.0 },
  { id: "pool", label: "Swimming Pool", bonus: 3.0 },
  { id: "gym", label: "Modern Gym", bonus: 2.5 },
  { id: "clubhouse", label: "Clubhouse", bonus: 2.5 },
  { id: "power", label: "100% Power Backup", bonus: 2.0 },
  { id: "ev", label: "EV Charging Station", bonus: 1.8 },
  { id: "park", label: "Private Park / Garden", bonus: 2.2 },
  { id: "smart", label: "Smart Home Automation", bonus: 3.5 },
  { id: "sports", label: "Sports Courts (Tennis/Squash)", bonus: 2.0 }
];

// --- HELPER FUNCTIONS ---
function formatRupee(amount) {
  if (!amount || isNaN(amount)) return "₹ 0";
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹ ${cr} Cr`;
  } else if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2);
    return `₹ ${lakh} Lakhs`;
  }
  return `₹ ${Math.round(amount).toLocaleString('en-IN')}`;
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgClass = type === "success" 
    ? "bg-emerald-500/90 border-emerald-400 text-slate-950" 
    : type === "warning" 
    ? "bg-amber-500/90 border-amber-400 text-slate-950" 
    : "bg-indigo-600/90 border-indigo-400 text-white";

  toast.className = `toast ${bgClass} border backdrop-blur-md flex items-center justify-between font-sans`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="font-bold">${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// --- ICON COMPONENT (SVG Collection) ---
function Icon({ name, className = "w-5 h-5", size = 20 }) {
  const iconPaths = {
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></>,
    mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    shield: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>,
    cpu: <><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></>,
    calculator: <><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></>,
    fileText: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
    trash: <><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M18.66 4.93l-1.41 1.41"/></>,
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    sparkles: <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/>,
    trendingUp: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    barChart: <><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></>,
    print: <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {iconPaths[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
}

// --- VALUATION PREDICTOR CALCULATION LOGIC ---
function calculateValuation(inputs) {
  const {
    state, city, localityObj, area, bhk, bathrooms, balconies, parking,
    floor, totalFloors, age, furnishing, selectedAmenities, proximity
  } = inputs;

  const baseRate = localityObj ? localityObj.baseRate : 10000;
  
  // BHK Factor
  const bhkMultipliers = { 1: 1.0, 2: 1.05, 3: 1.10, 4: 1.18, 5: 1.25 };
  const bhkFactor = bhkMultipliers[bhk] || 1.10;

  // Floor Rise Factor
  const floorRatio = totalFloors > 0 ? (floor / totalFloors) : 0.1;
  const floorBonus = floorRatio * 0.08; // up to +8% bonus for high floors

  // Age Depreciation
  let ageDepreciation = 0;
  if (age <= 2) ageDepreciation = +0.03; // new construction premium
  else if (age <= 5) ageDepreciation = 0;
  else if (age <= 10) ageDepreciation = -0.06;
  else if (age <= 20) ageDepreciation = -0.12;
  else ageDepreciation = -0.20;

  // Furnishing Markup
  const furnishingMarkup = furnishing === "Fully Furnished" ? 0.12 : furnishing === "Semi-Furnished" ? 0.06 : 0;

  // Amenities Bonus
  let amenitiesPercent = 0;
  selectedAmenities.forEach(item => {
    const found = AMENITIES_LIST.find(a => a.id === item);
    if (found) amenitiesPercent += found.bonus;
  });
  const amenitiesFactor = amenitiesPercent / 100;

  // Proximity Impact
  let proximityScore = 100;
  if (proximity.metro > 5) proximityScore -= 15;
  if (proximity.highway > 5) proximityScore -= 10;
  if (proximity.hospital > 6) proximityScore -= 10;
  if (proximity.school > 5) proximityScore -= 5;
  const proximityFactor = (proximityScore - 100) / 200; // range around -0.05 to +0.02

  // Total Rate per Sq. Ft.
  let calculatedRate = baseRate * bhkFactor * (1 + floorBonus + ageDepreciation + furnishingMarkup + amenitiesFactor + proximityFactor);
  
  // Add extra bathroom & balcony bonus
  const extraBathBonus = Math.max(0, bathrooms - bhk) * 0.02 * baseRate;
  const balconyBonus = balconies * 0.01 * baseRate;
  calculatedRate += extraBathBonus + balconyBonus;

  const totalCalculated = Math.round(area * calculatedRate + (parking * 350000));
  const pricePerSqFt = Math.round(totalCalculated / area);

  // Confidence Score & Sub-scores
  const confidenceScore = Math.min(98.8, Math.max(91.5, 95 + (selectedAmenities.length * 0.3) - (age * 0.1))).toFixed(1);
  const locationScore = Math.min(99, Math.round(localityObj.demandIndex));
  const connectivityScore = Math.min(98, Math.max(60, 100 - (proximity.metro * 4 + proximity.highway * 3)));
  const amenitiesIndex = Math.min(100, Math.round((selectedAmenities.length / AMENITIES_LIST.length) * 100));

  // Investment Star Rating
  let rating = 4;
  if (localityObj.growthRate > 12 && localityObj.demandIndex >= 92) rating = 5;
  else if (localityObj.growthRate < 9) rating = 3;

  // Price Stack Breakdown
  const baseLandVal = Math.round(totalCalculated * 0.58);
  const constructionVal = Math.round(totalCalculated * 0.24);
  const floorRiseVal = Math.round(totalCalculated * Math.max(0.02, floorBonus));
  const amenityVal = Math.round(totalCalculated - baseLandVal - constructionVal - floorRiseVal);

  return {
    totalPrice: totalCalculated,
    minPrice: Math.round(totalCalculated * 0.94),
    maxPrice: Math.round(totalCalculated * 1.06),
    pricePerSqFt,
    confidenceScore,
    locationScore,
    connectivityScore,
    amenitiesIndex,
    category: localityObj.tier,
    rating,
    roiTrend: localityObj.growthRate,
    breakdown: {
      land: baseLandVal,
      construction: constructionVal,
      floorRise: floorRiseVal,
      amenities: amenityVal
    },
    featureWeights: [
      { label: "Location & Locality Demand", weight: 36, color: "#6366f1" },
      { label: "Built-up Carpet Area", weight: 28, color: "#10b981" },
      { label: "BHK Layout & Bathrooms", weight: 15, color: "#8b5cf6" },
      { label: "Amenities & Smart Upgrades", weight: 12, color: "#f59e0b" },
      { label: "Metro & Highway Proximity", weight: 9, color: "#06b6d4" }
    ]
  };
}

// --- MAIN SQV APPLICATION COMPONENT ---
function SqvApp() {
  // App Global State
  const [theme, setTheme] = useState(() => localStorage.getItem("sqv_theme") || "dark");
  const [activeTab, setActiveTab] = useState("predictor");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("sqv_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authModal, setAuthModal] = useState(null); // 'signin' | 'signup' | null
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("sqv_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [certificateModal, setCertificateModal] = useState(null);

  // Predictor Form State
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedLocalityName, setSelectedLocalityName] = useState("Bandra West");
  
  const [areaSqFt, setAreaSqFt] = useState(1250);
  const [bhk, setBhk] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [balconies, setBalconies] = useState(2);
  const [parking, setParking] = useState(1);
  const [floor, setFloor] = useState(8);
  const [totalFloors, setTotalFloors] = useState(20);
  const [age, setAge] = useState(2);
  const [furnishing, setFurnishing] = useState("Semi-Furnished");
  const [selectedAmenities, setSelectedAmenities] = useState(["gated", "security", "elevator", "gym", "power"]);
  
  const [proximity, setProximity] = useState({
    metro: 1.2,
    highway: 2.5,
    school: 1.0,
    hospital: 2.0,
    mall: 1.5
  });

  const [isCalculating, setIsCalculating] = useState(false);

  // Synchronize Theme Class
  useEffect(() => {
    document.body.className = `${theme} transition-colors duration-300 min-h-screen`;
    localStorage.setItem("sqv_theme", theme);
  }, [theme]);

  // Handle Dynamic Location Cascades
  const availableCities = useMemo(() => {
    return Object.keys(INDIAN_LOCATIONS[selectedState] || {});
  }, [selectedState]);

  useEffect(() => {
    if (!availableCities.includes(selectedCity)) {
      const firstCity = availableCities[0] || "";
      setSelectedCity(firstCity);
    }
  }, [selectedState, availableCities]);

  const availableLocalities = useMemo(() => {
    return (INDIAN_LOCATIONS[selectedState] && INDIAN_LOCATIONS[selectedState][selectedCity]) || [];
  }, [selectedState, selectedCity]);

  useEffect(() => {
    if (availableLocalities.length > 0) {
      const exists = availableLocalities.some(l => l.name === selectedLocalityName);
      if (!exists) {
        setSelectedLocalityName(availableLocalities[0].name);
      }
    }
  }, [selectedCity, availableLocalities]);

  const currentLocalityObj = useMemo(() => {
    return availableLocalities.find(l => l.name === selectedLocalityName) || availableLocalities[0] || { name: "Locality", baseRate: 10000, tier: "Mid Tier", demandIndex: 85, growthRate: 10.0 };
  }, [availableLocalities, selectedLocalityName]);

  // Current Valuation Estimate
  const valuationResult = useMemo(() => {
    return calculateValuation({
      state: selectedState,
      city: selectedCity,
      localityObj: currentLocalityObj,
      area: areaSqFt,
      bhk, bathrooms, balconies, parking,
      floor, totalFloors, age, furnishing,
      selectedAmenities, proximity
    });
  }, [
    selectedState, selectedCity, currentLocalityObj, areaSqFt, bhk, bathrooms,
    balconies, parking, floor, totalFloors, age, furnishing, selectedAmenities, proximity
  ]);

  // Trigger smooth calculation state on major changes
  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      showToast("AI Property Valuation updated dynamically!");
    }, 400);
  };

  // Save Estimate to History
  const saveEstimate = () => {
    const newEntry = {
      id: "sqV-" + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      state: selectedState,
      city: selectedCity,
      locality: selectedLocalityName,
      area: areaSqFt,
      bhk,
      floor: `${floor}/${totalFloors}`,
      predictedPrice: valuationResult.totalPrice,
      pricePerSqFt: valuationResult.pricePerSqFt,
      confidence: valuationResult.confidenceScore,
      rating: valuationResult.rating,
      details: { ...valuationResult, localityObj: currentLocalityObj, inputs: { areaSqFt, bhk, bathrooms, balconies, floor, totalFloors, age, furnishing } }
    };

    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem("sqv_history", JSON.stringify(updated));
    showToast("Valuation estimate saved to History!");
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("sqv_history", JSON.stringify(updated));
    showToast("History item deleted", "warning");
  };

  // Toggle Amenity Selection
  const toggleAmenity = (id) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  // Login / Auth Handlers
  const handleSignIn = (e, email, password) => {
    e.preventDefault();
    const mockUser = {
      name: email.split("@")[0] || "User",
      email,
      role: "Property Investor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };
    setUser(mockUser);
    localStorage.setItem("sqv_user", JSON.stringify(mockUser));
    setAuthModal(null);
    showToast(`Welcome back, ${mockUser.name}!`);
  };

  const handleSignUp = (e, name, email, role) => {
    e.preventDefault();
    const mockUser = {
      name: name || "User",
      email,
      role: role || "Homebuyer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    };
    setUser(mockUser);
    localStorage.setItem("sqv_user", JSON.stringify(mockUser));
    setAuthModal(null);
    showToast("Account created successfully!");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("sqv_user");
    showToast("Logged out successfully", "info");
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* --- HEADER NAVIGATION --- */}
      <header className="header-glass sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("predictor")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Icon name="home" size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-500 to-accent-400">
                  sqV
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  AI Real Estate
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-tight -mt-1 hidden sm:block">Square Value Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1.5 rounded-xl border border-slate-800/60 dark:bg-slate-900/60 light:bg-slate-200/60">
            {[
              { id: "predictor", label: "Predictor", icon: "cpu" },
              { id: "dashboard", label: "Dashboard", icon: "barChart" },
              { id: "calculator", label: "EMI & Finance", icon: "calculator" },
              { id: "bulk", label: "Bulk Batch", icon: "upload" },
              { id: "history", label: `History (${history.length})`, icon: "fileText" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon name={tab.icon} size={15} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-white transition-all"
              title="Toggle Dark/Light Mode"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>

            {/* User Auth Menu */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold leading-tight text-slate-200">{user.name}</p>
                    <span className="text-[10px] text-accent-400 font-semibold">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Sign Out"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal("signin")}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN PAGE TAB SWITCHER --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Mobile Nav Bar */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          {[
            { id: "predictor", label: "Predictor" },
            { id: "dashboard", label: "Dashboard" },
            { id: "calculator", label: "EMI Calculator" },
            { id: "bulk", label: "Bulk CSV" },
            { id: "history", label: "History" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id ? "bg-brand-600 text-white" : "bg-slate-800/60 text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: VALUATION PREDICTOR PAGE */}
        {activeTab === "predictor" && (
          <PredictorView
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedLocalityName={selectedLocalityName}
            setSelectedLocalityName={setSelectedLocalityName}
            availableCities={availableCities}
            availableLocalities={availableLocalities}
            currentLocalityObj={currentLocalityObj}
            areaSqFt={areaSqFt}
            setAreaSqFt={setAreaSqFt}
            bhk={bhk}
            setBhk={setBhk}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            balconies={balconies}
            setBalconies={setBalconies}
            parking={parking}
            setParking={setParking}
            floor={floor}
            setFloor={setFloor}
            totalFloors={totalFloors}
            setTotalFloors={setTotalFloors}
            age={age}
            setAge={setAge}
            furnishing={furnishing}
            setFurnishing={setFurnishing}
            selectedAmenities={selectedAmenities}
            toggleAmenity={toggleAmenity}
            proximity={proximity}
            setProximity={setProximity}
            valuationResult={valuationResult}
            isCalculating={isCalculating}
            handleRecalculate={handleRecalculate}
            saveEstimate={saveEstimate}
            setCertificateModal={setCertificateModal}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 2: MARKET INTELLIGENCE DASHBOARD PAGE */}
        {activeTab === "dashboard" && (
          <DashboardView
            selectedState={selectedState}
            selectedCity={selectedCity}
          />
        )}

        {/* TAB 3: FINANCIAL EMI CALCULATOR PAGE */}
        {activeTab === "calculator" && (
          <CalculatorView
            initialAmount={valuationResult.totalPrice}
          />
        )}

        {/* TAB 4: BULK CSV BATCH VALUATION PAGE */}
        {activeTab === "bulk" && (
          <BulkBatchView
            setCertificateModal={setCertificateModal}
          />
        )}

        {/* TAB 5: PREDICTION HISTORY PAGE */}
        {activeTab === "history" && (
          <HistoryView
            history={history}
            deleteHistoryItem={deleteHistoryItem}
            setCertificateModal={setCertificateModal}
            setActiveTab={setActiveTab}
          />
        )}

      </main>

      {/* --- AUTHENTICATION MODAL --- */}
      {authModal && (
        <AuthModal
          mode={authModal}
          setAuthModal={setAuthModal}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}

      {/* --- PRINTABLE AI CERTIFICATE MODAL --- */}
      {certificateModal && (
        <CertificateModal
          data={certificateModal}
          onClose={() => setCertificateModal(null)}
        />
      )}

      {/* --- FOOTER --- */}
      <footer className="mt-12 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg text-brand-400">sqV</span>
            <span>© 2026 Square Value AI Technologies Ltd. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <a href="#" className="hover:text-brand-400">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-brand-400">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-brand-400">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENT 1: PREDICTOR VIEW ---
function PredictorView({
  selectedState, setSelectedState,
  selectedCity, setSelectedCity,
  selectedLocalityName, setSelectedLocalityName,
  availableCities, availableLocalities, currentLocalityObj,
  areaSqFt, setAreaSqFt,
  bhk, setBhk,
  bathrooms, setBathrooms,
  balconies, setBalconies,
  parking, setParking,
  floor, setFloor,
  totalFloors, setTotalFloors,
  age, setAge,
  furnishing, setFurnishing,
  selectedAmenities, toggleAmenity,
  proximity, setProximity,
  valuationResult, isCalculating, handleRecalculate,
  saveEstimate, setCertificateModal, setActiveTab
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: PARAMETER INPUT FORM (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Hero Banner Header */}
        <div className="glass-card p-6 rounded-2xl border border-brand-500/20 bg-gradient-to-r from-slate-900/80 via-brand-950/40 to-slate-900/80">
          <div className="flex items-center gap-3 text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Icon name="sparkles" size={16} />
            <span>AI Valuation Engine v4.2</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Indian Real Estate Market Valuation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input micro-location parameters, structural specifications, and amenities to infer instant estimated market value.
          </p>
        </div>

        {/* SECTION 1: LOCATION CASCADES */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-slate-200">
              <Icon name="mapPin" className="text-brand-400" size={18} />
              1. Location & Locality Cascade
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              {currentLocalityObj.tier}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* State Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                {Object.keys(INDIAN_LOCATIONS).map(st => (
                  <option key={st} value={st} className="bg-slate-900 text-white">{st}</option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                {availableCities.map(ct => (
                  <option key={ct} value={ct} className="bg-slate-900 text-white">{ct}</option>
                ))}
              </select>
            </div>

            {/* Locality Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Locality Benchmark</label>
              <select
                value={selectedLocalityName}
                onChange={(e) => setSelectedLocalityName(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                {availableLocalities.map(loc => (
                  <option key={loc.name} value={loc.name} className="bg-slate-900 text-white">
                    {loc.name} (₹{loc.baseRate}/sqft)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Locality Live Benchmark Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400">Baseline Locality Rate:</span>
              <strong className="text-emerald-400 ml-2 font-display text-sm font-bold">₹ {currentLocalityObj.baseRate.toLocaleString('en-IN')} / sq.ft</strong>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Demand: <strong className="text-brand-400">{currentLocalityObj.demandIndex}/100</strong></span>
              <span className="text-slate-400">YoY: <strong className="text-emerald-400">+{currentLocalityObj.growthRate}%</strong></span>
            </div>
          </div>
        </div>

        {/* SECTION 2: CORE PROPERTY SPECIFICATIONS */}
        <div className="glass-card p-6 rounded-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-slate-200">
              <Icon name="building" className="text-brand-400" size={18} />
              2. Core Layout & Dimensions
            </h3>
          </div>

          {/* Area Slider + Numeric Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300">Super Built-up Area (Sq. Ft.)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Math.max(300, Number(e.target.value)))}
                  className="w-24 glass-input px-2 py-1 rounded-lg text-right font-display font-bold text-sm text-brand-400"
                />
                <span className="text-xs font-semibold text-slate-400">sq.ft</span>
              </div>
            </div>
            <input
              type="range"
              min="300"
              max="8000"
              step="50"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
              <span>300 sq.ft</span>
              <span>2,500 sq.ft</span>
              <span>5,000 sq.ft</span>
              <span>8,000+ sq.ft</span>
            </div>
          </div>

          {/* BHK Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">BHK Configuration</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBhk(b)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    bhk === b
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30 border border-brand-400"
                      : "bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/50"
                  }`}
                >
                  {b} {b === 5 ? "5+ BHK" : "BHK"}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms, Balconies, Parking */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Bathrooms</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setBathrooms(n)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                      bathrooms === n ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Balconies</label>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setBalconies(n)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                      balconies === n ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Parking Spots</label>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setParking(n)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                      parking === n ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: STRUCTURAL & AGE PARAMETERS */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-slate-200">
              <Icon name="layers" className="text-brand-400" size={18} />
              3. Structural & Furnishing Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Floor Rise */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Floor Level: <strong className="text-brand-400">{floor}</strong></span>
                <span className="text-slate-500">Total: {totalFloors} floors</span>
              </div>
              <input
                type="range"
                min="0"
                max={totalFloors}
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Property Age */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Property Age: <strong className="text-emerald-400">{age === 0 ? "Under Const / New" : `${age} Years`}</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Furnishing Status */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Furnishing Status</label>
            <div className="grid grid-cols-3 gap-3">
              {["Unfurnished", "Semi-Furnished", "Fully Furnished"].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFurnishing(f)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    furnishing === f
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: AMENITIES MATRIX */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-slate-200">
              <Icon name="shield" className="text-brand-400" size={18} />
              4. Amenities & Premium Infrastructure
            </h3>
            <span className="text-xs text-brand-400 font-semibold">{selectedAmenities.length} selected</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map(item => {
              const active = selectedAmenities.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAmenity(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    active
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/20 border border-brand-400"
                      : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 border border-slate-700/40"
                  }`}
                >
                  <span className={active ? "text-accent-400" : "text-slate-500"}>✓</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: FACILITY PROXIMITY SLIDERS */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-slate-200">
              <Icon name="trendingUp" className="text-brand-400" size={18} />
              5. Connectivity & Proximity Distances (km)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "metro", label: "Nearest Metro Station", max: 10 },
              { key: "highway", label: "Main Express Highway", max: 15 },
              { key: "school", label: "International School", max: 8 },
              { key: "hospital", label: "Multi-Specialty Hospital", max: 10 },
              { key: "mall", label: "Shopping Mall / Hub", max: 10 }
            ].map(p => (
              <div key={p.key}>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                  <span>{p.label}</span>
                  <span className="text-brand-400">{proximity[p.key]} km</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max={p.max}
                  step="0.2"
                  value={proximity[p.key]}
                  onChange={(e) => setProximity({ ...proximity, [p.key]: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: VALUATION INFERENCE DASHBOARD & DERIVED METRICS (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* MAIN ESTIMATED PRICE HERO CARD */}
        <div className="glass-card p-6 rounded-2xl border-2 border-brand-500/40 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-brand-950/60 to-slate-900/90 shadow-2xl">
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-400 flex items-center gap-1.5">
              <span className="pulse-dot"></span> AI INFERRED MARKET VALUE
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {valuationResult.category}
            </span>
          </div>

          {/* Price Tag Display */}
          <div className="space-y-1 my-3">
            <h2 className={`font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight ${isCalculating ? 'skeleton rounded-lg text-transparent' : ''}`}>
              {formatRupee(valuationResult.totalPrice)}
            </h2>
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-2">
              Estimated Range: <strong className="text-slate-200">{formatRupee(valuationResult.minPrice)} – {formatRupee(valuationResult.maxPrice)}</strong>
            </p>
          </div>

          {/* Key Metric Pills */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Price per Sq. Ft.</span>
              <p className="font-display text-lg font-extrabold text-emerald-400">
                ₹ {valuationResult.pricePerSqFt.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/sq.ft</span>
              </p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">AI Confidence Index</span>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-extrabold text-indigo-400">
                  {valuationResult.confidenceScore}%
                </p>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${valuationResult.confidenceScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Growth Potential Rating */}
          <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Investment Growth Rating</span>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Icon
                    key={star}
                    name="star"
                    size={14}
                    className={star <= valuationResult.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                  />
                ))}
                <span className="text-xs font-bold text-white ml-1.5">
                  +{valuationResult.roiTrend}% YoY Growth
                </span>
              </div>
            </div>
            <button
              onClick={saveEstimate}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 shadow transition"
            >
              <Icon name="check" size={14} /> Save
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={() => setCertificateModal({
                locality: currentLocalityObj,
                state: selectedState,
                city: selectedCity,
                result: valuationResult,
                inputs: { areaSqFt, bhk, bathrooms, balconies, floor, totalFloors, age, furnishing }
              })}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center gap-2 transition shadow-lg shadow-brand-500/25"
            >
              <Icon name="fileText" size={15} /> Valuation Certificate
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <Icon name="calculator" size={15} /> Calculate EMI
            </button>
          </div>

        </div>

        {/* SUB-SCORE GAUGE CARDS */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3.5 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Location Premium</span>
            <p className="font-display text-xl font-extrabold text-indigo-400">{valuationResult.locationScore}<span className="text-xs font-normal text-slate-500">/100</span></p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${valuationResult.locationScore}%` }}></div>
            </div>
          </div>

          <div className="glass-card p-3.5 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Connectivity Index</span>
            <p className="font-display text-xl font-extrabold text-emerald-400">{valuationResult.connectivityScore}<span className="text-xs font-normal text-slate-500">/100</span></p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${valuationResult.connectivityScore}%` }}></div>
            </div>
          </div>

          <div className="glass-card p-3.5 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Amenities Rating</span>
            <p className="font-display text-xl font-extrabold text-amber-400">{valuationResult.amenitiesIndex}<span className="text-xs font-normal text-slate-500">/100</span></p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${valuationResult.amenitiesIndex}%` }}></div>
            </div>
          </div>
        </div>

        {/* PRICE BREAKDOWN COMPONENT */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Valuation Cost Stack Breakdown</span>
            <span className="text-xs text-slate-400 font-normal">Component Analysis</span>
          </h4>

          {/* Stack Progress Bar */}
          <div className="h-4 w-full bg-slate-800 rounded-lg overflow-hidden flex">
            <div className="h-full bg-indigo-500" style={{ width: "58%" }} title="Base Land & Locality Value"></div>
            <div className="h-full bg-emerald-500" style={{ width: "24%" }} title="Built-up Construction Cost"></div>
            <div className="h-full bg-purple-500" style={{ width: "8%" }} title="Floor Rise Bonus"></div>
            <div className="h-full bg-amber-500" style={{ width: "10%" }} title="Amenities Markup"></div>
          </div>

          {/* Breakdown Items */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Base Land Value
              </span>
              <strong className="text-slate-200">{formatRupee(valuationResult.breakdown.land)}</strong>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Construction Cost
              </span>
              <strong className="text-slate-200">{formatRupee(valuationResult.breakdown.construction)}</strong>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Floor Rise Bonus
              </span>
              <strong className="text-slate-200">{formatRupee(valuationResult.breakdown.floorRise)}</strong>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Amenities Markup
              </span>
              <strong className="text-slate-200">{formatRupee(valuationResult.breakdown.amenities)}</strong>
            </div>
          </div>
        </div>

        {/* FEATURE IMPORTANCE HORIZONTAL BAR CHART */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">
            AI Key Valuation Drivers
          </h4>

          <div className="space-y-3">
            {valuationResult.featureWeights.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{feat.label}</span>
                  <span className="font-bold text-slate-200">+{feat.weight}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${feat.weight * 2.5}%`, backgroundColor: feat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIMILAR PROPERTIES RECOMMENDATION MATRIX */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Comparable Market Properties</span>
            <span className="text-xs text-brand-400 font-semibold">{selectedLocalityName}</span>
          </h4>

          <div className="space-y-3">
            {[
              { title: `${bhk} BHK Premium Residence`, area: areaSqFt - 50, price: valuationResult.totalPrice * 0.97, match: "98% Match" },
              { title: `${bhk} BHK Luxury High-rise`, area: areaSqFt + 100, price: valuationResult.totalPrice * 1.04, match: "95% Match" },
              { title: `${bhk + 1 > 5 ? 5 : bhk + 1} BHK Executive Flat`, area: areaSqFt + 250, price: valuationResult.totalPrice * 1.15, match: "91% Match" }
            ].map((prop, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{prop.title}</h5>
                  <p className="text-[11px] text-slate-400">{prop.area} sq.ft • Floor {floor + idx} • {furnishing}</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-xs text-emerald-400 block">{formatRupee(prop.price)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-semibold border border-brand-500/20">
                    {prop.match}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// --- SUB-COMPONENT 2: MARKET INTELLIGENCE DASHBOARD VIEW ---
function DashboardView({ selectedState, selectedCity }) {
  const [filterCity, setFilterCity] = useState(selectedCity || "Mumbai");
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);

  useEffect(() => {
    // City Comparison Bar Chart
    const ctx1 = document.getElementById("cityPriceChart");
    if (ctx1) {
      if (chartRef1.current) chartRef1.current.destroy();
      chartRef1.current = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Mumbai', 'Gurgaon', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'],
          datasets: [{
            label: 'Avg. Price / Sq. Ft. (₹)',
            data: [38500, 21500, 24000, 11200, 10500, 10200, 12400, 8500],
            backgroundColor: 'rgba(99, 102, 241, 0.85)',
            borderColor: '#6366f1',
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    // Property Type Distribution Donut Chart
    const ctx2 = document.getElementById("bhkDistributionChart");
    if (ctx2) {
      if (chartRef2.current) chartRef2.current.destroy();
      chartRef2.current = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK / Villas'],
          datasets: [{
            data: [18, 38, 30, 10, 4],
            backgroundColor: ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'],
            borderWidth: 2,
            borderColor: '#0f172a'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } } }
        }
      });
    }

    // 5-Year Price Growth Line Chart
    const ctx3 = document.getElementById("priceTrendChart");
    if (ctx3) {
      if (chartRef3.current) chartRef3.current.destroy();
      chartRef3.current = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: ['2021', '2022', '2023', '2024', '2025', '2026 (Est)'],
          datasets: [{
            label: 'Index Growth (₹/sqft)',
            data: [8200, 8900, 9800, 10900, 12200, 13800],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#10b981'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Filter */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <Icon name="barChart" className="text-brand-400" size={24} />
            Pan-India Real Estate Market Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live market benchmarks, locality price leaderboards, and historical growth projections.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400">Filter City:</span>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
          >
            {['Mumbai', 'Bengaluru', 'Gurgaon', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'].map(c => (
              <option key={c} value={c} className="bg-slate-900">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI HERO METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-brand-500">
          <span className="text-[11px] font-bold uppercase text-slate-400">National Benchmark Rate</span>
          <h3 className="font-display text-2xl font-extrabold text-white">₹ 12,450 <span className="text-xs font-normal text-slate-400">/sq.ft</span></h3>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <Icon name="trendingUp" size={14} /> +9.4% YoY Appreciation
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-emerald-500">
          <span className="text-[11px] font-bold uppercase text-slate-400">Highest Growth City</span>
          <h3 className="font-display text-2xl font-extrabold text-white">Hyderabad</h3>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <Icon name="trendingUp" size={14} /> +14.8% YoY Capital Return
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-amber-500">
          <span className="text-[11px] font-bold uppercase text-slate-400">Avg. Gross Rental Yield</span>
          <h3 className="font-display text-2xl font-extrabold text-white">3.85% <span className="text-xs font-normal text-slate-400">p.a.</span></h3>
          <span className="text-xs text-amber-400 font-bold">Top Yield: IT Corridors (4.4%)</span>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-purple-500">
          <span className="text-[11px] font-bold uppercase text-slate-400">Active Listed Inventory</span>
          <h3 className="font-display text-2xl font-extrabold text-white">164,200+</h3>
          <span className="text-xs text-slate-400 font-bold">Avg. Days on Market: 48 Days</span>
        </div>
      </div>

      {/* CHARTS GRID 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* City Price Comparison Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-slate-200">Major City Price/Sq.Ft Benchmark</h3>
            <span className="text-xs text-slate-400">2026 Q3 Data</span>
          </div>
          <div className="h-64 w-full">
            <canvas id="cityPriceChart"></canvas>
          </div>
        </div>

        {/* BHK Inventory Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-slate-200">Market BHK Configuration Share</h3>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <canvas id="bhkDistributionChart"></canvas>
          </div>
        </div>

      </div>

      {/* CHARTS GRID 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 5-Year Historical & Forecast Growth Line Chart (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-slate-200">5-Year Capital Value Growth Forecast</h3>
            <span className="text-xs font-bold text-emerald-400">Compound +10.2% p.a.</span>
          </div>
          <div className="h-64 w-full">
            <canvas id="priceTrendChart"></canvas>
          </div>
        </div>

        {/* Top Localities Leaderboard (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-base text-slate-200">Top Indian Localities Leaderboard</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { rank: 1, locality: "Worli, Mumbai", rate: "₹ 46,500 /sqft", trend: "+12.8%" },
              { rank: 2, locality: "Bandra West, Mumbai", rate: "₹ 42,000 /sqft", trend: "+11.2%" },
              { rank: 3, locality: "Connaught Place, Delhi", rate: "₹ 36,000 /sqft", trend: "+7.8%" },
              { rank: 4, locality: "Golf Course Rd, Gurgaon", rate: "₹ 24,500 /sqft", trend: "+14.5%" },
              { rank: 5, locality: "Indiranagar, Bengaluru", rate: "₹ 18,500 /sqft", trend: "+10.8%" }
            ].map(item => (
              <div key={item.rank} className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600/30 text-brand-400 font-bold flex items-center justify-center">
                    #{item.rank}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-200">{item.locality}</h5>
                    <p className="text-[10px] text-slate-400">{item.rate}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// --- SUB-COMPONENT 3: FINANCIAL & EMI CALCULATOR VIEW ---
function CalculatorView({ initialAmount }) {
  const [loanAmount, setLoanAmount] = useState(initialAmount ? Math.round(initialAmount * 0.8) : 8000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const chartRef = useRef(null);

  // EMI Calculations
  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;
    
    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyEmi: Math.round(emi),
      totalPrincipal: loanAmount,
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  }, [loanAmount, interestRate, tenureYears]);

  // Donut Chart Update
  useEffect(() => {
    const ctx = document.getElementById("emiBreakdownChart");
    if (ctx) {
      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal Amount', 'Total Interest Payable'],
          datasets: [{
            data: [calculations.totalPrincipal, calculations.totalInterest],
            backgroundColor: ['#6366f1', '#10b981'],
            borderWidth: 2,
            borderColor: '#0f172a'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
      });
    }
  }, [calculations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: EMI CONTROLS (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        <div className="glass-card p-6 rounded-2xl border border-brand-500/20">
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2 mb-1">
            <Icon name="calculator" className="text-brand-400" size={24} />
            Home Loan EMI & Financial Calculator
          </h2>
          <p className="text-xs text-slate-400">Simulate monthly installments, interest overheads, and amortization schedules.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-6">
          
          {/* Loan Amount Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300">Loan Principal Amount</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-36 glass-input px-3 py-1 rounded-lg font-display font-bold text-sm text-brand-400 text-right"
                />
              </div>
            </div>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
              <span>₹ 5 Lakhs</span>
              <span>₹ 1 Crore</span>
              <span>₹ 5 Crores</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300">Interest Rate (% p.a.)</label>
              <span className="font-display font-extrabold text-sm text-emerald-400">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="6.5"
              max="14.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
              <span>6.5%</span>
              <span>8.5% (Avg)</span>
              <span>14.0%</span>
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300">Loan Tenure (Years)</label>
              <span className="font-display font-extrabold text-sm text-indigo-400">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
              <span>5 Yrs</span>
              <span>15 Yrs</span>
              <span>30 Yrs</span>
            </div>
          </div>

          {/* Bank Rate Quick Presets */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-400 mb-2">Bank Rates Presets</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "SBI Home Loan (8.4%)", rate: 8.4 },
                { name: "HDFC Bank (8.5%)", rate: 8.5 },
                { name: "ICICI Bank (8.65%)", rate: 8.65 },
                { name: "Axis Bank (8.75%)", rate: 8.75 }
              ].map(bank => (
                <button
                  key={bank.name}
                  onClick={() => setInterestRate(bank.rate)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/50"
                >
                  {bank.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: EMI SUMMARY & CHART (5 Cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Monthly EMI Hero Box */}
        <div className="glass-card p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900/90 via-emerald-950/30 to-slate-900/90 shadow-xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Calculated Monthly EMI</span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            ₹ {calculations.monthlyEmi.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ month</span>
          </h2>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Principal Amount:</span>
              <strong className="text-indigo-400 font-bold">{formatRupee(calculations.totalPrincipal)}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Interest Payable:</span>
              <strong className="text-emerald-400 font-bold">{formatRupee(calculations.totalInterest)}</strong>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-bold">Total Amount Payable:</span>
              <strong className="text-white font-extrabold">{formatRupee(calculations.totalPayment)}</strong>
            </div>
          </div>
        </div>

        {/* EMI Donut Breakdown Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h4 className="font-display font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">
            Payment Breakdown (Principal vs Interest)
          </h4>
          <div className="h-56 w-full flex items-center justify-center">
            <canvas id="emiBreakdownChart"></canvas>
          </div>
        </div>

      </div>

    </div>
  );
}

// --- SUB-COMPONENT 4: BULK CSV BATCH VALUATION VIEW ---
function BulkBatchView({ setCertificateModal }) {
  const [csvData, setCsvData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample CSV Loader Shortcut
  const loadSampleCsv = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const sampleRows = [
        { id: 1, locality: "Bandra West", city: "Mumbai", areaSqFt: 1450, bhk: 3, age: 2, furnishing: "Fully Furnished", predictedPrice: 62500000, rateSqFt: 43103, potential: "High Growth" },
        { id: 2, locality: "Whitefield", city: "Bengaluru", areaSqFt: 1800, bhk: 3, age: 1, furnishing: "Semi-Furnished", predictedPrice: 16500000, rateSqFt: 9166, potential: "High Growth" },
        { id: 3, locality: "Gachibowli", city: "Hyderabad", areaSqFt: 2100, bhk: 4, age: 3, furnishing: "Semi-Furnished", predictedPrice: 20500000, rateSqFt: 9761, potential: "Very High" },
        { id: 4, locality: "Golf Course Road", city: "Gurgaon", areaSqFt: 2800, bhk: 4, age: 0, furnishing: "Fully Furnished", predictedPrice: 72000000, rateSqFt: 25714, potential: "Luxury Prime" },
        { id: 5, locality: "Baner", city: "Pune", areaSqFt: 1100, bhk: 2, age: 4, furnishing: "Unfurnished", predictedPrice: 10800000, rateSqFt: 9818, potential: "Mid Tier" },
        { id: 6, locality: "Salt Lake Sector 5", city: "Kolkata", areaSqFt: 1250, bhk: 3, age: 2, furnishing: "Semi-Furnished", predictedPrice: 10600000, rateSqFt: 8480, potential: "Moderate" }
      ];
      setCsvData(sampleRows);
      setIsProcessing(false);
      showToast("Sample CSV properties loaded & evaluated!");
    }, 600);
  };

  // CSV File Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split("\n").filter(l => l.trim().length > 0);
      
      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length >= 4) {
          const locality = cols[0] ? cols[0].trim() : "Locality";
          const city = cols[1] ? cols[1].trim() : "City";
          const areaSqFt = parseInt(cols[2]) || 1000;
          const bhk = parseInt(cols[3]) || 2;
          
          const predictedPrice = Math.round(areaSqFt * 12500 * (bhk * 0.2 + 0.8));
          parsed.push({
            id: i,
            locality,
            city,
            areaSqFt,
            bhk,
            age: 2,
            furnishing: "Semi-Furnished",
            predictedPrice,
            rateSqFt: Math.round(predictedPrice / areaSqFt),
            potential: "High Growth"
          });
        }
      }
      setCsvData(parsed);
      setIsProcessing(false);
      showToast(`Processed ${parsed.length} property rows from CSV!`);
    };
    reader.readAsText(file);
  };

  // Export Results to CSV
  const exportResultsCsv = () => {
    if (!csvData || csvData.length === 0) return;
    let csvStr = "ID,Locality,City,Area_SqFt,BHK,Predicted_Price_INR,Rate_Per_SqFt,Investment_Potential\n";
    csvData.forEach(row => {
      csvStr += `${row.id},"${row.locality}","${row.city}",${row.areaSqFt},${row.bhk},${row.predictedPrice},${row.rateSqFt},"${row.potential}"\n`;
    });

    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sqV_Bulk_Valuation_Results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Valuation results exported to CSV download!");
  };

  const filteredRows = useMemo(() => {
    if (!csvData) return [];
    return csvData.filter(r => 
      r.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [csvData, searchQuery]);

  return (
    <div className="space-y-6">
      
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <Icon name="upload" className="text-brand-400" size={24} />
            Bulk CSV Property Valuation Tool
          </h2>
          <p className="text-xs text-slate-400 mt-1">Upload CSV datasets of property listings to execute batch AI inference and export structured valuations.</p>
        </div>

        <button
          onClick={loadSampleCsv}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 flex items-center gap-2 transition"
        >
          <Icon name="sparkles" size={16} /> Load Sample Indian Properties CSV
        </button>
      </div>

      {/* FILE UPLOAD DROP ZONE */}
      <div className="glass-card p-8 rounded-2xl text-center border-2 border-dashed border-slate-700 hover:border-brand-500 transition-all cursor-pointer relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center mb-3">
          <Icon name="upload" size={24} />
        </div>
        <h4 className="font-display font-bold text-base text-white">Drop your CSV property file here or Click to Upload</h4>
        <p className="text-xs text-slate-400 mt-1">Supports column formats: locality, city, area_sqft, bhk, age, furnishing</p>
      </div>

      {/* PROCESSING STATE OR DATA TABLE */}
      {isProcessing ? (
        <div className="glass-card p-12 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-sm text-slate-200">Executing sqV AI Valuation Batch Models...</p>
        </div>
      ) : csvData && csvData.length > 0 ? (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="relative w-full sm:w-72">
              <Icon name="search" className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by Locality or City..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 font-semibold">{filteredRows.length} Property Rows</span>
              <button
                onClick={exportResultsCsv}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow"
              >
                <Icon name="download" size={15} /> Export Results to CSV
              </button>
            </div>
          </div>

          {/* TABLE DISPLAY */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase font-bold border-b border-slate-800 bg-slate-900/40">
                <tr>
                  <th className="py-3 px-4">Locality</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Area (sqft)</th>
                  <th className="py-3 px-4">BHK</th>
                  <th className="py-3 px-4">Predicted Price (₹)</th>
                  <th className="py-3 px-4">Rate / sq.ft</th>
                  <th className="py-3 px-4">Growth Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredRows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-200">{row.locality}</td>
                    <td className="py-3 px-4 text-slate-400">{row.city}</td>
                    <td className="py-3 px-4 text-slate-300">{row.areaSqFt} sq.ft</td>
                    <td className="py-3 px-4 text-slate-300">{row.bhk} BHK</td>
                    <td className="py-3 px-4 font-display font-bold text-emerald-400">{formatRupee(row.predictedPrice)}</td>
                    <td className="py-3 px-4 text-slate-300">₹ {row.rateSqFt.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-[10px] font-bold border border-brand-500/20">
                        {row.potential}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : null}

    </div>
  );
}

// --- SUB-COMPONENT 5: PREDICTION HISTORY VIEW ---
function HistoryView({ history, deleteHistoryItem, setCertificateModal, setActiveTab }) {
  return (
    <div className="space-y-6">
      
      <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2">
            <Icon name="fileText" className="text-brand-400" size={24} />
            Saved Valuation Estimates History
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review, manage, or export AI valuation certificates for previously generated estimates.</p>
        </div>

        <button
          onClick={() => setActiveTab("predictor")}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1.5 shadow"
        >
          <Icon name="home" size={15} /> New Valuation
        </button>
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-3">
          <Icon name="fileText" className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="font-display font-bold text-lg text-slate-300">No Saved Estimates Yet</h4>
          <p className="text-xs text-slate-400">Run a property valuation on the Predictor tab and click "Save" to track estimates here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map(item => (
            <div key={item.id} className="glass-card p-5 rounded-2xl space-y-3 relative group border border-slate-800 hover:border-brand-500/40 transition">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{item.id}</span>
                  <h4 className="font-display font-bold text-base text-white">{item.locality}, {item.city}</h4>
                  <p className="text-xs text-slate-400">{item.state}</p>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Delete Item"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Predicted Value</span>
                  <p className="font-display text-lg font-extrabold text-emerald-400">{formatRupee(item.predictedPrice)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Rate/sq.ft</span>
                  <p className="font-display text-sm font-bold text-slate-200">₹ {item.pricePerSqFt.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{item.area} sq.ft • {item.bhk} BHK</span>
                <span className="text-brand-400 font-semibold">{item.confidence}% Confidence</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                <button
                  onClick={() => setCertificateModal({
                    locality: { name: item.locality, baseRate: item.pricePerSqFt, tier: "Saved Listing", demandIndex: 90, growthRate: 10 },
                    state: item.state,
                    city: item.city,
                    result: item.details || { totalPrice: item.predictedPrice, minPrice: item.predictedPrice * 0.95, maxPrice: item.predictedPrice * 1.05, pricePerSqFt: item.pricePerSqFt, confidenceScore: item.confidence, rating: 4, category: "High Growth" },
                    inputs: { areaSqFt: item.area, bhk: item.bhk, floor: item.floor, age: 2 }
                  })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1 shadow"
                >
                  <Icon name="fileText" size={14} /> View Certificate
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENT 6: AUTHENTICATION MODAL ---
function AuthModal({ mode, setAuthModal, onSignIn, onSignUp }) {
  const [isSignIn, setIsSignIn] = useState(mode === "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Homebuyer");

  // Password strength calculation
  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">
        
        <button
          onClick={() => setAuthModal(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <Icon name="x" size={20} />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Icon name="home" size={24} />
          </div>
          <h3 className="font-display text-xl font-extrabold text-white">
            {isSignIn ? "Sign In to sqV Platform" : "Create your sqV Account"}
          </h3>
          <p className="text-xs text-slate-400">AI-powered Real Estate Intelligence & Valuation Engine</p>
        </div>

        <form onSubmit={(e) => isSignIn ? onSignIn(e, email, password) : onSignUp(e, name, email, role)} className="space-y-4">
          
          {!isSignIn && (
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
            />
            
            {/* Password strength meter */}
            {!isSignIn && password && (
              <div className="mt-2 space-y-1">
                <div className="flex h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    strengthScore === 1 ? 'w-1/4 bg-red-500' :
                    strengthScore === 2 ? 'w-2/4 bg-amber-500' :
                    strengthScore === 3 ? 'w-3/4 bg-indigo-500' :
                    strengthScore === 4 ? 'w-full bg-emerald-500' : 'w-0'
                  }`}></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  Strength: {strengthScore <= 1 ? "Weak" : strengthScore === 2 ? "Medium" : strengthScore === 3 ? "Strong" : "Very Strong"}
                </span>
              </div>
            )}
          </div>

          {!isSignIn && (
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">User Role</label>
              <div className="grid grid-cols-2 gap-2">
                {["Homebuyer", "Seller", "Real Estate Agent", "Property Investor"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      role === r ? "bg-brand-600 border-brand-400 text-white" : "bg-slate-800/60 border-slate-700/50 text-slate-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/30 transition mt-2"
          >
            {isSignIn ? "Sign In to Account" : "Create Free Account"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-brand-400 font-bold hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT 7: PRINTABLE AI VALUATION CERTIFICATE MODAL ---
function CertificateModal({ data, onClose }) {
  const { locality, state, city, result, inputs } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full my-8">
        
        {/* TOP BAR CONTROLS (Hidden in print) */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-t-2xl no-print">
          <div className="flex items-center gap-2">
            <Icon name="fileText" className="text-brand-400" size={20} />
            <span className="font-display font-bold text-sm text-white">Official AI Valuation Certificate</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow"
            >
              <Icon name="print" size={16} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Icon name="x" size={20} />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE DOCUMENT BODY */}
        <div id="printable-certificate" className="bg-white text-slate-900 p-8 sm:p-10 rounded-b-2xl border-2 border-brand-600 space-y-6 shadow-2xl relative">
          
          {/* Header Brand Seal */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display text-2xl font-black">
                sqV
              </div>
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
                  Square Value AI Assessment
                </h1>
                <p className="text-xs font-bold text-indigo-600 tracking-wider">CERTIFICATE OF REAL ESTATE MARKET VALUATION</p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="px-3 py-1 rounded bg-slate-100 border border-slate-300 font-bold text-slate-800">
                VERIFIED #sqV-VAL-{Math.floor(100000 + Math.random() * 900000)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Issued: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Location & Property Core Details Table */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px] block mb-1">Locality & City</span>
              <strong className="text-sm font-bold text-slate-900 block">{locality.name || locality}, {city}</strong>
              <span className="text-slate-600">{state}, India</span>
            </div>

            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px] block mb-1">Property Layout Specs</span>
              <strong className="text-sm font-bold text-slate-900 block">{inputs.areaSqFt || 1250} Sq. Ft. • {inputs.bhk || 3} BHK</strong>
              <span className="text-slate-600">Floor {inputs.floor || 8} • Age: {inputs.age || 2} Yrs • {inputs.furnishing || "Semi-Furnished"}</span>
            </div>
          </div>

          {/* VALUATION RESULT HIGHLIGHT BOX */}
          <div className="p-6 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-700">Inferred Fair Market Valuation</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-indigo-950">
              {formatRupee(result.totalPrice)}
            </h2>
            <div className="flex justify-center items-center gap-6 text-xs font-bold text-slate-700 pt-2 border-t border-indigo-200">
              <span>Valuation Range: <strong>{formatRupee(result.minPrice)} – {formatRupee(result.maxPrice)}</strong></span>
              <span>•</span>
              <span>Rate: <strong>₹ {result.pricePerSqFt ? result.pricePerSqFt.toLocaleString('en-IN') : 0} / sq.ft</strong></span>
            </div>
          </div>

          {/* SCORE BREAKDOWN MATRIX */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-slate-500 uppercase text-[10px] font-bold block">AI Confidence Score</span>
              <strong className="text-lg font-bold text-indigo-600">{result.confidenceScore || 96.2}%</strong>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-slate-500 uppercase text-[10px] font-bold block">Market Tier Category</span>
              <strong className="text-xs font-bold text-slate-900 block mt-1">{result.category || "Luxury Prime"}</strong>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <span className="text-slate-500 uppercase text-[10px] font-bold block">3-Yr ROI Outlook</span>
              <strong className="text-lg font-bold text-emerald-600">+{result.roiTrend || 11.2}% p.a.</strong>
            </div>
          </div>

          {/* Legal Compliance Disclaimer & Signatures */}
          <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
            <div className="max-w-md">
              <p className="font-bold text-slate-800 mb-0.5">Disclaimer & Methodology:</p>
              <p>This valuation certificate is derived via sqV spatial machine learning regression algorithms trained on verified registry deeds, land benchmarks, and market transactions. Certified for financial reference.</p>
            </div>

            <div className="text-right">
              <div className="w-28 border-b border-slate-900 mb-1 ml-auto"></div>
              <p className="font-bold text-slate-900">Dr. A. R. Varma</p>
              <p className="text-[10px]">Head of Spatial AI Research, sqV</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- RENDER APP ENGINE ---
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SqvApp />);
