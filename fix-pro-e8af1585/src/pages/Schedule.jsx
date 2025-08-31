import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Truck,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarIcon,
  Target,
  Route
} from "lucide-react";

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // נתוני דמו עשירים לאירועים - מלא יותר
  const demoEvents = [
    // היום - 15 דצמבר
    {
      id: 1,
      title: "משלוח דחוף - חברת ABC",
      description: "משלוח חומרי גלם ומוצרים מוגמרים לתל אביב",
      date: new Date(2024, 11, 15, 8, 0),
      endDate: new Date(2024, 11, 15, 11, 30),
      type: "delivery",
      status: "in_progress",
      priority: "high",
      driver: "דני כהן",
      driverAvatar: "https://i.pravatar.cc/150?img=1",
      vehicle: "משאית M-123-45",
      location: "תל אביב",
      customer: "חברת ABC בע״מ",
      packages: 25,
      route: ["פתח תקווה", "תל אביב", "רמת גן", "בני ברק"],
      estimatedDuration: "3.5 שעות",
      value: "₪45,000"
    },
    {
      id: 2,
      title: "איסוף סחורה - סופר מרקט הגדול",
      description: "איסוף מוצרי מזון קפואים ורעננים",
      date: new Date(2024, 11, 15, 12, 0),
      endDate: new Date(2024, 11, 15, 14, 30),
      type: "pickup",
      status: "scheduled",
      priority: "medium",
      driver: "שרה לוי",
      driverAvatar: "https://i.pravatar.cc/150?img=2",
      vehicle: "משאית קירור R-567-89",
      location: "חיפה",
      customer: "סופר מרקט הגדול",
      packages: 18,
      route: ["חיפה", "נהריה", "עכו", "קריות"],
      estimatedDuration: "2.5 שעות",
      value: "₪28,500"
    },
    {
      id: 3,
      title: "פגישת מכירות - רשת הפרמציות",
      description: "הצגת שירותי משלוח תרופות חדשים",
      date: new Date(2024, 11, 15, 15, 0),
      endDate: new Date(2024, 11, 15, 16, 30),
      type: "meeting",
      status: "scheduled",
      priority: "high",
      driver: "מיכל רוזן",
      driverAvatar: "https://i.pravatar.cc/150?img=3",
      location: "תל אביב",
      customer: "רשת הפרמציות",
      estimatedDuration: "1.5 שעות",
      value: "₪120,000 פוטנציאל"
    },
    {
      id: 4,
      title: "משלוח אקספרס - חדשות 13",
      description: "משלוח ציוד טכני דחוף לסטודיו",
      date: new Date(2024, 11, 15, 17, 0),
      endDate: new Date(2024, 11, 15, 18, 30),
      type: "delivery",
      status: "scheduled",
      priority: "urgent",
      driver: "אבי ישראל",
      driverAvatar: "https://i.pravatar.cc/150?img=4",
      vehicle: "ואן אקספרס E-111-22",
      location: "רמת השרון",
      customer: "חדשות 13",
      packages: 5,
      route: ["תל אביב", "רמת השרון"],
      estimatedDuration: "1.5 שעות",
      value: "₪8,500"
    },

    // מחר - 16 דצמבר
    {
      id: 5,
      title: "תחזוקת צי כלי רכב",
      description: "בדיקה שגרתית ותחזוקה למשאיות",
      date: new Date(2024, 11, 16, 7, 0),
      endDate: new Date(2024, 11, 16, 12, 0),
      type: "maintenance",
      status: "scheduled",
      priority: "medium",
      vehicle: "משאיות M-123-45, M-456-78, M-789-01",
      location: "מוסך הדרך הראשי",
      estimatedDuration: "5 שעות",
      technician: "יוסי הטכנאי"
    },
    {
      id: 6,
      title: "משלוח בינלאומי - נמל אשדוד",
      description: "איסוף מכולות ומשלוח לצפון",
      date: new Date(2024, 11, 16, 9, 0),
      endDate: new Date(2024, 11, 16, 15, 0),
      type: "delivery",
      status: "scheduled",
      priority: "high",
      driver: "רינה דוד",
      driverAvatar: "https://i.pravatar.cc/150?img=5",
      vehicle: "משאית כבדה H-987-65",
      location: "אשדוד → חיפה",
      customer: "חברת הייבוא הישראלית",
      packages: 3,
      route: ["נמל אשדוד", "ראשון לציון", "נתניה", "חיפה"],
      estimatedDuration: "6 שעות",
      value: "₪75,000"
    },
    {
      id: 7,
      title: "פגישת תכנון - עיריית ירושלים",
      description: "דיון על שירותי משלוח עירוניים",
      date: new Date(2024, 11, 16, 14, 0),
      endDate: new Date(2024, 11, 16, 15, 30),
      type: "meeting",
      status: "scheduled",
      priority: "high",
      location: "עיריית ירושלים",
      customer: "עיריית ירושלים",
      estimatedDuration: "1.5 שעות",
      value: "₪500,000 פוטנציאל"
    },

    // 17 דצמבר
    {
      id: 8,
      title: "הדרכת בטיחות חדשה",
      description: "הדרכה על תקנות בטיחות חדשות",
      date: new Date(2024, 11, 17, 8, 0),
      endDate: new Date(2024, 11, 17, 12, 0),
      type: "training",
      status: "scheduled",
      priority: "medium",
      trainer: "מומחה בטיחות חיצוני",
      location: "אולם הדרכות - משרד ראשי",
      participants: "כל הנהגים",
      estimatedDuration: "4 שעות"
    },
    {
      id: 9,
      title: "משלוח מזון חירום - מדא",
      description: "משלוח אספקה רפואית דחופה",
      date: new Date(2024, 11, 17, 13, 0),
      endDate: new Date(2024, 11, 17, 14, 30),
      type: "delivery",
      status: "scheduled",
      priority: "urgent",
      driver: "דני כהן",
      driverAvatar: "https://i.pravatar.cc/150?img=1",
      vehicle: "אמבולנס לוגיסטי A-555-55",
      location: "בתי חולים בארץ",
      customer: "מדא",
      packages: 12,
      route: ["רמבם", "בילינסון", "אסותא"],
      estimatedDuration: "1.5 שעות",
      value: "₪15,000"
    },
    {
      id: 10,
      title: "איסוף חבילות אמזון",
      description: "איסוף יומי ממרכז החלוקה",
      date: new Date(2024, 11, 17, 16, 0),
      endDate: new Date(2024, 11, 17, 19, 0),
      type: "pickup",
      status: "scheduled",
      priority: "medium",
      driver: "שרה לוי",
      driverAvatar: "https://i.pravatar.cc/150?img=2",
      vehicle: "ואן חלוקה D-333-44",
      location: "מודיעין → כל הארץ",
      customer: "אמזון ישראל",
      packages: 150,
      route: ["מודיעין", "ירושלים", "תל אביב", "חיפה"],
      estimatedDuration: "3 שעות",
      value: "₪22,000"
    },

    // 18 דצמבר
    {
      id: 11,
      title: "משלוח לאירוע חתונה",
      description: "משלוח ציוד ואוכל לאולם אירועים",
      date: new Date(2024, 11, 18, 10, 0),
      endDate: new Date(2024, 11, 18, 13, 0),
      type: "delivery",
      status: "scheduled",
      priority: "high",
      driver: "מיכל רוזן",
      driverAvatar: "https://i.pravatar.cc/150?img=3",
      vehicle: "משאית אירועים E-777-88",
      location: "אולם אירועים הגן",
      customer: "משפחת כהן",
      packages: 30,
      route: ["תל אביב", "רעננה", "הרצליה"],
      estimatedDuration: "3 שעות",
      value: "₪18,000"
    },
    {
      id: 12,
      title: "ביקורת איכות - משרד התחבורה",
      description: "ביקורת שגרתית על רישיונות ובטיחות",
      date: new Date(2024, 11, 18, 14, 0),
      endDate: new Date(2024, 11, 18, 17, 0),
      type: "meeting",
      status: "scheduled",
      priority: "high",
      location: "משרד התחבורה",
      customer: "משרד התחבורה",
      estimatedDuration: "3 שעות",
      inspector: "פקח ממשלתי"
    },

    // 19 דצמבר
    {
      id: 13,
      title: "משלוח לבתי ספר",
      description: "משלוח ציוד לימוד וספרים",
      date: new Date(2024, 11, 19, 8, 0),
      endDate: new Date(2024, 11, 19, 12, 0),
      type: "delivery",
      status: "scheduled",
      priority: "medium",
      driver: "אבי ישראל",
      driverAvatar: "https://i.pravatar.cc/150?img=4",
      vehicle: "משאית חינוך S-123-99",
      location: "בתי ספר במרכז",
      customer: "משרד החינוך",
      packages: 45,
      route: ["פתח תקווה", "רמת גן", "בני ברק", "גבעתיים"],
      estimatedDuration: "4 שעות",
      value: "₪35,000"
    },
    {
      id: 14,
      title: "איסוף רכבים מהליסינג",
      description: "איסוף רכבי ליסינג שהסתיים חוזה",
      date: new Date(2024, 11, 19, 13, 0),
      endDate: new Date(2024, 11, 19, 16, 0),
      type: "pickup",
      status: "scheduled",
      priority: "low",
      driver: "רינה דוד", 
      driverAvatar: "https://i.pravatar.cc/150?img=5",
      vehicle: "גרר רכבים T-456-77",
      location: "חברות ליסינג",
      customer: "אלדן ליסינג",
      packages: 3,
      route: ["תל אביב", "חולון", "באר שבע"],
      estimatedDuration: "3 שעות",
      value: "₪12,000"
    },

    // 20 דצמבר
    {
      id: 15,
      title: "פגישת צוות ניהול",
      description: "ישיבת צוות שבועית וסיכום ביצועים",
      date: new Date(2024, 11, 20, 9, 0),
      endDate: new Date(2024, 11, 20, 11, 0),
      type: "meeting",
      status: "scheduled",
      priority: "medium",
      location: "חדר ישיבות ראשי",
      participants: "כל מנהלי הצוותים",
      estimatedDuration: "2 שעות"
    },
    {
      id: 16,
      title: "משלוח ליעדי צפון",
      description: "משלוח שבועי לגליל ולגולן",
      date: new Date(2024, 11, 20, 12, 0),
      endDate: new Date(2024, 11, 20, 18, 0),
      type: "delivery",
      status: "scheduled",
      priority: "medium",
      driver: "דני כהן",
      driverAvatar: "https://i.pravatar.cc/150?img=1",
      vehicle: "משאית צפון N-888-11",
      location: "צפון ישראל",
      customer: "עסקים בצפון",
      packages: 55,
      route: ["נצרת", "צפת", "קריית שמונה", "מטולה"],
      estimatedDuration: "6 שעות",
      value: "₪42,000"
    },

    // 21 דצמבר
    {
      id: 17,
      title: "תחזוקת מערכות GPS",
      description: "עדכון ותחזוקה של מערכות ניווט",
      date: new Date(2024, 11, 21, 8, 0),
      endDate: new Date(2024, 11, 21, 12, 0),
      type: "maintenance",
      status: "scheduled",
      priority: "medium",
      technician: "טכנאי מערכות",
      location: "כל הרכבים",
      estimatedDuration: "4 שעות"
    },
    {
      id: 18,
      title: "משלוח מיוחד - חג המולד",
      description: "משלוח מתנות ומוצרי חג",
      date: new Date(2024, 11, 21, 14, 0),
      endDate: new Date(2024, 11, 21, 17, 0),
      type: "delivery",
      status: "scheduled",
      priority: "high",
      driver: "שרה לוי",
      driverAvatar: "https://i.pravatar.cc/150?img=2",
      vehicle: "ואן חגים H-999-33",
      location: "ירושלים ובתי שמש",
      customer: "קהילות נוצריות",
      packages: 25,
      route: ["ירושלים", "בית לחם", "בית שמש"],
      estimatedDuration: "3 שעות",
      value: "₪16,500"
    }
  ];

  // Add new event quick-add handler
  const handleAddEvent = () => {
    const title = prompt('כותרת העבודה / האירוע:');
    if (!title) return;
    const dateStr = prompt('תאריך (YYYY-MM-DD):');
    if (!dateStr) return;
    const timeStr = prompt('שעה התחלה (HH:MM):') || '08:00';
    const [y,m,d] = dateStr.split('-').map(Number);
    const [hh,mm] = timeStr.split(':').map(Number);
    const start = new Date(y, m-1, d, hh, mm);
    const newEvent = {
      id: Date.now(),
      title,
      description: '',
      date: start,
      endDate: new Date(start.getTime()+60*60*1000),
      type: 'delivery',
      status: 'scheduled',
      priority: 'medium'
    };
    setEvents(prev => [...prev, newEvent]);
    alert('האירוע נוסף ליומן!');
  };

  // Generate additional random events to fill the current month
  const generateDemoEventsForMonth = (year, month) => {
    const sampleTitles = [
      'משלוח סחורה',
      'איסוף חבילות',
      'פגישת לקוח',
      'בדיקת רכב',
      'הדרכת בטיחות',
      'משלוח אקספרס',
      'טיפול תחזוקה',
      'פגישת צוות',
      'ביקורת איכות',
      'פגישת מכירה'
    ];
    const types = ['delivery', 'pickup', 'meeting', 'maintenance', 'training'];
    const priorities = ['low', 'medium', 'high', 'urgent'];

    const events = [];
    for (let i = 0; i < 50; i++) {
      const day = Math.floor(Math.random() * 28) + 1; // 1-28
      const hour = Math.floor(Math.random() * 9) + 7; // 7-15
      const minute = [0, 15, 30, 45][Math.floor(Math.random()*4)];
      const start = new Date(year, month, day, hour, minute);
      const durationMinutes = 60 + Math.floor(Math.random() * 120); // 1-3 שעות
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
      events.push({
        id: Date.now() + i,
        title: sampleTitles[i % sampleTitles.length],
        description: '',
        date: start,
        endDate: end,
        type: types[i % types.length],
        status: 'scheduled',
        priority: priorities[i % priorities.length]
      });
    }
    return events;
  };

  useEffect(() => {
    // בסיס הדמו הקיים + אירועים אקראיים לחודש הנוכחי
    const generated = generateDemoEventsForMonth(currentDate.getFullYear(), currentDate.getMonth());
    setEvents([...demoEvents, ...generated]);
  }, [currentDate]);

  const getEventTypeConfig = (type) => {
    const config = {
      delivery: { label: "משלוח", color: "bg-blue-600", icon: Truck },
      pickup: { label: "איסוף", color: "bg-green-600", icon: Package },
      meeting: { label: "פגישה", color: "bg-purple-600", icon: Users },
      maintenance: { label: "תחזוקה", color: "bg-orange-600", icon: AlertCircle },
      training: { label: "הדרכה", color: "bg-cyan-600", icon: Target }
    };
    return config[type] || config.delivery;
  };

  const getPriorityConfig = (priority) => {
    const config = {
      urgent: { label: "דחוף מאוד", color: "bg-red-600", textColor: "text-red-600" },
      high: { label: "דחוף", color: "bg-orange-600", textColor: "text-orange-600" },
      medium: { label: "בינוני", color: "bg-yellow-600", textColor: "text-yellow-600" },
      low: { label: "נמוך", color: "bg-gray-600", textColor: "text-gray-600" }
    };
    return config[priority] || config.medium;
  };

  const getStatusConfig = (status) => {
    const config = {
      scheduled: { label: "מתוכנן", color: "bg-blue-600", icon: CalendarIcon },
      in_progress: { label: "בביצוע", color: "bg-green-600", icon: Clock },
      completed: { label: "הושלם", color: "bg-green-700", icon: CheckCircle },
      cancelled: { label: "בוטל", color: "bg-red-600", icon: AlertCircle }
    };
    return config[status] || config.scheduled;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('he-IL', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventsForDay = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.driver?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || event.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const todayEvents = getEventsForDay(new Date());
  const upcomingEvents = events.filter(event => 
    event.date > new Date() && 
    event.date <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).slice(0, 5);

  // חישוב סטטיסטיקות דינמיות
  const activeDeliveries = events.filter(e => e.type === 'delivery' && e.status === 'in_progress').length;
  const urgentEvents = events.filter(e => e.priority === 'urgent' || e.priority === 'high').length;
  const totalWeeklyValue = events
    .filter(e => e.value && e.date >= new Date() && e.date <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .reduce((sum, e) => {
      const numericValue = parseInt(e.value.replace(/[₪,\s]/g, '').split(' ')[0]) || 0;
      return sum + numericValue;
    }, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">לוח זמנים</h1>
          <p className="text-gray-400">ניהול ותכנון משלוחים ואירועים</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Filter className="w-4 h-4 ml-2" />
            סינון
          </Button>
          <Button
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 ml-2" />
            אירוע חדש
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">אירועים היום</p>
              <p className="text-2xl font-bold text-white">{todayEvents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">משלוחים פעילים</p>
              <p className="text-2xl font-bold text-white">{activeDeliveries}</p>
              <p className="text-xs text-gray-500 mt-1">כרגע בדרך</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">אירועים דחופים</p>
              <p className="text-2xl font-bold text-white">{urgentEvents}</p>
              <p className="text-xs text-gray-500 mt-1">דורש תשומת לב</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">ערך שבועי</p>
              <p className="text-2xl font-bold text-white">₪{totalWeeklyValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">השבוע הקרוב</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigateMonth(-1)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigateMonth(1)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2 h-20"></div>;
                  }
                  
                  const dayEvents = getEventsForDay(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 h-20 border rounded cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500' 
                          : isToday 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        isSelected || isToday ? 'text-white' : 'text-gray-300'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayEvents.slice(0, 1).map((event) => {
                          const typeConfig = getEventTypeConfig(event.type);
                          const priorityConfig = getPriorityConfig(event.priority);
                          return (
                            <div
                              key={event.id}
                              className={`text-[11px] px-1.5 py-0.5 rounded-md text-white truncate ${typeConfig.color} hover:scale-105 transition-transform cursor-pointer shadow`}
                              title={`${event.title} - ${formatTime(event.date)}`}
                            >
                              <div className="flex items-center gap-1">
                                {event.priority === 'urgent' && <span className="text-red-300">🔥</span>}
                                {event.status === 'in_progress' && <span className="text-green-300">▶️</span>}
                                <span className="truncate">{event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}</span>
                              </div>
                              <div className="text-xs opacity-75 mt-0.5">
                                {formatTime(event.date)}
                              </div>
                            </div>
                          );
                        })}
                        {dayEvents.length > 1 && (
                          <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded text-center hover:bg-gray-600 cursor-pointer transition-colors">
                            +{dayEvents.length - 3} אירועים
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {/* Search */}
          <Card className="bg-gray-800 border-gray-700 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="חיפוש אירועים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                🔵 הכל
              </Button>
              <Button
                variant={filterType === "delivery" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("delivery")}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                🚛 משלוחים
              </Button>
              <Button
                variant={filterType === "pickup" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("pickup")}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                📦 איסופים
              </Button>
              <Button
                variant={filterType === "meeting" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("meeting")}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                👥 פגישות
              </Button>
              <Button
                variant={filterType === "maintenance" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("maintenance")}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                🔧 תחזוקה
              </Button>
              <Button
                variant={filterType === "training" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("training")}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                🎯 הדרכות
              </Button>
            </div>
          </Card>

          {/* Today's Events */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white text-lg">אירועי היום</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {todayEvents.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">אין אירועים היום</p>
                </div>
              ) : (
                todayEvents.map((event) => {
                  const typeConfig = getEventTypeConfig(event.type);
                  const statusConfig = getStatusConfig(event.status);
                  const priorityConfig = getPriorityConfig(event.priority);
                  const IconComponent = typeConfig.icon;
                  
                  return (
                    <div key={event.id} className="bg-gradient-to-r from-gray-800 to-gray-750 p-4 rounded-xl border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${typeConfig.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-white text-base">{event.title}</h4>
                            <Badge className={`${priorityConfig.color} text-white text-xs px-2 py-1 rounded-full`}>
                              {priorityConfig.label}
                            </Badge>
                            {event.status === 'in_progress' && (
                              <Badge className="bg-green-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                פעיל כעת
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span>{formatTime(event.date)} - {formatTime(event.endDate)}</span>
                            </div>
                            
                            {event.estimatedDuration && (
                              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                                <Target className="w-4 h-4 text-purple-400" />
                                <span>{event.estimatedDuration}</span>
                              </div>
                            )}
                            
                            {event.driver && (
                              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                                <Avatar className="w-5 h-5 ring-2 ring-blue-500">
                                  <AvatarImage src={event.driverAvatar} />
                                  <AvatarFallback className="text-xs bg-blue-600">{event.driver.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{event.driver}</span>
                              </div>
                            )}
                            
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                                <MapPin className="w-4 h-4 text-red-400" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            
                            {event.vehicle && (
                              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                                <Truck className="w-4 h-4 text-yellow-400" />
                                <span>{event.vehicle}</span>
                              </div>
                            )}
                            
                            {event.packages && (
                              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                                <Package className="w-4 h-4 text-green-400" />
                                <span>{event.packages} חבילות</span>
                              </div>
                            )}
                            
                            {event.value && (
                              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/30 px-3 py-2 rounded-lg font-medium">
                                <span>💰</span>
                                <span>{event.value}</span>
                              </div>
                            )}
                            
                            {event.customer && (
                              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                                <Users className="w-4 h-4 text-cyan-400" />
                                <span>{event.customer}</span>
                              </div>
                            )}
                          </div>
                          
                          {event.route && (
                            <div className="bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                <Route className="w-4 h-4 text-orange-400" />
                                <span className="font-medium">מסלול נסיעה:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {event.route.map((stop, index) => (
                                  <span key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                                    {index + 1}. {stop}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white text-lg">אירועים קרובים</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">אין אירועים קרובים</p>
                </div>
              ) : (
                upcomingEvents.map((event) => {
                  const typeConfig = getEventTypeConfig(event.type);
                  const IconComponent = typeConfig.icon;
                  
                  return (
                    <div key={event.id} className="bg-gray-750 p-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${typeConfig.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white text-sm">{event.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(event.date)}</span>
                            <Clock className="w-3 h-3 ml-2" />
                            <span>{formatTime(event.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}