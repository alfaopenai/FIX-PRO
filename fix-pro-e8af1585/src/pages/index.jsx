import Layout from "./Layout.jsx";
import { createPageUrl } from "@/utils";
import Dashboard from "./Dashboard";
import Customers from "./Customers";
import Messages from "./Messages";
import Deliveries from "./Deliveries";
import Settings from "./Settings";
import Analytics from "./Analytics";
import Schedule from "./Schedule";
import SalesManager from "./SalesManager";
import { HashRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motionPresets";

const PAGES = {
    Dashboard,
    Customers,
    Messages,
    Deliveries,
    Analytics,
    Schedule,
    Settings,
    SalesManager,
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
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
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
