
import React, { useState, useEffect } from "react";
import { Customer, Order } from "@/api/entities";
import StatsCard from "../components/dashboard/StatsCard";
import MarketingChart from "../components/dashboard/MarketingChart";
import Calendar from "../components/dashboard/Calendar";
import UserInformation from "../components/dashboard/UserInformation";
import SideStats from "../components/dashboard/SideStats";
import { motion, AnimatePresence } from "framer-motion";
import { staggerChildren, fadeUp, cardHover, scaleIn, pulse } from "@/lib/motionPresets";

import { Wallet, ListChecks, UserPlus } from 'lucide-react';

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersData, ordersData] = await Promise.all([
        Customer.list(),
        Order.list()
      ]);
      setCustomers(customersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeeklyBalance = () => {
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weeklyOrders = orders.filter(order => 
      new Date(order.created_date) >= thisWeek && order.status === 'completed'
    );
    
    return weeklyOrders.reduce((sum, order) => sum + (order.cost || 0), 0);
  };

  const getOrdersInQueue = () => {
    return orders.filter(order => order.status === 'pending' || order.status === 'in_progress').length;
  };

  const getFreshClients = () => {
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    
    return customers.filter(customer => 
      new Date(customer.created_date) >= thisMonth
    ).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.h2 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          ברוך שובך, יוני
        </motion.h2>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          הנה סיכום הפעילות העסקית שלך.
        </motion.p>
      </motion.div>

      {/* Stats Cards Row */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <StatsCard
          title="ביקורים באתר"
          value="102.50k"
          icon={Wallet}
        />
        <StatsCard
          title="מספר מכירות"
          value="5,234"
          icon={ListChecks}
        />
        <StatsCard
          title="מחיר ממוצע"
          value="₪56.75"
          icon={Wallet}
        />
        <StatsCard
          title="הכנסות ממכירות"
          value="₪22.50"
          icon={UserPlus}
        />
      </motion.div>

      {/* Main Chart - Full Width */}
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <MarketingChart />
      </motion.div>

      {/* Bottom Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Left Column - Stats */}
        <motion.div 
          className="lg:col-span-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <SideStats />
        </motion.div>

        {/* Middle Column - Calendar */}
        <motion.div 
          className="lg:col-span-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Calendar />
        </motion.div>

        {/* Right Column - Popular Items */}
        <motion.div 
          className="lg:col-span-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <UserInformation />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
