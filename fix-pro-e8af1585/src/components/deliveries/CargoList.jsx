import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CargoList({ cargoItems, selectedDelivery }) {
  const deliveryItems = cargoItems.filter(item => 
    selectedDelivery && item.delivery_id === selectedDelivery.id
  );

  return (
    <Card className="bg-gray-800 border border-gray-700 rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            רשימת מטען
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {deliveryItems.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400 text-xs">קוד מטען</TableHead>
                  <TableHead className="text-gray-400 text-xs">משקל</TableHead>
                  <TableHead className="text-gray-400 text-xs">נפח</TableHead>
                  <TableHead className="text-gray-400 text-xs">מיקום</TableHead>
                  <TableHead className="text-gray-400 text-xs">יעד</TableHead>
                  <TableHead className="text-gray-400 text-xs">סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryItems.map((item) => (
                  <TableRow key={item.id} className="border-gray-700 hover:bg-gray-750">
                    <TableCell className="text-sm text-white font-medium">{item.cargo_code}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.weight}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.volume}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.position}</TableCell>
                    <TableCell className="text-sm text-gray-300">{item.destination}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-orange-900 text-orange-300 border-orange-700">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">
                {selectedDelivery ? 'אין פריטי מטען למשלוח זה' : 'בחר משלוח לצפייה ברשימת המטען'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}