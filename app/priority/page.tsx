"use client";

import { useState, useEffect, useMemo } from "react";
import { Log } from "../../utils/logger";
import { fetchNotifications, getTop10Notifications } from "../../api/notifications";
import NotificationCard from "../../components/NotificationCard";
import NavBar from "../../components/NavBar";
import { 
  Typography, Container, Box, Grid, CircularProgress, Alert, TextField 
} from "@mui/material";

export default function PriorityPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [topN, setTopN] = useState<number>(10);

  const loadData = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const data = await fetchNotifications(); // Fetch all to calculate priority across all
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load priority notifications.");
      if (err.message.includes("401") || err.message.includes("No access token")) {
        setTimeout(() => window.location.href = "/", 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Log("frontend", "INFO", "priority_page", "Dashboard Priority Notifications loaded");
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @ts-ignore
  const topNotifications = useMemo(() => getTop10Notifications(notifications, topN), [notifications, topN]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <NavBar />
      
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ 
          display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5, alignItems: 'center', 
          bgcolor: 'rgba(255, 255, 255, 0.7)', p: 3, borderRadius: 4, 
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 800, flexGrow: 1, color: 'primary.dark' }}>
            Priority Rankings
          </Typography>
          
          <TextField 
            type="number" 
            label='Limit Top "n"' 
            value={topN} 
            onChange={(e) => setTopN(Number(e.target.value) || 1)} 
            size="small" 
            sx={{ width: 120 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : topNotifications.length === 0 ? (
          <Alert severity="info">No priority notifications found.</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {topNotifications.map((n, i) => (
              <Box key={n.ID || n.id || `top-${i}`}>
                <NotificationCard notification={n} isNewer={i < 3} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
