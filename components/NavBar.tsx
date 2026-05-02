"use client";

import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("campus_access_token");
    router.push("/");
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 1, 
              borderRadius: 2, 
              display: 'flex', 
              mr: 1.5 
            }}>
              <SchoolIcon />
            </Box>
            <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              Campus Gateway
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button 
              variant={pathname === "/dashboard" ? "contained" : "text"} 
              color="primary"
              onClick={() => router.push("/dashboard")}
              sx={{ px: 3, py: 1, fontWeight: pathname === "/dashboard" ? 700 : 500 }}
            >
              All Notifications
            </Button>
            <Button 
              variant={pathname === "/priority" ? "contained" : "text"} 
              color="primary"
              onClick={() => router.push("/priority")}
              sx={{ px: 3, py: 1, fontWeight: pathname === "/priority" ? 700 : 500 }}
            >
              Priority Rank
            </Button>
          </Box>

          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
            endIcon={<LogoutIcon />}
            sx={{ borderRadius: 8, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
