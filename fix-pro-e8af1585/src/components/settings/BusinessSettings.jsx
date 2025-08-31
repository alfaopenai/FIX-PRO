import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Save, MapPin, Clock } from "lucide-react";

export default function BusinessSettings() {
  const [business, setBusiness] = useState({
    company_name: "חברת השירותים המקצועית",
    business_type: "electrical",
    license_number: "123456789",
    tax_id: "987654321",
    address: "רחוב הרצל 15, תל אביב",
    phone: "03-1234567",
    email: "info@company.co.il",
    website: "www.company.co.il",
    description: "חברה מקצועית לשירותי חשמל ואינסטלציה",
    work_hours_start: "08:00",
    work_hours_end: "18:00",
    work_days: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
    service_area: "גוש דן ומרכז הארץ"
  });

  const handleSave = () => {
    // Save business settings
    alert("הגדרות העסק נשמרו בהצלחה");
  };

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          הגדרות עסק
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company_name" className="text-gray-300">שם החברה</Label>
            <Input
              id="company_name"
              value={business.company_name}
              onChange={(e) => setBusiness({...business, company_name: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="business_type" className="text-gray-300">סוג עסק</Label>
            <Select value={business.business_type} onValueChange={(value) => setBusiness({...business, business_type: value})}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="electrical">שירותי חשמל</SelectItem>
                <SelectItem value="plumbing">שירותי אינסטלציה</SelectItem>
                <SelectItem value="air_conditioning">מיזוג אוויר</SelectItem>
                <SelectItem value="general_repair">תיקונים כלליים</SelectItem>
                <SelectItem value="installation">התקנות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="license_number" className="text-gray-300">מספר רישיון</Label>
            <Input
              id="license_number"
              value={business.license_number}
              onChange={(e) => setBusiness({...business, license_number: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="tax_id" className="text-gray-300">ח.פ / ע.מ</Label>
            <Input
              id="tax_id"
              value={business.tax_id}
              onChange={(e) => setBusiness({...business, tax_id: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            פרטי קשר
          </h3>
          
          <div>
            <Label htmlFor="address" className="text-gray-300">כתובת</Label>
            <Input
              id="address"
              value={business.address}
              onChange={(e) => setBusiness({...business, address: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-300">טלפון</Label>
              <Input
                id="phone"
                value={business.phone}
                onChange={(e) => setBusiness({...business, phone: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={business.email}
                onChange={(e) => setBusiness({...business, email: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website" className="text-gray-300">אתר אינטרנט</Label>
            <Input
              id="website"
              value={business.website}
              onChange={(e) => setBusiness({...business, website: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Business Description */}
        <div>
          <Label htmlFor="description" className="text-gray-300">תיאור העסק</Label>
          <Textarea
            id="description"
            value={business.description}
            onChange={(e) => setBusiness({...business, description: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            rows={3}
          />
        </div>

        {/* Working Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4" />
            שעות עבודה
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="work_hours_start" className="text-gray-300">שעת התחלה</Label>
              <Input
                id="work_hours_start"
                type="time"
                value={business.work_hours_start}
                onChange={(e) => setBusiness({...business, work_hours_start: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="work_hours_end" className="text-gray-300">שעת סיום</Label>
              <Input
                id="work_hours_end"
                type="time"
                value={business.work_hours_end}
                onChange={(e) => setBusiness({...business, work_hours_end: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Service Area */}
        <div>
          <Label htmlFor="service_area" className="text-gray-300">אזור שירות</Label>
          <Input
            id="service_area"
            value={business.service_area}
            onChange={(e) => setBusiness({...business, service_area: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          שמור הגדרות
        </Button>
      </CardContent>
    </Card>
  );
}