'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, AlertTriangle, Map as MapIcon, AlertCircle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '0.5rem'
};

const defaultCenter = {
  lat: 19.4517, // Santiago de los Caballeros
  lng: -70.6970
};

// Libraries must be defined outside to avoid re-renders.
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const VehicleInfoPage = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [vin, setVin] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerLocation, setSellerLocation] = useState('');
  const [isSunday, setIsSunday] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [packageError, setPackageError] = useState('');
  
  // Map State
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  
  // Error handling state
  const [mapError, setMapError] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const router = useRouter();

  // Use the API Key from environment or fallback provided by user
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCVtCSWD8c8UZaRZy5JXLeO8c4g3rhbY30";

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  // Catch Google Maps Auth Failure (The "Oops" error)
  useEffect(() => {
      // Define the global function that Google Maps calls on auth failure
      (window as any).gm_authFailure = () => {
          console.error("Google Maps Authentication Error detected.");
          setMapError(true);
      };

      return () => {
          (window as any).gm_authFailure = undefined;
      };
  }, []);

  const carBrands = [
    'Ford', 'Chevrolet', 'Dodge', 'Jeep', 'Ram', 'Cadillac', 'Chrysler', 'Tesla',
    'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Porsche',
    'Toyota', 'Honda', 'Nissan', 'Subaru', 'Mazda', 'Mitsubishi',
    'Hyundai', 'Kia', 'Genesis',
    'BYD', 'Geely', 'Chery', 'MG',
  ];

  const carModels: Record<string, string[]> = {
    Ford: ['F-150', 'Explorer', 'Mustang', 'Escape', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Fusion', 'Maverick', 'Mustang Mach-E', 'Focus', 'Taurus', 'Fiesta'],
    Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro', 'Traverse', 'Trailblazer', 'Suburban', 'Corvette', 'Colorado', 'Bolt EV', 'Blazer', 'Cruze', 'Impala', 'Sonic'],
    Dodge: ['Charger', 'Challenger', 'Durango', 'Hornet', 'Grand Caravan', 'Journey', 'Avenger'],
    Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer', 'Patriot', 'Liberty'],
    Ram: ['1500', '2500', '3500', 'ProMaster', 'Dakota'],
    Cadillac: ['CT4', 'CT5', 'Escalade', 'XT4', 'XT5', 'XT6', 'Lyriq', 'ATS', 'CTS', 'SRX'],
    Chrysler: ['300', 'Pacifica', 'Voyager', '200', 'Town & Country'],
    Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5', 'M3', 'X1', 'X7', '7 Series', '4 Series', 'M5', '2 Series', 'X6', 'i4', 'iX', '1 Series', '6 Series', 'Z4'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'G-Class', 'CLA', 'GLA', 'GLS', 'EQB', 'EQS', 'SL-Class', 'B-Class', 'CLK', 'SLK'],
    Volkswagen: ['Jetta', 'Golf', 'Tiguan', 'Passat', 'Atlas', 'Taos', 'ID.4', 'Arteon', 'Beetle', 'Touareg', 'CC', 'Polo', 'GTI'],
    Audi: ['A4', 'A6', 'Q5', 'Q7', 'R8', 'A3', 'Q3', 'A5', 'Q8', 'e-tron', 'A7', 'TT', 'A8', 'S4', 'S5'],
    Porsche: ['911', '718 Cayman', '718 Boxster', 'Panamera', 'Macan', 'Cayenne', 'Taycan'],
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Tacoma', 'Sienna', '4Runner', 'Prius', 'Yaris', 'Tundra', 'Avalon', 'C-HR', 'Venza', 'Supra', 'Matrix', 'Celica', 'FJ Cruiser'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline', 'Fit', 'Insight', 'Passport', 'Clarity', 'CR-Z', 'Element', 'S2000'],
    Nissan: ['Rogue', 'Altima', 'Sentra', 'Titan', 'Frontier', 'Murano', 'Pathfinder', 'Kicks', 'Versa', 'Maxima', 'Armada', 'Leaf', 'GT-R', '370Z', 'Juke', 'Xterra'],
    Subaru: ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'WRX', 'Legacy', 'Ascent', 'BRZ', 'Solterra', 'Baja', 'Tribeca'],
    Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-30', 'CX-50', 'MX-5 Miata', 'RX-8', 'Tribute'],
    Mitsubishi: ['Outlander', 'Eclipse Cross', 'Mirage', 'RVR', 'Lancer', 'Galant', 'Eclipse'],
    Hyundai: ['Elantra', 'Sonata', 'Sonata LF', 'Sonata New Rise', 'Grandeur', 'Avante', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Ioniq 5', 'Veloster', 'Venue', 'Santa Cruz', 'Accent', 'Genesis Coupe', 'Tiburon'],
    Kia: ['Forte', 'K5', 'K7', 'K8', 'Sorento', 'Sportage', 'Telluride', 'Soul', 'Seltos', 'Carnival', 'Rio', 'Stinger', 'Morning', 'Optima', 'Cadenza'],
    Genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80', 'GV60'],
    BYD: ['Seal', 'Dolphin', 'Han', 'Tang', 'Atto 3', 'Song Plus'],
    Geely: ['Coolray', 'Azkarra', 'Okavango', 'Geometry C'],
    Chery: ['Tiggo 8 Pro', 'Tiggo 7 Pro', 'Tiggo 2 Pro', 'Arrizo 5'],
    MG: ['MG ZS', 'MG HS', 'MG 4', 'MG 5', 'MG GT'],
  };


  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    const savedVehicleInfo = JSON.parse(localStorage.getItem('vehicleInfo') || 'null');
    if (savedVehicleInfo) {
      setMake(savedVehicleInfo.make || '');
      setModel(savedVehicleInfo.model || '');
      setVin(savedVehicleInfo.vin || '');
      setYear(savedVehicleInfo.year || '');
    }

    const savedSellerInfo = JSON.parse(localStorage.getItem('sellerInfo') || 'null');
    if (savedSellerInfo) {
      setSellerName(savedSellerInfo.sellerName || '');
      setSellerPhone(savedSellerInfo.sellerPhone || '');
      setSellerLocation(savedSellerInfo.sellerLocation || '');
    }
  }, []);

  useEffect(() => {
    if (make) {
      setAvailableModels(carModels[make] || []);
    } else {
      setAvailableModels([]);
    }
  }, [make]);

  // Validation Logic for Package vs Year
  useEffect(() => {
    const selectedPackageStr = localStorage.getItem('selectedPackage');
    if (selectedPackageStr && year) {
      const selectedPackage = JSON.parse(selectedPackageStr);
      const vehicleYear = parseInt(year, 10);
      
      setRecommendation('');
      setPackageError('');

      // Validation logic
      if (vehicleYear >= 2020) {
          if (selectedPackage.name === 'Core' || selectedPackage.name === 'CarCheck Plus') {
             setPackageError(`Error: El paquete '${selectedPackage.name}' no es válido para vehículos del año 2020 en adelante. Debes seleccionar el paquete 'Pro'.`);
          }
      } else if (vehicleYear < 2020) {
          if (selectedPackage.name === 'Pro') {
              setPackageError(`Error: El paquete 'Pro' es exclusivo para vehículos del año 2020 en adelante. Por favor selecciona 'Core' o 'CarCheck Plus'.`);
          }
      }
    }
  }, [year]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate.getUTCDay() === 0) {
        setIsSunday(true);
        setDate('');
        setTime('');
    } else {
        setIsSunday(false);
        setDate(e.target.value);
    }
  };

  const onLoadMap = useCallback((map: google.maps.Map) => {
      setMap(map);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setMarkerPosition({ lat, lng });
          const link = `https://www.google.com/maps?q=${lat},${lng}`;
          setSellerLocation(link);
      }
  }, []);

  const handleGetLocation = () => {
      if (navigator.geolocation) {
          const btn = document.getElementById('getLocationBtnFallback') || document.getElementById('getLocationBtn');
          if(btn) btn.innerText = "Buscando...";

          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  setMapCenter({ lat: latitude, lng: longitude });
                  setMarkerPosition({ lat: latitude, lng: longitude });
                  
                  const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
                  setSellerLocation(link);
                  
                  if(btn) btn.innerText = "Ubicación Actualizada";
                  setTimeout(() => { 
                      if(btn) btn.innerText = "Usar mi ubicación actual (GPS)"; 
                  }, 2000);
              },
              (error) => {
                  alert("Error obteniendo ubicación. Asegúrate de permitir el acceso.");
                  if(btn) btn.innerText = "Usar mi ubicación actual (GPS)";
              }
          );
      } else {
          alert("Tu navegador no soporta geolocalización.");
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSunday) {
        alert("No se pueden programar citas los domingos. Por favor, elija otro día.");
        return;
    }

    if (packageError) {
        alert("Por favor corrige la selección del paquete o el año del vehículo antes de continuar.");
        return;
    }
    
    // Ensure map pin is set
    if (!markerPosition && !manualMode && !sellerLocation) {
        alert("Por favor, marca la ubicación del vehículo en el mapa.");
        return;
    }

    // Double check if using manual mode but empty
    if (manualMode && !sellerLocation) {
        alert("Por favor, ingresa el enlace de ubicación.");
        return;
    }

    const vehicleInfo = { make, model, vin, year, appointmentDate: date, appointmentTime: time };
    localStorage.setItem('vehicleInfo', JSON.stringify(vehicleInfo));

    const sellerInfo = { sellerName, sellerPhone, sellerLocation };
    localStorage.setItem('sellerInfo', JSON.stringify(sellerInfo));

    router.push('/schedule/payment');
  };

  const showMap = isLoaded && !loadError && !mapError && !manualMode;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="absolute top-8 left-8">
        <Link href="/">
          <h1 className="text-5xl font-bold">
            <span style={{ color: '#B8860B' }}>Car</span>
            <span style={{ color: '#FFD700' }}>Check</span>
          </h1>
        </Link>
      </header>
      <main className="w-full max-w-lg bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Datos del Vehículo y Vendedor</h2>
        <form onSubmit={handleSubmit}>
          {/* ... Vehicle Data Fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="make" className="block text-lg font-bold mb-2">Marca</label>
              <select id="make" value={make} onChange={(e) => setMake(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required>
                <option value="" disabled>Selecciona una marca</option>
                {carBrands.sort().map((brandName) => (<option key={brandName} value={brandName}>{brandName}</option>))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="model" className="block text-lg font-bold mb-2">Modelo</label>
              <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required disabled={!make}>
                <option value="" disabled>Selecciona un modelo</option>
                {availableModels.sort().map((modelName) => (<option key={modelName} value={modelName}>{modelName}</option>))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="vin" className="block text-lg font-bold mb-2">VIN (Chasis)</label>
            <input type="text" id="vin" value={vin} onChange={(e) => setVin(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="year" className="block text-lg font-bold mb-2">Año</label>
            <input type="number" id="year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
            
            {/* Error / Recommendation Display */}
            {packageError && (
                <div className="mt-2 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm flex items-start gap-2">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <div>
                        <p>{packageError}</p>
                        <Link href="/schedule/package" className="underline font-bold mt-1 block hover:text-white">
                            Cambiar Paquete
                        </Link>
                    </div>
                </div>
            )}
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-center">Información de la Cita</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="date" className="block text-lg font-bold mb-2">Fecha</label>
              <input type="date" id="date" value={date} onChange={handleDateChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
              {isSunday && <p className="text-sm text-red-500 mt-2">No se aceptan citas los domingos.</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block text-lg font-bold mb-2">Hora</label>
              <select id="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required disabled={isSunday || !date}>
                  <option value="" disabled>Selecciona una hora</option>
                  {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-center">Información del Vendedor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="sellerName" className="block text-lg font-bold mb-2">Nombre del Vendedor</label>
              <input type="text" id="sellerName" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="sellerPhone" className="block text-lg font-bold mb-2">Teléfono del Vendedor</label>
              <input type="tel" id="sellerPhone" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
            </div>
          </div>

          <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                  <label className="text-lg font-bold flex items-center gap-2">
                      <MapPin size={20} className="text-yellow-400" /> 
                      Ubicación del Vehículo
                  </label>
                  
                  {/* Manual Mode Toggle */}
                  <button 
                    type="button" 
                    onClick={() => setManualMode(!manualMode)}
                    className="text-xs text-yellow-500 hover:text-yellow-400 underline flex items-center gap-1"
                  >
                    {manualMode ? (
                        <><MapIcon size={12}/> Mostrar Mapa</>
                    ) : (
                        <><AlertTriangle size={12}/> Ingresar manualmente</>
                    )}
                  </button>
              </div>
              
              <div className="bg-gray-800 p-1 rounded-lg border border-gray-700 overflow-hidden relative transition-all">
                  
                  {/* --- MAP VIEW --- */}
                  {showMap && (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter}
                        zoom={15}
                        onLoad={onLoadMap}
                        onClick={handleMapClick}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            styles: [
                                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                                { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                                { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                                { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                            ]
                        }}
                    >
                        {markerPosition && <Marker position={markerPosition} />}
                    </GoogleMap>
                  )}

                  {/* --- FALLBACK / LOADING / MANUAL UI --- */}
                  {!showMap && (
                      <div className="bg-gray-800 p-6 flex flex-col items-center justify-center text-center animate-fadeIn" style={{ height: '350px' }}>
                           
                           {/* Loading State */}
                           {!isLoaded && !loadError && (
                               <div className="text-gray-400">Cargando mapa...</div>
                           )}

                           {/* Error State */}
                           {(loadError || mapError) && (
                               <div className="mb-4 text-yellow-500 flex flex-col items-center">
                                   <AlertTriangle size={30} />
                                   <span className="text-xs mt-1">
                                       {!apiKey ? "Falta API Key de Google Maps" : "No se pudo cargar el mapa"}
                                   </span>
                               </div>
                           )}
                           
                           {/* Manual Input Form */}
                           {(manualMode || loadError || mapError) && (
                               <div className="w-full mt-2">
                                   <button 
                                        type="button" 
                                        onClick={handleGetLocation}
                                        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors mb-6 shadow-lg"
                                        id="getLocationBtnFallback"
                                    >
                                        <Navigation size={18} />
                                        Obtener mi ubicación GPS
                                    </button>
                                   
                                   <input 
                                        type="url" 
                                        value={sellerLocation} 
                                        onChange={(e) => setSellerLocation(e.target.value)} 
                                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm" 
                                        placeholder="Pegar enlace de Google Maps..."
                                   />
                               </div>
                           )}
                      </div>
                  )}

                  {/* Floating GPS Button (Only show if map is visible) */}
                  {showMap && (
                      <button 
                        id="getLocationBtn"
                        type="button" 
                        onClick={handleGetLocation}
                        className="absolute bottom-4 right-4 bg-yellow-500 text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition-transform hover:scale-110 z-10"
                        title="Usar mi ubicación actual"
                      >
                        <Navigation size={24} />
                      </button>
                  )}
              </div>

              {/* Hidden input to ensure value is captured */}
              <input type="hidden" value={sellerLocation} required />
              
              {/* Show error if tried submitting without location */}
              {!sellerLocation && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle size={14}/> Debes seleccionar la ubicación en el mapa
                  </p>
              )}
              
              {sellerLocation && (
                  <p className="mt-2 text-xs text-green-400 flex items-center gap-1 font-bold bg-green-900/30 p-2 rounded border border-green-900/50">
                      <MapPin size={14}/> ¡Ubicación guardada correctamente!
                  </p>
              )}
          </div>

          <div className="flex justify-between mt-8">
            <Link href="/schedule/personal-info" className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              Atrás
            </Link>
            <button 
                type="submit" 
                disabled={!sellerLocation || !!packageError} 
                className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default VehicleInfoPage;
