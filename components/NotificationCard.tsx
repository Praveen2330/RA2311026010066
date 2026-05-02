"use client";

import { motion } from "framer-motion";

export default function NotificationCard({ notification, isNewer, index }: { notification: any, isNewer: boolean, index: number }) {
  const type = notification.type || notification.category || "Event";
  const title = notification.title || notification.subject || "Notification";
  const message = notification.message || notification.body || "";
  
  // Format timestamp nicely
  const timestamp = notification.timestamp
    ? new Date(notification.timestamp).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : "—";

  return (
    <motion.div 
      className={`notification-card-glass ${isNewer ? 'newer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className="card-header">
        <span className={`badge-premium ${type}`}>{type}</span>
        <span className="timestamp-glass">{timestamp}</span>
      </div>
      <div>
        <h3 className="title-glass">{title}</h3>
        {message && <p className="message-glass">{message}</p>}
      </div>
    </motion.div>
  );
}
