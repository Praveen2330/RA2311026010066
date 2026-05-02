"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Chip, Box, Badge, Avatar } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NotificationCard({ notification, isNewer }: { notification: any, isNewer: boolean }) {
  const [isViewed, setIsViewed] = useState(false);
  
  const id = notification.ID || notification.id || notification.Id;
  const type = notification.Type || notification.type || notification.category || "Event";
  const message = notification.Message || notification.message || notification.body || "";
  
  const timestampRaw = notification.Timestamp || notification.timestamp;
  const timestamp = timestampRaw
    ? new Date(timestampRaw).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : "—";

  useEffect(() => {
    const viewedList = JSON.parse(localStorage.getItem("viewed_notifications") || "[]");
    if (viewedList.includes(id)) {
      setIsViewed(true);
    }
  }, [id]);

  const markAsViewed = () => {
    if (!isViewed) {
      setIsViewed(true);
      const viewedList = JSON.parse(localStorage.getItem("viewed_notifications") || "[]");
      viewedList.push(id);
      localStorage.setItem("viewed_notifications", JSON.stringify(viewedList));
    }
  };

  const getTypeConfig = () => {
    switch(type) {
      case "Placement": return { color: "success", icon: <WorkIcon /> };
      case "Result": return { color: "primary", icon: <EmojiEventsIcon /> };
      case "Event": return { color: "warning", icon: <EventIcon /> };
      default: return { color: "default", icon: <NotificationsIcon /> };
    }
  };

  const config = getTypeConfig();

  return (
    <Card 
      onClick={markAsViewed}
      elevation={isViewed ? 0 : 3}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isViewed ? '1px solid #E5E7EB' : '1px solid transparent',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: isViewed ? '#F9FAFB' : '#FFFFFF',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px -10px rgba(79, 70, 229, 0.2)',
          borderColor: '#818CF8'
        }
      }}
    >
      {isNewer && !isViewed && (
        <Box sx={{
          position: 'absolute',
          top: -12,
          right: -12,
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          px: 1.5,
          py: 0.5,
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
        }}>
          NEW
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 2 }}>
          <Badge color="error" variant="dot" invisible={isViewed} overlap="circular">
            <Avatar sx={{ 
              bgcolor: `${config.color}.light`, 
              color: `${config.color}.dark`,
              width: 48, 
              height: 48 
            }}>
              {config.icon}
            </Avatar>
          </Badge>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip label={type} color={config.color as any} size="small" sx={{ fontWeight: 'bold' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {timestamp}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: isViewed ? 'text.secondary' : 'text.primary', 
            fontWeight: isViewed ? 400 : 500,
            lineHeight: 1.6,
            mt: 1
          }}
        >
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}
