'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [isSunday, setIsSunday] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const router = useRouter();

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
    }
  }, []);

  useEffect(() => {
    if (make) {
      setAvailableModels(carModels[make] || []);
    } else {
      setAvailableModels([]);
    }
  }, [make]);

  useEffect(() => {
    const selectedPackageStr = localStorage.getItem('selectedPackage');
    if (selectedPackageStr && year) {
      const selectedPackage = JSON.parse(selectedPackageStr);
      const vehicleYear = parseInt(year, 10);

      if (vehicleYear >= 2020 && (selectedPackage.name === 'Core' || selectedPackage.name === 'CarCheck Plus')) {
        setRecommendation(`Para su vehículo del año ${vehicleYear}, se recomienda el paquete 'Pro' para un diagnóstico más completo.`);
      } else if (vehicleYear < 2020 && selectedPackage.name === 'Pro') {
        setRecommendation(`El paquete 'Pro' está optimizado para vehículos del 2020 en adelante. Los paquetes 'Core' o 'CarCheck Plus' pueden ser suficientes para su vehículo.`);
      } else {
        setRecommendation('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSunday) {
        alert("No se pueden programar citas los domingos. Por favor, elija otro día.");
        return;
    }
    
    const vehicleInfo = { make, model, vin, year, appointmentDate: date, appointmentTime: time };
    localStorage.setItem('vehicleInfo', JSON.stringify(vehicleInfo));

    const sellerInfo = { sellerName, sellerPhone };
    localStorage.setItem('sellerInfo', JSON.stringify(sellerInfo));

    router.push('/schedule/payment');
  };

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
            {recommendation && <p className="text-sm text-yellow-400 mt-2">{recommendation}</p>}
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

          <div className="flex justify-between mt-8">
            <Link href="/schedule/personal-info" className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              Atrás
            </Link>
            <button type="submit" className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
              Siguiente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default VehicleInfoPage;
