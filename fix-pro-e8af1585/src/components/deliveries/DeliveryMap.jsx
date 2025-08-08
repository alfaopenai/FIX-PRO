import React from 'react';
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeliveryMap({ selectedDelivery }) {
  return (
    <Card className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden h-96">
      {/* Map Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          {selectedDelivery ? `${selectedDelivery.vehicle_name} - מעקב בזמן אמת` : 'בחר משלוח לצפייה במפה'}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 bg-gray-700 hover:bg-gray-600">
            <Plus className="w-4 h-4 text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 bg-gray-700 hover:bg-gray-600">
            <Minus className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
      
      {/* Map Content */}
      <div className="relative h-full bg-gray-900">
        {selectedDelivery ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            {/* Route Simulation */}
            <div className="relative w-full h-full">
              {/* Start Point */}
              <div className="absolute top-12 left-12 flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-300">התחלה</span>
              </div>
              
              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 50 50 Q 200 100 350 150 Q 400 200 450 250"
                  stroke="#f97316"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
              
              {/* Vehicle Position */}
              <div className="absolute" style={{top: '45%', left: '60%'}}>
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Navigation className="w-3 h-3 text-white" />
                </div>
              </div>
              
              {/* End Point */}
              <div className="absolute bottom-16 right-16 flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-300">יעד</span>
              </div>
              
              {/* Route Info */}
              <div className="absolute bottom-4 left-4 bg-gray-800/90 rounded-lg p-3">
                <div className="text-xs text-gray-300 mb-1">מרחק כולל</div>
                <div className="text-sm font-medium text-white">{selectedDelivery.distance}</div>
                <div className="text-xs text-orange-400 mt-1">{selectedDelivery.time_left} נותר</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-600" />
              <p>בחר משלוח לצפייה במפה</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}