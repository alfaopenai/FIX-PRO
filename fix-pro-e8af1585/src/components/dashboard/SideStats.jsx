import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = [
  { name: 'Branch 1', value: 32 },
  { name: 'Branch 2', value: 28 },
  { name: 'Branch 3', value: 40 },
];
const COLORS = ['#A78BFA', '#FBBF24', '#60A5FA'];

const reviews = [
  {
    name: 'Sam Jackson',
    rating: 4.6,
    review: '"Best product I\'ve seen on market, best price and quality."',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
]

export default function SideStats() {
  return (
    <div className="space-y-8">
      {/* Customer Analytics */}
      <Card className="bg-gray-800/50 border border-gray-700/80 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 border-4 border-dashed border-gray-700/50 rounded-full"></div>
        <div className="absolute bottom-[-50px] left-[20px] w-40 h-40 border-4 border-dashed border-gray-700/50 rounded-full"></div>
        
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white relative z-10">ניתוח לקוחות</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="w-full h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-white">
                  100%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-4 text-xs">
            {data.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                    <span className="text-gray-400">{entry.name}</span>
                    <span className="text-white font-medium">{entry.value}%</span>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="bg-gray-800/50 border border-gray-700/80 rounded-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">ביקורות אחרונות</CardTitle>
              <a href="#" className="text-sm text-gray-400 hover:text-white">הצג הכל</a>
          </CardHeader>
          <CardContent>
              {reviews.map((review, index) => (
                  <div key={index} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={review.avatar}/>
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-white">{review.name}</p>
                            <p className="text-xs text-yellow-400">★ {review.rating}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{review.review}</p>
                  </div>
              ))}
          </CardContent>
      </Card>
    </div>
  );
}