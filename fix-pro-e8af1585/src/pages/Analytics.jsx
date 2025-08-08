import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Package, Activity, 
  Calendar, Download, Filter, BarChart3, PieChart, LineChart,
  Clock, Target, Award, AlertCircle, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// נתוני דמו
const revenueData = [
  { month: 'ינואר', revenue: 45000, target: 50000, lastYear: 42000 },
  { month: 'פברואר', revenue: 52000, target: 50000, lastYear: 48000 },
  { month: 'מרץ', revenue: 48000, target: 55000, lastYear: 51000 },
  { month: 'אפריל', revenue: 63000, target: 60000, lastYear: 54000 },
  { month: 'מאי', revenue: 58000, target: 60000, lastYear: 59000 },
  { month: 'יוני', revenue: 71000, target: 65000, lastYear: 62000 },
];

const deliveryStatusData = [
  { name: 'הושלם', value: 342, color: '#10b981' },
  { name: 'בדרך', value: 128, color: '#3b82f6' },
  { name: 'ממתין', value: 45, color: '#f59e0b' },
  { name: 'בוטל', value: 15, color: '#ef4444' },
];

const hourlyActivityData = [
  { hour: '00:00', deliveries: 12, drivers: 3 },
  { hour: '04:00', deliveries: 8, drivers: 2 },
  { hour: '08:00', deliveries: 45, drivers: 12 },
  { hour: '12:00', deliveries: 78, drivers: 18 },
  { hour: '16:00', deliveries: 92, drivers: 22 },
  { hour: '20:00', deliveries: 65, drivers: 15 },
];

const topCustomersData = [
  { name: 'חברת ABC', deliveries: 145, revenue: 87500, trend: 12 },
  { name: 'מפעל XYZ', deliveries: 132, revenue: 79200, trend: -5 },
  { name: 'סופר מרקט הגדול', deliveries: 118, revenue: 71000, trend: 8 },
  { name: 'רשת המזון', deliveries: 98, revenue: 58800, trend: 15 },
  { name: 'חנות הכל', deliveries: 87, revenue: 52200, trend: 0 },
];

const performanceMetrics = [
  { metric: 'זמן משלוח ממוצע', value: '28 דקות', change: -12, status: 'good' },
  { metric: 'דיוק במסירה', value: '96.5%', change: 3.2, status: 'good' },
  { metric: 'ביטולים', value: '2.8%', change: -0.5, status: 'good' },
  { metric: 'שביעות רצון', value: '4.7/5', change: 0.2, status: 'good' },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  // חישוב סטטיסטיקות
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTarget = revenueData.reduce((sum, item) => sum + item.target, 0);
  const targetAchievement = ((totalRevenue / totalTarget) * 100).toFixed(1);
  
  const totalDeliveries = deliveryStatusData.reduce((sum, item) => sum + item.value, 0);
  const successRate = ((deliveryStatusData[0].value / totalDeliveries) * 100).toFixed(1);

  const MetricCard = ({ title, value, change, icon: Icon, color = "blue", subtitle }) => (
    <Card className="bg-gray-800 border-gray-700 p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            {change > 0 ? <ArrowUpRight className="w-4 h-4" /> : change < 0 ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">אנליטיקס</h1>
          <p className="text-gray-400">ניתוח ביצועים ומגמות עסקיות</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">שבוע אחרון</SelectItem>
              <SelectItem value="month">חודש אחרון</SelectItem>
              <SelectItem value="quarter">רבעון אחרון</SelectItem>
              <SelectItem value="year">שנה אחרונה</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Filter className="w-4 h-4 ml-2" />
            סינון
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 ml-2" />
            ייצוא דוח
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="הכנסות כוללות"
          value={`₪${totalRevenue.toLocaleString()}`}
          change={15.3}
          icon={DollarSign}
          color="green"
          subtitle="מתחילת החודש"
        />
        <MetricCard
          title="סך משלוחים"
          value={totalDeliveries.toLocaleString()}
          change={8.7}
          icon={Package}
          color="blue"
          subtitle={`${successRate}% הצלחה`}
        />
        <MetricCard
          title="לקוחות פעילים"
          value="248"
          change={12.1}
          icon={Users}
          color="purple"
          subtitle="גידול של 28 לקוחות"
        />
        <MetricCard
          title="יעילות תפעולית"
          value="94.2%"
          change={3.5}
          icon={Activity}
          color="orange"
          subtitle="שיפור מהחודש שעבר"
        />
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-gray-700">הכנסות</TabsTrigger>
          <TabsTrigger value="deliveries" className="data-[state=active]:bg-gray-700">משלוחים</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700">ביצועים</TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-gray-700">לקוחות</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2 bg-gray-800 border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">מגמת הכנסות</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400">השנה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-400">שנה שעברה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400">יעד</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Line type="monotone" dataKey="lastYear" stroke="#6b7280" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">השגת יעד</p>
                    <p className="text-2xl font-bold text-white">{targetAchievement}%</p>
                  </div>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: `${targetAchievement}%` }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Delivery Status */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">סטטוס משלוחים</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={deliveryStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deliveryStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {deliveryStatusData.map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-400 text-sm">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Hourly Activity */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">פעילות לפי שעות</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="deliveries" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="drivers" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">מדדי ביצועים</h3>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{metric.value}</span>
                        <div className={`flex items-center gap-1 text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {metric.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${metric.status === 'good' ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${parseFloat(metric.value) > 5 ? (parseFloat(metric.value) / 100) * 100 : parseFloat(metric.value) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">לקוחות מובילים</h3>
              <Badge className="bg-blue-600 text-white">Top 5</Badge>
            </div>
            <div className="space-y-4">
              {topCustomersData.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{customer.name}</h4>
                      <p className="text-gray-400 text-sm">{customer.deliveries} משלוחים</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₪{customer.revenue.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm ${customer.trend > 0 ? 'text-green-500' : customer.trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {customer.trend > 0 ? <TrendingUp className="w-3 h-3" /> : customer.trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      <span>{Math.abs(customer.trend)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">יעד חודשי</p>
              <p className="text-2xl font-bold text-white">₪350,000</p>
              <div className="w-full h-1 bg-gray-700 rounded-full mt-2">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">דירוג שביעות רצון</p>
              <p className="text-2xl font-bold text-white">4.8/5.0</p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className={`w-4 h-4 ${star <= 4.8 ? 'text-yellow-500' : 'text-gray-600'}`}>★</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">זמן תגובה ממוצע</p>
              <p className="text-2xl font-bold text-white">12 דקות</p>
              <p className="text-xs text-green-500 mt-1">שיפור של 18% מהחודש שעבר</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}