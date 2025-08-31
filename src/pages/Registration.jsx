import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SwitchRTL } from '@/components/ui/switch-rtl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User, UserCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Calendar, MapPin } from 'lucide-react';

export default function Registration() {
  const [userType, setUserType] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    address: '',
    profession: '' // רק לנותני שירות
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // נקה שגיאה עבור השדה הזה
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'נדרש שם מלא';
    }
    
    if (!formData.email) {
      newErrors.email = 'נדרש כתובת אימייל';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    
    if (!formData.password) {
      newErrors.password = 'נדרשת סיסמה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }
    
    if (!formData.age) {
      newErrors.age = 'נדרש גיל';
    } else if (isNaN(formData.age) || formData.age < 16 || formData.age > 120) {
      newErrors.age = 'גיל חייב להיות בין 16 ל-120';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'נדרש לבחור מין';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'נדרש כתובת מלאה';
    }
    
    if (userType === 'service_provider' && !formData.profession.trim()) {
      newErrors.profession = 'נדרש להזין מקצוע/התמחות';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const userData = {
        name: formData.fullName,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender,
        address: formData.address,
        profession: userType === 'service_provider' ? formData.profession : null
      };
      
      const result = await register(userData, userType);
      
      if (result.success) {
        // ניתוב לפי סוג המשתמש
        if (userType === 'client') {
          navigate(createPageUrl('Marketplace'));
        } else {
          navigate(createPageUrl('ServiceProviderDashboard'));
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'שגיאה לא צפויה' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                הרשמה למערכת
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                צור חשבון חדש ובחר את סוג המשתמש
              </CardDescription>
            </div>
            
            {/* מתג לבחירת סוג משתמש */}
            <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
              <Label className="text-white font-medium text-center block">סוג המשתמש</Label>
              <div className="flex items-center justify-between gap-3">
                <div 
                  className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg transition-all flex-1 justify-center ${
                    userType === 'client' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                  onClick={() => setUserType('client')}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">לקוח</span>
                </div>
                
                <div className="flex items-center justify-center p-2">
                  <SwitchRTL
                    checked={userType === 'service_provider'}
                    onCheckedChange={(checked) => setUserType(checked ? 'service_provider' : 'client')}
                    className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-gray-600 scale-110"
                  />
                </div>
                
                <div 
                  className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-lg transition-all flex-1 justify-center ${
                    userType === 'service_provider' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                  onClick={() => setUserType('service_provider')}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="font-medium">נותן שירות</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* שם מלא */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">שם מלא</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="השם המלא שלך"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName}</p>}
              </div>

              {/* כתובת אימייל */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">כתובת אימייל</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                    dir="ltr"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              {/* סיסמה */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">סיסמה</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="לפחות 6 תווים"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-10 pr-10 focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              {/* גיל */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-white">גיל</Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="הגיל שלך"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500"
                    min="16"
                    max="120"
                  />
                </div>
                {errors.age && <p className="text-red-400 text-sm">{errors.age}</p>}
              </div>

              {/* מין */}
              <div className="space-y-2">
                <Label className="text-white">מין</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500">
                    <SelectValue placeholder="בחר מין" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">זכר</SelectItem>
                    <SelectItem value="female">נקבה</SelectItem>
                    <SelectItem value="other">אחר</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-400 text-sm">{errors.gender}</p>}
              </div>

              {/* כתובת מגורים */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">כתובת מגורים</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="רחוב, מספר בית, עיר, מיקוד"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white pl-3 pr-10 focus:border-cyan-500 min-h-[80px]"
                    rows={3}
                  />
                </div>
                {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
              </div>

              {/* מקצוע - רק לנותני שירות */}
              {userType === 'service_provider' && (
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-white">מקצוע/התמחות</Label>
                  <Input
                    id="profession"
                    name="profession"
                    type="text"
                    placeholder="למשל: טכנאי מחשבים, חשמלאי, אינסטלטור"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500"
                  />
                  {errors.profession && <p className="text-red-400 text-sm">{errors.profession}</p>}
                </div>
              )}

              {errors.general && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* כפתור הרשמה */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? 'נרשם...' : 'הירשם למערכת'}
                {!isLoading && <ArrowRight className="w-4 h-4 mr-2" />}
              </Button>

              {/* חזרה להתחברות */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate(createPageUrl('Auth'))}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  יש לך כבר חשבון? התחבר כאן
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 