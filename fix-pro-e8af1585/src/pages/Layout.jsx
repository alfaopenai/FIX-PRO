

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  Settings,
  Search,
  Bell,
  Home,
  MessageSquare,
  Truck, // Added Truck icon
  BarChart3 // Added Analytics icon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fadeIn, cardHover, listItem } from "@/lib/motionPresets";
import Icon3D from "@/components/ui/icon-3d";

const navigationItems = [
  {
    title: "דשבורד",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "נסיעות", // New navigation item
    url: createPageUrl("Deliveries"),
    icon: Truck,
  },
  {
    title: "הודעות",
    url: createPageUrl("Messages"),
    icon: MessageSquare,
  },
  {
    title: "אנליטיקות",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "לקוחות",
    url: createPageUrl("Customers"),
    icon: Users,
  },
  {
    title: "לוח זמנים",
    url: createPageUrl("Schedule"),
    icon: Calendar,
  },
  {
    title: "הגדרות",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
  // הוסר: מנהל מכירות (SalesManager)
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  // Determine the current page title for the header based on the navigation items
  const currentNavItem = navigationItems.find(item => location.pathname === item.url);
  // Use the title from navigationItems if found, otherwise fall back to currentPageName prop, or a default 'דשבורד'
  const headerTitle = currentNavItem ? currentNavItem.title : currentPageName || "דשבורד";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <motion.div 
          className="w-20 bg-gray-950 border-l border-gray-800 flex flex-col items-center py-5"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Logo */}

          
          {/* Navigation */}
          <nav className="flex flex-col items-center space-y-2">
            <>
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <Link
                    to={item.url}
                    className={`p-4 rounded-xl transition-colors duration-200 block ${
                      location.pathname === item.url 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-500 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon3D size={20}>
                      <item.icon className="w-5 h-5" />
                    </Icon3D>
                  </Link>
                </motion.div>
              ))}
            </>
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Header */}
          <motion.header 
            className="bg-gray-950/70 backdrop-blur-md border-b border-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between px-8 py-4">
              {/* Dynamically set header title based on the current page */}
              <motion.h1 
                className="text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {headerTitle}
              </motion.h1>
              
              <div className="flex items-center gap-6">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    className="w-64 pr-10 bg-gray-800 border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:bg-gray-700 focus:ring-1 focus:ring-gray-600 transition-all"
                  />
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-gray-800 hover:text-white">
                      <Bell className="w-5 h-5" />
                    </Button>
                  </motion.div>
                  {/* הוסר קישור ל-SalesManager מהכרטיס פרופיל */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border-2 border-gray-700">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                      <AvatarFallback>JM</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-white text-sm">Jack Marley</div>
                      <div className="text-xs text-gray-400">Sales manager</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <motion.main 
            className="flex-1 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.main>
        </motion.div>
      </div>
    </div>
  );
}

