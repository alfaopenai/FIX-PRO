import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { User } from "@/api/entities";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    full_name: "Jack Marley",
    email: "jack.marley@company.com",
    phone: "050-1234567",
    company: "חברת השירותים המקצועית",
    address: "רחוב הרצל 15, תל אביב",
    bio: "מנהל מכירות מנוסה עם למעלה מ-10 שנות ניסיון"
  });

  const handleSave = async () => {
    try {
      await User.updateMyUserData(profile);
      alert("הפרופיל נשמר בהצלחה");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">פרופיל אישי</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" />
            <AvatarFallback>JM</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
            <Camera className="w-4 h-4 mr-2" />
            שנה תמונה
          </Button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" className="text-gray-300">שם מלא</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-300">אימייל</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300">טלפון</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-gray-300">חברה</Label>
            <Input
              id="company"
              value={profile.company}
              onChange={(e) => setProfile({...profile, company: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-gray-300">כתובת</Label>
          <Input
            id="address"
            value={profile.address}
            onChange={(e) => setProfile({...profile, address: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-gray-300">אודות</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          שמור שינויים
        </Button>
      </CardContent>
    </Card>
  );
}