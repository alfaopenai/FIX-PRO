import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email_orders: true,
    email_messages: true,
    push_orders: false,
    push_messages: true,
    sms_urgent: true,
    email_frequency: "immediate",
    quiet_hours: true
  });

  const updateNotification = (key, value) => {
    setNotifications({...notifications, [key]: value});
  };

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          הגדרות התראות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4" />
            התראות אימייל
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_orders" className="text-gray-300">הזמנות חדשות</Label>
              <Switch
                id="email_orders"
                checked={notifications.email_orders}
                onCheckedChange={(checked) => updateNotification('email_orders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email_messages" className="text-gray-300">הודעות חדשות</Label>
              <Switch
                id="email_messages"
                checked={notifications.email_messages}
                onCheckedChange={(checked) => updateNotification('email_messages', checked)}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            התראות דחיפה
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="push_orders" className="text-gray-300">הזמנות חדשות</Label>
              <Switch
                id="push_orders"
                checked={notifications.push_orders}
                onCheckedChange={(checked) => updateNotification('push_orders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push_messages" className="text-gray-300">הודעות חדשות</Label>
              <Switch
                id="push_messages"
                checked={notifications.push_messages}
                onCheckedChange={(checked) => updateNotification('push_messages', checked)}
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            הודעות SMS
          </h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sms_urgent" className="text-gray-300">התראות דחופות בלבד</Label>
            <Switch
              id="sms_urgent"
              checked={notifications.sms_urgent}
              onCheckedChange={(checked) => updateNotification('sms_urgent', checked)}
            />
          </div>
        </div>

        {/* Email Frequency */}
        <div className="space-y-2">
          <Label className="text-gray-300">תדירות אימיילים</Label>
          <Select value={notifications.email_frequency} onValueChange={(value) => updateNotification('email_frequency', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="immediate">מיידי</SelectItem>
              <SelectItem value="hourly">כל שעה</SelectItem>
              <SelectItem value="daily">יומי</SelectItem>
              <SelectItem value="weekly">שבועי</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quiet Hours */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">שעות שקט</Label>
            <p className="text-sm text-gray-400">22:00 - 07:00</p>
          </div>
          <Switch
            checked={notifications.quiet_hours}
            onCheckedChange={(checked) => updateNotification('quiet_hours', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}