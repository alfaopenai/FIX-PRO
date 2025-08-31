import React, { useState, useEffect } from "react";
import { Delivery, Customer } from "@/api/entities";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Navigation, Phone, MessageCircle, Car, Fuel, Users, DollarSign, Star, Calendar, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripMap from "@/components/map/TripMap";

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [deliveriesData, customersData] = await Promise.all([
        Delivery.list("-created_date"),
        Customer.list()
      ]);
      
      // הוספת נתונים נוספים לדמו
      const enrichedDeliveries = deliveriesData.map(delivery => ({
        ...delivery,
        customer: customersData.find(c => c.id === delivery.customer_id) || { name: 'לקוח לא ידוע' },
        price: Math.floor(Math.random() * 500) + 100,
        duration_minutes: Math.floor(Math.random() * 60) + 15,
        distance_km: Math.floor(Math.random() * 50) + 5,
        rating: (Math.random() * 2 + 3).toFixed(1),
        estimated_arrival: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        driver: `נהג ${Math.floor(Math.random() * 100) + 1}`,
        vehicle: `רכב ${Math.floor(Math.random() * 1000) + 1000}`
      }));
      
      setDeliveries(enrichedDeliveries);
      setCustomers(customersData);
      
      if (enrichedDeliveries.length > 0) {
        setSelectedDelivery(enrichedDeliveries[0]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = delivery.customer?.name?.toLowerCase().includes(searchLower) ||
           delivery.destination?.toLowerCase().includes(searchLower) ||
           delivery.delivery_number?.toLowerCase().includes(searchLower);
    
    const matchesStatus = filterStatus === "all" || delivery.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // חישוב סטטיסטיקות
  const todayTrips = deliveries.filter(d => {
    const today = new Date().toDateString();
    return new Date(d.created_date).toDateString() === today;
  }).length;

  const totalRevenue = deliveries.reduce((sum, d) => sum + (d.price || 0), 0);
  
  const activeTrips = deliveries.filter(d => d.status === 'in_transit').length;
  const completedTrips = deliveries.filter(d => d.status === 'completed').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'in_transit': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'הושלם';
      case 'in_transit': return 'בדרך';
      case 'pending': return 'ממתין';
      default: return 'לא ידוע';
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">ניהול נסיעות</h1>
          <p className="text-gray-400 text-sm">ניהול וניטור נסיעות ללקוחות</p>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="חיפוש נסיעות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className="text-xs"
            >
              הכל
            </Button>
            <Button
              variant={filterStatus === "in_transit" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("in_transit")}
              className="text-xs bg-blue-600 hover:bg-blue-700"
            >
              פעיל
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
              className="text-xs bg-green-600 hover:bg-green-700"
            >
              הושלם
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-white text-lg font-bold">{todayTrips}</div>
              <div className="text-gray-400 text-xs">נסיעות היום</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-white text-lg font-bold">₪{totalRevenue.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">הכנסות</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-blue-400 text-lg font-bold">{activeTrips}</div>
              <div className="text-gray-400 text-xs">פעיל</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-green-400 text-lg font-bold">{completedTrips}</div>
              <div className="text-gray-400 text-xs">הושלם</div>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              onClick={() => setSelectedDelivery(delivery)}
              className={`bg-gray-700 rounded-lg p-4 cursor-pointer border-2 transition-all hover:shadow-lg ${
                selectedDelivery?.id === delivery.id ? 'border-blue-500 bg-gray-650' : 'border-transparent hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm">{delivery.customer?.name}</h3>
                    <Badge 
                      className={`text-xs ${getStatusColor(delivery.status)}`}
                    >
                      {getStatusText(delivery.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">#{delivery.delivery_number}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{delivery.destination || 'יעד לא צוין'}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{delivery.estimated_arrival}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Route className="w-3 h-3" />
                        <span>{delivery.distance_km} ק"מ</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>₪{delivery.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{delivery.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Driver and Vehicle Info */}
              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{delivery.driver}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    <span>{delivery.vehicle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredDeliveries.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">לא נמצאו נסיעות</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Map */}
      <div className="flex-1">
        {/* Map - Full Screen */}
        <TripMap selectedTrip={selectedDelivery} height="100vh" />
      </div>
    </div>
  );
}