import React, { useState, useEffect } from 'react';
import { carsAPI } from '../services/api';

const CarAvailabilityCalendar = ({ carId, onSelectDates, selectedPickup, selectedReturn }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await carsAPI.getAvailability(carId);
        setBookedDates(data.bookedDates || []);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
      setLoading(false);
    };
    fetchAvailability();
  }, [carId]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isDateBooked = (date) => {
    return bookedDates.some(b => {
      const start = new Date(b.start);
      const end = new Date(b.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    });
  };

  const isPastDate = (date) => date < today;

  const isDateSelected = (date) => {
    if (!selectedPickup || !selectedReturn) return false;
    const pickup = new Date(selectedPickup);
    const ret = new Date(selectedReturn);
    pickup.setHours(0, 0, 0, 0);
    ret.setHours(0, 0, 0, 0);
    return date.getTime() === pickup.getTime() || date.getTime() === ret.getTime();
  };

  const isInRange = (date) => {
    if (!selectedPickup || !selectedReturn) return false;
    const pickup = new Date(selectedPickup);
    const ret = new Date(selectedReturn);
    pickup.setHours(0, 0, 0, 0);
    ret.setHours(0, 0, 0, 0);
    return date > pickup && date < ret;
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);
    if (isPastDate(clickedDate) || isDateBooked(clickedDate)) return;
    if (onSelectDates) onSelectDates(clickedDate);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const booked = isDateBooked(date);
    const past = isPastDate(date);
    const selected = isDateSelected(date);
    const inRange = isInRange(date);

    let bgClass = 'hover:bg-primary-100 cursor-pointer';
    if (booked) bgClass = 'bg-red-100 text-red-500 cursor-not-allowed line-through';
    else if (past) bgClass = 'text-gray-300 cursor-not-allowed';
    else if (selected) bgClass = 'bg-primary-600 text-white font-bold';
    else if (inRange) bgClass = 'bg-primary-50';

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={booked || past}
        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${bgClass}`}
      >
        {day}
      </button>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h4 className="font-semibold text-gray-800">{monthNames[month]} {year}</h4>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-primary-600 rounded"></span> Selected</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded"></span> Booked</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-primary-50 rounded"></span> In Range</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded"></span> Available</div>
      </div>
    </div>
  );
};

export default CarAvailabilityCalendar;
