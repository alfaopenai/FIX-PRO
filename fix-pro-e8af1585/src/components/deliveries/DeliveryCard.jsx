import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck } from "lucide-react";

export default function DeliveryCard({ delivery, isSelected, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      case 'idle': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card 
      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-750 ${
        isSelected ? 'border-orange-500 bg-gray-750' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          <Truck className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(delivery.status)}`}></div>
            <span className="text-sm font-medium text-orange-400">{delivery.vehicle_name}</span>
          </div>
          
          <div className="text-xs text-gray-400 mb-1">
            {delivery.delivery_id}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{delivery.from_address}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-300">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{delivery.to_address}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>{delivery.distance}</span>
            <span>{delivery.duration}</span>
            {delivery.time_left && (
              <span className="text-orange-400">{delivery.time_left}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}