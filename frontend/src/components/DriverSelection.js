import React, { useState, useEffect } from 'react';
import { driversAPI } from '../services/api';

const DriverSelection = ({ onDriverSelect, selectedDriver, bookingId }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data } = await driversAPI.getAvailable();
      if (data.length === 0) {
        await seedDrivers();
      } else {
        setDrivers(data);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
    setLoading(false);
  };

  const seedDrivers = async () => {
    setSeeding(true);
    try {
      await driversAPI.seed();
      const { data } = await driversAPI.getAvailable();
      setDrivers(data);
    } catch (error) {
      console.error('Failed to seed drivers:', error);
    }
    setSeeding(false);
  };

  if (loading || seeding) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        Choose Your Driver
      </h4>
      <div className="space-y-3">
        {drivers.map(driver => (
          <div
            key={driver._id}
            onClick={() => onDriverSelect(driver)}
            className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedDriver?._id === driver._id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <img src={driver.photo || 'https://randomuser.me/api/portraits/men/1.jpg'} alt={driver.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h5 className="font-semibold text-gray-800">{driver.name}</h5>
                {selectedDriver?._id === driver._id && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">Selected</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {driver.rating?.toFixed(1)}
                </span>
                <span>{driver.totalTrips} trips</span>
                <span>{driver.experience}yr exp</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {driver.languages?.slice(0, 3).map(lang => (
                  <span key={lang} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lang}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary-600 font-bold">₹500</p>
              <p className="text-xs text-gray-500">/day</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverSelection;
