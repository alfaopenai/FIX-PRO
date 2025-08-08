import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Truck, User } from "lucide-react";

export default function OperationDetails({ selectedDelivery }) {
  if (!selectedDelivery) {
    return (
      <Card className="bg-gray-800 border border-gray-700 rounded-lg">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-gray-500">
            <Truck className="w-12 h-12 mx-auto mb-2" />
            <p>בחר משלוח לצפייה בפרטים</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border border-gray-700 rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white flex items-center justify-between">
          פרטי המשלוח
          <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
            {selectedDelivery.delivery_id}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Driver Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{selectedDelivery.driver_name}</h3>
            <p className="text-sm text-gray-400">נהג מקצועי</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-medium">{selectedDelivery.vehicle_name}</span>
        </div>

        {/* Route Info */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">מ:</p>
              <p className="text-sm text-white">{selectedDelivery.from_address}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">אל:</p>
              <p className="text-sm text-white">{selectedDelivery.to_address}</p>
            </div>
          </div>
        </div>

        {/* Timing Info */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-gray-400 mb-1">שעות נהיגה</p>
            <p className="text-sm font-medium text-white">{selectedDelivery.driving_hours}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">זמן מנוחה</p>
            <p className="text-sm font-medium text-white">{selectedDelivery.rest_time}</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-400">מרחק</p>
            <p className="text-sm font-medium text-white">{selectedDelivery.distance}</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-400">זמן כולל</p>
            <p className="text-sm font-medium text-white">{selectedDelivery.duration}</p>
          </div>
          
          {selectedDelivery.time_left && (
            <div className="text-center">
              <p className="text-xs text-gray-400">זמן שנותר</p>
              <p className="text-sm font-medium text-orange-400">{selectedDelivery.time_left}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}