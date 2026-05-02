"use client";

import { useState, useEffect } from "react";
import { Log } from "../../utils/logger";
import { fetchNotifications } from "../../api/notifications";
import NotificationCard from "../../components/NotificationCard";
import NavBar from "../../components/NavBar";
import { 
  Typography, Container, Box, Select, MenuItem, 
  FormControl, InputLabel, Grid, CircularProgress, Alert, TextField 
} from "@mui/material";

interface ApiParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export default function Dashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // API Query states
  const [filterType, setFilterType] = useState("All");
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: ApiParams = { page, limit };
      if (filterType !== "All") {
        params.notification_type = filterType;
      }
      // @ts-ignore
      const data = await fetchNotifications(params);
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications.");
      if (err.message.includes("401") || err.message.includes("No access token")) {
        setTimeout(() => window.location.href = "/", 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Log("frontend", "INFO", "dashboard", "Dashboard All Notifications loaded");
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, limit, page]);

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
            All Notifications
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type Filter</InputLabel>
            <Select
              value={filterType}
              label="Type Filter"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            type="number" 
            label="API Limit" 
            value={limit} 
            onChange={(e) => {
              const val = Number(e.target.value);
              setLimit(val > 10 ? 10 : val < 1 ? 1 : val);
            }} 
            size="small" 
            sx={{ width: 100 }}
          />
          
          <TextField 
            type="number" 
            label="API Page" 
            value={page} 
            onChange={(e) => setPage(Number(e.target.value) || 1)} 
            size="small" 
            sx={{ width: 100 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : notifications.length === 0 ? (
          <Alert severity="info">No notifications found.</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {notifications.map((n, i) => (
              <Box key={n.ID || n.id || `all-${i}`}>
                <NotificationCard notification={n} isNewer={false} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
