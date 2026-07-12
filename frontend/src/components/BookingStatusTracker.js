import React from 'react';

const steps = ['Booked', 'Confirmed', 'Driver Assigned', 'In Progress', 'Completed'];

const BookingStatusTracker = ({ timeline = [], currentStatus }) => {
  const getCompletedSteps = () => {
    const completed = new Set();
    if (timeline && timeline.length > 0) {
      timeline.forEach(t => {
        if (t.completed) completed.add(t.step);
      });
    }
    if (currentStatus) {
      const statusMap = {
        pending: ['Booked'],
        confirmed: ['Booked', 'Confirmed'],
        completed: ['Booked', 'Confirmed', 'In Progress', 'Completed'],
        cancelled: ['Booked'],
      };
      (statusMap[currentStatus] || []).forEach(s => completed.add(s));
    }
    return completed;
  };

  const completedSteps = getCompletedSteps();

  const getTimestamp = (step) => {
    const entry = timeline?.find(t => t.step === step);
    return entry ? new Date(entry.timestamp) : null;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Live Booking Status
      </h4>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step);
            const ts = getTimestamp(step);
            const isCurrent = currentStatus === 'pending' && step === 'Booked' ||
              currentStatus === 'confirmed' && step === 'Confirmed' ||
              currentStatus === 'completed' && step === 'Completed';
            return (
              <div key={step} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-md'
                    : isCurrent
                    ? 'bg-primary-500 text-white shadow-md animate-pulse'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{step}</p>
                  {ts && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ts.toLocaleDateString()} {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingStatusTracker;
