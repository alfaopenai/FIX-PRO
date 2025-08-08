import React, { useEffect, useMemo, useState } from "react";
import { Customer, Order } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { fadeUp, staggerChildren } from "@/lib/motionPresets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Trophy,
} from "lucide-react";

function formatCurrency(value) {
  try {
    return new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(
      Number(value || 0)
    );
  } catch {
    return `₪${Number(value || 0).toLocaleString()}`;
  }
}

function groupOrdersByMonth(orders) {
  const counts = new Map();
  const now = new Date();

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    counts.set(key, { label: d.toLocaleString("he-IL", { month: "short" }), revenue: 0, deals: 0 });
  }

  orders.forEach((o) => {
    const d = new Date(o.created_date);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (counts.has(key)) {
      const row = counts.get(key);
      row.revenue += o.status === "completed" ? Number(o.total_amount || 0) : 0;
      row.deals += 1;
    }
  });

  return Array.from(counts.values());
}

export default function SalesManager() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all"); // all | 12m | 6m | 30d
  const [statusFilter, setStatusFilter] = useState("all"); // all | completed | open
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersData, customersData] = await Promise.all([Order.list(), Customer.list()]);
        setOrders(ordersData || []);
        setCustomers(customersData || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    let startDate = null;
    if (period === "12m") startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    if (period === "6m") startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    if (period === "30d") startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orders
      .filter((o) => (startDate ? new Date(o.created_date) >= startDate : true))
      .filter((o) => (statusFilter === "all" ? true : statusFilter === "completed" ? o.status === "completed" : o.status !== "completed"))
      .filter((o) => {
        if (!search.trim()) return true;
        const customer = customers.find((c) => c.id === o.customer_id);
        return (
          (o.order_number || "").toLowerCase().includes(search.toLowerCase()) ||
          (customer?.name || "").toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [orders, customers, period, statusFilter, search]);

  const metrics = useMemo(() => {
    const totalRevenue = filtered
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const openDeals = filtered.filter((o) => o.status !== "completed").length;
    const avgDealSizeBase = filtered.filter((o) => Number(o.total_amount) > 0);
    const avgDealSize = avgDealSizeBase.length
      ? avgDealSizeBase.reduce((s, o) => s + Number(o.total_amount || 0), 0) / avgDealSizeBase.length
      : 0;

    const won = filtered.filter((o) => o.status === "completed").length;
    const winRate = filtered.length ? Math.round((won / filtered.length) * 100) : 0;

    return { totalRevenue, openDeals, avgDealSize, winRate };
  }, [filtered]);

  const monthlyData = useMemo(() => {
    if (!filtered.length) return [];

    // Determine range from first to last order in the filtered set
    const sorted = [...filtered].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    const start = new Date(sorted[0].created_date);
    const end = new Date(sorted[sorted.length - 1].created_date);

    const months = [];
    let d = new Date(start.getFullYear(), start.getMonth(), 1);
    while (d <= end) {
      months.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: d.toLocaleString("he-IL", { month: "short" }), revenue: 0, deals: 0 });
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }

    filtered.forEach((o) => {
      const od = new Date(o.created_date);
      const key = `${od.getFullYear()}-${od.getMonth() + 1}`;
      const row = months.find((m) => m.key === key);
      if (row) {
        row.revenue += o.status === "completed" ? Number(o.total_amount || 0) : 0;
        row.deals += 1;
      }
    });

    // Show at most last 6 buckets for readability
    const last = months.slice(-6);
    return last.map(({ label, revenue, deals }) => ({ label, revenue, deals }));
  }, [filtered]);

  const topDeals = useMemo(() => {
    return [...filtered]
      .sort((a, b) => Number(b.total_amount || 0) - Number(a.total_amount || 0))
      .slice(0, 6);
  }, [filtered]);

  const statusBreakdown = useMemo(() => {
    const byStatus = [
      { name: "נסגר", key: "completed", color: "#10b981" },
      { name: "פתוח", key: "open", color: "#f59e0b" },
    ];
    const completedCount = filtered.filter((o) => o.status === "completed").length;
    const openCount = filtered.filter((o) => o.status !== "completed").length;
    return byStatus.map((s) => ({
      name: s.name,
      value: s.key === "completed" ? completedCount : openCount,
      color: s.color,
    }));
  }, [filtered]);

  function exportCsv() {
    const rows = [["order_number", "customer", "status", "total_amount", "created_date"], ...filtered.map((o) => {
      const customer = customers.find((c) => c.id === o.customer_id);
      return [o.order_number || o.id, customer?.name || "", o.status, String(o.total_amount || 0), new Date(o.created_date).toISOString()]
    })];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const teamBoard = useMemo(
    () => [
      { id: 1, name: "נועה בר", deals: 12, revenue: 42000 },
      { id: 2, name: "דניאל לוי", deals: 9, revenue: 38000 },
      { id: 3, name: "אורי כהן", deals: 7, revenue: 29500 },
    ],
    []
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-gray-800/60" variant="shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <Skeleton className="h-[360px] xl:col-span-8 bg-gray-800/60" variant="shimmer" />
          <div className="xl:col-span-4 space-y-6">
            <Skeleton className="h-40 bg-gray-800/60" variant="shimmer" />
            <Skeleton className="h-40 bg-gray-800/60" variant="shimmer" />
          </div>
        </div>
        <Skeleton className="h-72 bg-gray-800/60" variant="shimmer" />
      </div>
    );
  }

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Filters */}
      <Card className="bg-gray-900/60 border border-gray-700/60 sticky top-2 z-10 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">תקופה</span>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-gray-200">
                  <SelectValue placeholder="בחירת תקופה" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                  <SelectItem value="all">כל הזמנים</SelectItem>
                  <SelectItem value="12m">12 חודשים</SelectItem>
                  <SelectItem value="6m">6 חודשים</SelectItem>
                  <SelectItem value="30d">30 יום</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">סטטוס</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-gray-200">
                  <SelectValue placeholder="סטטוס" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="completed">נסגר</SelectItem>
                  <SelectItem value="open">פתוח</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש לפי לקוח/מס׳ הזמנה" className="bg-gray-900 border-gray-700 text-gray-200 h-9" />
            </div>
            <button onClick={exportCsv} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500">ייצוא CSV</button>
          </div>
        </CardContent>
      </Card>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <StatsCard title="הכנסות (YTD)" value={formatCurrency(metrics.totalRevenue)} icon={DollarSign} trend={metrics.winRate >= 50 ? '+2.1%' : '-1.3%'} helper="סך נסגר השנה" />
        <StatsCard title="עסקאות פתוחות" value={metrics.openDeals.toLocaleString()} icon={ShoppingCart} helper="בכל המצבים הפתוחים" />
        <StatsCard title="גודל עסקה ממוצע" value={formatCurrency(Math.round(metrics.avgDealSize))} icon={TrendingUp} trend={metrics.avgDealSize ? '+0.6%' : undefined} />
        <StatsCard title="אחוז זכייה" value={`${metrics.winRate}%`} icon={Trophy} helper="נסגר מתוך כלל העסקאות" />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* עמודה שמאלית: גרף + טבלה */}
        <div className="xl:col-span-8 space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">מגמת הכנסות 6 חודשים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ left: 4, right: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                      <XAxis dataKey="label" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                      <Tooltip
                        cursor={{ fill: "rgba(156,163,175,0.08)" }}
                        content={({ active, payload, label }) =>
                          active && payload?.length ? (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl text-white text-sm">
                              <div className="font-medium">{label}</div>
                              <div className="text-gray-300">{formatCurrency(payload[0].value)}</div>
                            </div>
                          ) : null
                        }
                      />
                      <Bar dataKey="revenue" fill="#7dd3fc" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">עסקאות אחרונות</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">מס׳ הזמנה</TableHead>
                      <TableHead className="text-gray-300">לקוח</TableHead>
                      <TableHead className="text-gray-300">סטטוס</TableHead>
                      <TableHead className="text-gray-300 text-right">סה"כ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topDeals.map((o) => {
                      const customer = customers.find((c) => c.id === o.customer_id);
                      return (
                        <TableRow key={o.id} className="hover:bg-gray-700/40 cursor-pointer">
                          <TableCell className="text-gray-200">{o.order_number || o.id}</TableCell>
                          <TableCell className="text-gray-300">{customer?.name || "—"}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                o.status === "completed"
                                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-600/40"
                                  : "bg-amber-600/20 text-amber-300 border border-amber-600/40"
                              }`}
                            >
                              {o.status === "completed" ? "נסגר" : "פתוח"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-gray-200">{formatCurrency(o.total_amount)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* עמודה ימנית: כרטיסים צדדיים */}
        <div className="xl:col-span-4 space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">פעולות מהירות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={exportCsv} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 text-sm">ייצוא CSV</button>
                  <button className="px-3 py-2 rounded-md bg-gray-700 text-gray-100 hover:bg-gray-600 text-sm">עסקה חדשה</button>
                  <button className="px-3 py-2 rounded-md bg-gray-700 text-gray-100 hover:bg-gray-600 text-sm">לקוח חדש</button>
                  <button className="px-3 py-2 rounded-md bg-gray-700 text-gray-100 hover:bg-gray-600 text-sm">דוח PDF</button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">פילוח סטטוס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4}>
                        {statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={24} formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>} />
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-white text-xs">
                              {payload[0].name}: {payload[0].value}
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">משפך מכירות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[{ label: "לידים", value: Math.max(customers.length * 4, 10), color: "bg-blue-500" },
                    { label: "מוכשרים", value: Math.max(customers.length * 3, 8), color: "bg-indigo-500" },
                    { label: "הצעה", value: Math.max(orders.length * 2, 4), color: "bg-violet-500" },
                    { label: "נסגרו", value: Math.max(orders.filter(o => o.status === "completed").length, 1), color: "bg-emerald-500" }]
                    .map((row, idx) => (
                      <div key={row.label} className="w-full">
                        <div className="flex items-center justify-between mb-1 text-sm text-gray-300">
                          <span>{row.label}</span>
                          <span>{row.value}</span>
                        </div>
                        <div className="h-3 bg-gray-700/60 rounded-md overflow-hidden">
                          <div className={`h-full ${row.color}`} style={{ width: `${Math.min(100, 25 + idx * 20)}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Card className="bg-gray-800/60 border border-gray-700/80 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">מצטייני החודש</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamBoard.map((rep, index) => (
                    <div key={rep.id} className="flex items-center justify-between rounded-lg border border-gray-700/70 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700/60 grid place-items-center text-gray-200">{index + 1}</div>
                        <div className="text-gray-200">{rep.name}</div>
                      </div>
                      <div className="text-sm text-gray-300">
                        {rep.deals} עסקאות • {formatCurrency(rep.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

