import React, { Suspense } from "react";
import Layout from "./Layout.jsx";
import { createPageUrl } from "@/utils";
const Dashboard = React.lazy(() => import("./Dashboard"));
const Customers = React.lazy(() => import("./Customers"));
const Messages = React.lazy(() => import("./Messages"));
const Deliveries = React.lazy(() => import("./Deliveries"));
const Settings = React.lazy(() => import("./Settings"));
const Analytics = React.lazy(() => import("./Analytics"));
const Schedule = React.lazy(() => import("./Schedule"));
const SalesManager = React.lazy(() => import("./SalesManager"));
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition, slideX } from "@/lib/motionPresets";

const PAGES = {
    
    Dashboard: Dashboard,
    
    Customers: Customers,
    
    Messages: Messages,
    
    Deliveries: Deliveries,
    
    Analytics: Analytics,
    
    Schedule: Schedule,
    
    Settings: Settings,
    
    SalesManager: SalesManager,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <>
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  className="w-full"
                >
                  <Suspense fallback={<div className="p-8 text-gray-400">טוען...</div>}>
                    <Routes location={location}>            
                      <Route path="/" element={<Dashboard />} />
                      <Route path={createPageUrl("Dashboard")} element={<Dashboard />} />
                      <Route path={createPageUrl("Customers")} element={<Customers />} />
                      <Route path={createPageUrl("Messages")} element={<Messages />} />
                      <Route path={createPageUrl("Deliveries")} element={<Deliveries />} />
                      <Route path={createPageUrl("Analytics")} element={<Analytics />} />
                      <Route path={createPageUrl("Schedule")} element={<Schedule />} />
                      <Route path={createPageUrl("Settings")} element={<Settings />} />
                      <Route path={createPageUrl("SalesManager")} element={<SalesManager />} />
                    </Routes>
                  </Suspense>
                </motion.div>
            </>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}