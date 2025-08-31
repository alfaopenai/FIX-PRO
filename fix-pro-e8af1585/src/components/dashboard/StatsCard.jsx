import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { scaleIn, cardHover } from "@/lib/motionPresets";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon,
  trend,
  helper
}) {
  return (
    <motion.div 
      variants={scaleIn}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div
        variants={cardHover}
        className="h-full"
      >
        <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg h-full">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <motion.div 
              className="p-3 bg-gray-700/60 rounded-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-6 h-6 text-gray-300" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-gray-400 text-xs font-medium tracking-wide">{title}</h3>
              <div className="flex items-end gap-2">
                <motion.div 
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {value}
                </motion.div>
                {trend && (
                  <span className={`text-xs ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{trend}</span>
                )}
              </div>
              {helper && <div className="text-[11px] text-gray-500 mt-1">{helper}</div>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}