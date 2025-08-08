import React, { useState, useEffect } from "react";
import { Customer } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, cardHover, tableRowHover, staggerChildren, scaleIn } from "@/lib/motionPresets";
import { 
  Plus, Search, Filter, MoreVertical, Phone, Mail, MapPin, 
  Building, Star, TrendingUp, TrendingDown, Users, Package,
  Calendar, Clock, DollarSign, AlertCircle, CheckCircle, XCircle
} from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await Customer.list("-created_date");
      
      // יצירת נתוני דמו עשירים אם אין נתונים
      const demoCustomers = data.length > 0 ? data : [
        {
          id: 1,
          name: "דני כהן",
          company: "חברת ABC בע״מ",
          phone: "03-1234567",
          email: "danny@abc.co.il",
          avatar_url: "https://i.pravatar.cc/150?img=1",
          location: "תל אביב",
          status: "active",
          customer_type: "vip",
          total_orders: 45,
          total_spent: 125000,
          last_order: new Date(Date.now() - 86400000 * 2).toISOString(),
          rating: 4.8,
          notes: "לקוח VIP - שירות מהיר",
          join_date: "2023-01-15",
          service_types: ["משלוחים", "לוגיסטיקה"],
          trend: 15
        },
        {
          id: 2,
          name: "שרה לוי",
          company: "מפעל XYZ",
          phone: "02-9876543",
          email: "sara@xyz.co.il", 
          avatar_url: "https://i.pravatar.cc/150?img=2",
          location: "ירושלים",
          status: "active",
          customer_type: "regular",
          total_orders: 23,
          total_spent: 67500,
          last_order: new Date(Date.now() - 86400000 * 7).toISOString(),
          rating: 4.2,
          notes: "לקוח נאמן",
          join_date: "2023-03-22",
          service_types: ["משלוחים"],
          trend: -5
        },
        {
          id: 3,
          name: "מיכל רוזן",
          company: "סופר מרקט הגדול",
          phone: "04-5556677",
          email: "michal@supermarket.co.il",
          avatar_url: "https://i.pravatar.cc/150?img=3",
          location: "חיפה",
          status: "pending",
          customer_type: "business",
          total_orders: 67,
          total_spent: 198000,
          last_order: new Date(Date.now() - 86400000 * 1).toISOString(),
          rating: 4.9,
          notes: "לקוח עסקי גדול",
          join_date: "2022-11-08",
          service_types: ["משלוחים", "אחסון", "הפצה"],
          trend: 22
        },
        {
          id: 4,
          name: "אבי ישראל",
          company: "רשת המזון",
          phone: "08-1112233",
          email: "avi@food-chain.co.il",
          avatar_url: "https://i.pravatar.cc/150?img=4",
          location: "באר שבע",
          status: "inactive",
          customer_type: "regular",
          total_orders: 12,
          total_spent: 34500,
          last_order: new Date(Date.now() - 86400000 * 30).toISOString(),
          rating: 3.8,
          notes: "לא פעיל לאחרונה",
          join_date: "2023-06-10",
          service_types: ["משלוחים"],
          trend: -12
        },
        {
          id: 5,
          name: "רינה דוד",
          company: "חנות הכל",
          phone: "09-8887766",
          email: "rina@everything.co.il",
          avatar_url: "https://i.pravatar.cc/150?img=5",
          location: "נתניה",
          status: "active",
          customer_type: "vip",
          total_orders: 89,
          total_spent: 267000,
          last_order: new Date(Date.now() - 86400000 * 3).toISOString(),
          rating: 5.0,
          notes: "לקוח מצוין - אמין ומהיר בתשלום",
          join_date: "2022-08-18",
          service_types: ["משלוחים", "לוגיסטיקה", "אחסון"],
          trend: 8
        }
      ];
      
      setCustomers(demoCustomers);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'פעיל', color: 'bg-green-600', icon: CheckCircle },
      pending: { label: 'ממתין', color: 'bg-yellow-600', icon: Clock },
      inactive: { label: 'לא פעיל', color: 'bg-gray-600', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} text-white border-0 flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getCustomerTypeBadge = (type) => {
    const typeConfig = {
      vip: { label: 'VIP', color: 'bg-purple-600', icon: Star },
      business: { label: 'עסקי', color: 'bg-blue-600', icon: Building },
      regular: { label: 'רגיל', color: 'bg-gray-600', icon: Users }
    };
    
    const config = typeConfig[type] || typeConfig.regular;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} text-white border-0 flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.includes(searchTerm) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // חישוב סטטיסטיקות
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const vipCustomers = customers.filter(c => c.customer_type === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", change }) => (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <motion.p 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {value}
            </motion.p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <motion.div 
            className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={`w-6 h-6 text-${color}-500`} />
          </motion.div>
        </div>
        {change !== undefined && (
          <motion.div 
            className={`flex items-center gap-1 mt-2 text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}% מהחודש שעבר</span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );

  return (
    <motion.div 
      className="p-6 space-y-6 bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            לקוחות
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            ניהול ומעקב אחר לקוחות
          </motion.p>
        </div>
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              <Filter className="w-4 h-4 ml-2" />
              סינון מתקדם
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 ml-2" />
              לקוח חדש
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          title="סך הכל לקוחות"
          value={totalCustomers.toLocaleString()}
          icon={Users}
          color="blue"
          change={12}
        />
        <StatCard
          title="לקוחות פעילים"
          value={activeCustomers.toLocaleString()}
          subtitle={`${Math.round((activeCustomers / totalCustomers) * 100)}% מהלקוחות`}
          icon={CheckCircle}
          color="green"
          change={8}
        />
        <StatCard
          title="לקוחות VIP"
          value={vipCustomers.toLocaleString()}
          icon={Star}
          color="purple"
          change={5}
        />
        <StatCard
          title="סך הכנסות"
          value={`₪${totalRevenue.toLocaleString()}`}
          subtitle="מכל הלקוחות"
          icon={DollarSign}
          color="green"
          change={22}
        />
      </motion.div>

      {/* Search and Filters */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="חיפוש לפי שם, חברה, טלפון או אימייל..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              הכל
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              פעילים
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              ממתינים
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-white">רשימת לקוחות ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="text-gray-400 ml-3">טוען נתונים...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-750">
                  <TableHead className="text-gray-300">לקוח</TableHead>
                  <TableHead className="text-gray-300">פרטי התקשרות</TableHead>
                  <TableHead className="text-gray-300">סטטוס</TableHead>
                  <TableHead className="text-gray-300">סוג לקוח</TableHead>
                  <TableHead className="text-gray-300">הזמנות</TableHead>
                  <TableHead className="text-gray-300">סך הוצא</TableHead>
                  <TableHead className="text-gray-300">דירוג</TableHead>
                  <TableHead className="text-gray-300">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.id} 
                      className="border-gray-700 hover:bg-gray-750 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      whileHover={{ 
                        y: -2, 
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                    >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-gray-600">
                          <AvatarImage src={customer.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {customer.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">{customer.name}</div>
                          <div className="text-sm text-gray-400">{customer.company}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{customer.location}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-32">{customer.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(customer.status)}
                    </TableCell>
                    <TableCell>
                      {getCustomerTypeBadge(customer.customer_type)}
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">{customer.total_orders}</div>
                      <div className="text-xs text-gray-400">הזמנות</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white font-medium">₪{customer.total_spent?.toLocaleString()}</div>
                      <div className={`flex items-center gap-1 text-xs ${customer.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {customer.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{Math.abs(customer.trend)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= customer.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-400 ml-1">{customer.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
          
          {filteredCustomers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-6xl mb-4">👥</div>
              <p className="text-gray-400">לא נמצאו לקוחות</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}