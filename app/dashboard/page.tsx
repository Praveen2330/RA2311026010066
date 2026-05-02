"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Log } from "../../utils/logger";
import { fetchNotifications, getTop10Notifications } from "../../api/notifications";
import NotificationCard from "../../components/NotificationCard";

export default function Dashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    Log("frontend", "INFO", "dashboard", "Dashboard loaded");
    
    async function loadData() {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load notifications.");
        // Optional: redirect to login if 401
        if (err.message.includes("401") || err.message.includes("No access token")) {
          setTimeout(() => window.location.href = "/", 2000);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "All") return notifications;
    return notifications.filter(
      (n) => (n.type || n.category || "Event").toLowerCase() === filter.toLowerCase()
    );
  }, [notifications, filter]);

  const top10 = useMemo(() => getTop10Notifications(filteredNotifications), [filteredNotifications]);

  const handleFilterChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    await Log("frontend", "INFO", "filter", `Filter changed to ${newFilter}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("campus_access_token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-wrapper">
      {/* Dynamic Background Elements */}
      <div className="dashboard-bg-shape1"></div>
      <div className="dashboard-bg-shape2"></div>

      <header className="navbar-glass">
        <h1 className="nav-title-gradient">Campus Notifications</h1>
        <motion.button 
          className="btn-logout"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      </header>
      
      <main className="main-content">
        <div className="dashboard-header">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Overview
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <select className="filter-select-glass" value={filter} onChange={handleFilterChange}>
              <option value="All">All Types</option>
              <option value="Placement">Placement</option>
              <option value="Result">Result</option>
              <option value="Event">Event</option>
            </select>
          </motion.div>
        </div>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="status-message">
            <span className="spinner" style={{ marginRight: '10px', verticalAlign: 'middle', borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#3b82f6' }}></span>
            Loading securely...
          </motion.div>
        )}
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="status-message" style={{ color: '#f87171', border: '1px dashed rgba(248, 113, 113, 0.3)' }}>
            ⚠️ {error}
          </motion.div>
        )}

        {!loading && !error && (
          <AnimatePresence>
            <motion.div
              key="dashboard-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h3 
                className="section-title"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                Top Priority Notifications
              </motion.h3>
              {top10.length === 0 ? (
                <p className="status-message">No priority notifications.</p>
              ) : (
                <div className="notifications-grid">
                  {top10.map((n, i) => (
                    <NotificationCard key={n.ID || n.id || `top-${i}`} notification={n} isNewer={i < 3} index={i} />
                  ))}
                </div>
              )}

              <motion.h3 
                className="section-title"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              >
                All Notifications ({filteredNotifications.length})
              </motion.h3>
              {filteredNotifications.length === 0 ? (
                <p className="status-message">No notifications found for this filter.</p>
              ) : (
                <div className="notifications-grid">
                  {filteredNotifications.map((n, i) => (
                    <NotificationCard key={n.ID || n.id || `all-${i}`} notification={n} isNewer={false} index={i + top10.length} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
