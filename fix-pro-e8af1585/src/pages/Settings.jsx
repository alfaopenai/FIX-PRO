import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  User, Building2, Bell, Shield, Palette, Plug, Settings as SettingsIcon,
  Save, Upload, Camera, Mail, Phone, MapPin, Globe, Truck, Package,
  CreditCard, Download, FileText, Smartphone, Monitor, Moon, Sun,
  Zap, Database, Cloud, Lock, Key, Eye, EyeOff, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, HelpCircle, ExternalLink
} from "lucide-react";
import ProfileSettings from "../components/settings/ProfileSettings";
import BusinessSettings from "../components/settings/BusinessSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("he");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    deliveryUpdates: true,
    marketing: false
  });

  // QuickStats Component
  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <motion.div
        whileHover={{ 
          rotateX: 3, 
          rotateY: -3,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">פרופיל</p>
              <p className="text-lg font-semibold text-white">95% הושלם</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
      
      <motion.div
        whileHover={{ 
          rotateX: 3, 
          rotateY: -3,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">אבטחה</p>
                <p className="text-lg font-semibold text-white">חזק</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        whileHover={{ 
          rotateX: 3, 
          rotateY: -3,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Plug className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">אינטגרציות</p>
                <p className="text-lg font-semibold text-white">3 פעילות</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        whileHover={{ 
          rotateX: 3, 
          rotateY: -3,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">התראות</p>
                <p className="text-lg font-semibold text-white">5 פעילות</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
      <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-500" />
            הגדרות מערכת
          </h1>
          <p className="text-gray-400">נהל את הגדרות החשבון, העסק והמערכת שלך</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Download className="w-4 h-4 ml-2" />
            ייצא הגדרות
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 ml-2" />
            שמור הכל
          </Button>
        </div>
      </div>

      <QuickStats />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800 border border-gray-700 p-1">
          <TabsTrigger 
            value="profile" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">פרופיל</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="business" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">עסק</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">התראות</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">אבטחה</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="appearance" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">מראה</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="integrations" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
          >
            <Plug className="w-4 h-4" />
            <span className="hidden sm:inline">אינטגרציות</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                פרופיל אישי
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-4 ring-blue-500">
                    <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl">דכ</AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold text-white">דני כהן</h3>
                  <p className="text-gray-400">מנהל מערכת ראשי</p>
                  <Badge className="bg-green-600 text-white">פעיל</Badge>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">שם פרטי</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="דני" 
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">שם משפחה</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="כהן" 
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">כתובת אימייל</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue="danny@logistics.co.il" 
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">טלפון</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="phone" 
                      defaultValue="050-1234567" 
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 ml-2" />
                  שמור שינויים
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  איפוס
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                פרטי העסק
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-white">שם החברה</Label>
                  <Input 
                    id="companyName" 
                    defaultValue="חברת הלוגיסטיקה המתקדמת" 
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessId" className="text-white">ח.פ / ע.מ</Label>
                  <Input 
                    id="businessId" 
                    defaultValue="514123456" 
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">כתובת</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="address" 
                      defaultValue="רחוב הלוגיסטיקה 15, תל אביב" 
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white">אתר אינטרנט</Label>
                  <div className="relative">
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="website" 
                      defaultValue="www.logistics.co.il" 
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                  </div>
                </div>
              </div>

              {/* Fleet Information */}
              <div className="bg-gray-750 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  פרטי הצי
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">15</div>
                    <div className="text-sm text-gray-400">משאיות</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">8</div>
                    <div className="text-sm text-gray-400">ואנים</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">25</div>
                    <div className="text-sm text-gray-400">נהגים</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                הגדרות התראות
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Notification Types */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="text-white font-medium">התראות אימייל</h4>
                      <p className="text-sm text-gray-400">קבל עדכונים באימייל</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="text-white font-medium">התראות Push</h4>
                      <p className="text-sm text-gray-400">התראות מיידיות בטלפון</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="text-white font-medium">עדכוני משלוחים</h4>
                      <p className="text-sm text-gray-400">התראות על סטטוס משלוחים</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.deliveryUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, deliveryUpdates: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                הגדרות אבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Security Status */}
              <div className="bg-green-900/30 border border-green-600 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="text-green-400 font-medium">החשבון מאובטח</h4>
                    <p className="text-sm text-green-300">כל הגדרות האבטחה פעילות</p>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  שינוי סיסמה
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">סיסמה נוכחית</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">סיסמה חדשה</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">אישור סיסמה</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  עדכן סיסמה
                </Button>
              </div>

              {/* Two Factor Authentication */}
              <div className="space-y-4">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  אימות דו-שלבי
                </h4>
                <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                  <div>
                    <h5 className="text-white font-medium">Google Authenticator</h5>
                    <p className="text-sm text-gray-400">אבטחה נוספת עם קוד דינמי</p>
                  </div>
                  <Badge className="bg-green-600 text-white">פעיל</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
              <Palette className="w-5 h-5" />
              הגדרות מראה
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Theme Selection */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">עיצוב ערכת נושא</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}`}
                       onClick={() => setTheme('dark')}>
                    <div className="flex items-center gap-3 mb-3">
                      <Moon className="w-5 h-5 text-blue-500" />
                      <span className="text-white font-medium">כהה</span>
                    </div>
                    <div className="bg-gray-900 h-16 rounded border"></div>
                  </div>
                  
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}`}
                       onClick={() => setTheme('light')}>
                    <div className="flex items-center gap-3 mb-3">
                      <Sun className="w-5 h-5 text-yellow-500" />
                      <span className="text-white font-medium">בהיר</span>
                    </div>
                    <div className="bg-white h-16 rounded border"></div>
                  </div>
                  
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${theme === 'auto' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}`}
                       onClick={() => setTheme('auto')}>
                    <div className="flex items-center gap-3 mb-3">
                      <Monitor className="w-5 h-5 text-purple-500" />
                      <span className="text-white font-medium">אוטומטי</span>
                    </div>
                    <div className="bg-gradient-to-r from-gray-900 to-white h-16 rounded border"></div>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">שפה</h4>
                <div className="flex gap-4">
                  <Button 
                    variant={language === 'he' ? 'default' : 'outline'}
                    onClick={() => setLanguage('he')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    עברית
                  </Button>
                  <Button 
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    English
                  </Button>
                </div>
          </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white flex items-center gap-2">
              <Plug className="w-5 h-5" />
                אינטגרציות וחיבורים
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Active Integrations */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">אינטגרציות פעילות</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">API</span>
                      </div>
                      <div>
                        <h5 className="text-white font-medium">Google Maps API</h5>
                        <p className="text-sm text-gray-400">למיפוי ונווט</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">מחובר</Badge>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        הגדר
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="text-white font-medium">מערכת CRM</h5>
                        <p className="text-sm text-gray-400">ניהול לקוחות</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">מחובר</Badge>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        הגדר
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="text-white font-medium">מערכת תשלומים</h5>
                        <p className="text-sm text-gray-400">עיבוד תשלומים</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-600 text-white">ממתין</Badge>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        חבר
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Integrations */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">אינטגרציות זמינות</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Cloud className="w-6 h-6 text-blue-500" />
                      <h5 className="text-white font-medium">AWS Cloud Storage</h5>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">גיבוי ענן מתקדם</p>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 w-full">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      התחבר
                    </Button>
                  </div>

                  <div className="p-4 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="w-6 h-6 text-green-500" />
                      <h5 className="text-white font-medium">Excel Integration</h5>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">ייצוא לאקסל</p>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 w-full">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      התחבר
                    </Button>
                  </div>
                </div>
          </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}