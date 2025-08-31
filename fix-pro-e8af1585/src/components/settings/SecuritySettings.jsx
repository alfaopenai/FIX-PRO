import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Smartphone, Eye, EyeOff } from "lucide-react";

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    two_factor: false,
    login_alerts: true,
    session_timeout: "30"
  });

  const handlePasswordChange = () => {
    if (security.new_password !== security.confirm_password) {
      alert("הסיסמאות אינן תואמות");
      return;
    }
    // Handle password change logic
    alert("הסיסמה שונתה בהצלחה");
  };

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          הגדרות אבטחה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Change */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-4 h-4" />
            שינוי סיסמה
          </h3>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="current_password" className="text-gray-300">סיסמה נוכחית</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showPassword ? "text" : "password"}
                  value={security.current_password}
                  onChange={(e) => setSecurity({...security, current_password: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new_password" className="text-gray-300">סיסמה חדשה</Label>
              <Input
                id="new_password"
                type="password"
                value={security.new_password}
                onChange={(e) => setSecurity({...security, new_password: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="confirm_password" className="text-gray-300">אימות סיסמה</Label>
              <Input
                id="confirm_password"
                type="password"
                value={security.confirm_password}
                onChange={(e) => setSecurity({...security, confirm_password: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700">
              שנה סיסמה
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            אימות דו-שלבי
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">הפעל אימות דו-שלבי</Label>
              <p className="text-sm text-gray-400">הגנה נוספת על החשבון שלך</p>
            </div>
            <Switch
              checked={security.two_factor}
              onCheckedChange={(checked) => setSecurity({...security, two_factor: checked})}
            />
          </div>

          {security.two_factor && (
            <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              הגדר אימות דו-שלבי
            </Button>
          )}
        </div>

        {/* Security Alerts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">התראות אבטחה</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300">התראות התחברות</Label>
              <p className="text-sm text-gray-400">קבל התראה על כניסות חדשות</p>
            </div>
            <Switch
              checked={security.login_alerts}
              onCheckedChange={(checked) => setSecurity({...security, login_alerts: checked})}
            />
          </div>
        </div>

        {/* Session Management */}
        <div className="space-y-2">
          <Label className="text-gray-300">תפוגת הפעלה (דקות)</Label>
          <Input
            type="number"
            value={security.session_timeout}
            onChange={(e) => setSecurity({...security, session_timeout: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        {/* Active Sessions */}
        <div className="space-y-2">
          <Label className="text-gray-300">הפעלות פעילות</Label>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white text-sm">Chrome - Windows</p>
                <p className="text-gray-400 text-xs">IP: 192.168.1.1 • כעת</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
                נתק
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}