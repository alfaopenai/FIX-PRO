import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const data = [
  { month: 'Jan', value: 2000 },
  { month: 'Feb', value: 3500 },
  { month: 'Mar', value: 8000 },
  { month: 'Apr', value: 11861 },
  { month: 'May', value: 9000 },
  { month: 'Jun', value: 7500 },
  { month: 'Jul', value: 8200 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="label text-sm text-white">{`${label} : ₪${payload[0].value.toLocaleString()}`}</p>
        <p className="text-xs text-green-400">+11,861 this month</p>
      </div>
    );
  }
  return null;
};

export default function MarketingChart() {
  return (
    <Card className="bg-gray-800/50 border border-gray-700/80 rounded-2xl shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-white">ניתוח הכנסות</CardTitle>
        <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
          חודשי
          <ChevronDown className="w-4 h-4 mr-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#A0A0A0' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#A0A0A0' }}
                tickFormatter={(value) => `${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(156, 163, 175, 0.3)', strokeDasharray: '3 3' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#EAEAEA"
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUv)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}