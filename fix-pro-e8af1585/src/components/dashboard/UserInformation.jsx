import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Apple,
  Briefcase,
  Smartphone
} from "lucide-react"

const trendingItems = [
  {
    name: 'Apple iPhone 13 256Gb',
    stock: 'in stock > 1540',
    category: 'Smartphones',
    price: 156540,
    icon: Smartphone
  },
  {
    name: 'Google Pixel Buds',
    stock: 'in stock > 2320',
    category: 'Accessories',
    price: 132400,
    icon: Apple
  },
];

export default function UserInformation() {
  return (
    <Card className="bg-gray-800/50 border border-gray-700/80 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">פריטים פופולריים</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <item.icon className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.stock}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">₪{item.price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}