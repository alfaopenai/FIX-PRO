
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonth = new Date(year, month - 1, 0);
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <Card className="bg-gray-800/50 border border-gray-700/80 rounded-2xl shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <div className="flex items-center gap-1">
             <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={() => navigateMonth(1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:bg-gray-700 hover:text-white"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isToday = day.isCurrentMonth && 
                           day.date.getDate() === today.getDate() && 
                           day.date.getMonth() === today.getMonth() && 
                           day.date.getFullYear() === today.getFullYear();
            
            return (
              <div 
                key={index}
                className={`
                  text-center py-2 text-sm rounded-lg hover:bg-gray-700 cursor-pointer transition-colors
                  ${day.isCurrentMonth ? 'text-gray-200' : 'text-gray-600'}
                  ${isToday ? 'bg-gray-200 text-gray-900 font-bold hover:bg-white' : ''}
                `}
              >
                {day.day}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
