import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AvailabilityCalendar = ({ productId, unavailableDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isUnavailable = unavailableDates.includes(dateStr);
      
      days.push(
        <div 
          key={i} 
          className={`
            p-2 flex items-center justify-center text-sm rounded-md
            ${isUnavailable ? 'text-danger bg-danger/10 line-through opacity-70' : 'text-text hover:bg-subtle cursor-default'}
          `}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-elevated border border-subtle rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-text">Availability</h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-1 rounded-md hover:bg-subtle text-muted hover:text-text transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-md hover:bg-subtle text-muted hover:text-text transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-muted">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderMonth(currentDate)}
      </div>
      
      <div className="mt-6 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-subtle"></div>
          <span className="text-muted">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger/20 border border-danger/50"></div>
          <span className="text-muted">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
