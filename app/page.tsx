"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Log } from "../utils/logger";
import { 
  Box, Card, CardContent, Typography, TextField, 
  Button, CircularProgress, Alert, InputAdornment
} from "@mui/material";
import { motion } from "framer-motion";
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("campus_access_token");
    }
    Log("frontend", "INFO", "login_page", "Login page loaded");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (email && clientId && clientSecret) {
      setIsSubmitting(true);
      try {
        const response = await fetch(AUTH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            clientID: clientId,
            clientSecret: clientSecret,
            name: "praveen n",
            rollNo: "ra2311026010066",
            accessCode: "QkbpxH"
          })
        });

        if (!response.ok) {
          throw new Error(`Authentication failed: ${response.status}`);
        }

        const data = await response.json();
        const token = data.access_token || data.token || (typeof data === 'string' ? data : null);

        if (token) {
          localStorage.setItem("campus_access_token", token);
          await Log("frontend", "INFO", "auth", `User verified and logged in: ${email}`);
          router.push("/dashboard");
        } else {
          setAuthError("No access token returned from server.");
          setIsSubmitting(false);
        }
      } catch (err: any) {
        setAuthError(err.message || "Invalid credentials. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', // Deep colorful space background
      padding: 2,
      perspective: '1000px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Pink / Magenta Orb */}
      <motion.div 
        animate={{ y: [0, -40, 0], x: [0, 30, 0], rotateZ: [0, 45, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0, filter: 'blur(40px)'
        }} 
      />
      {/* Cyan / Teal Orb */}
      <motion.div 
        animate={{ y: [0, 50, 0], x: [0, -40, 0], rotateZ: [0, -30, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-10%', width: '70%', height: '70%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0, filter: 'blur(40px)'
        }} 
      />
      {/* Orange / Yellow Orb */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '20%', right: '10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0, filter: 'blur(50px)'
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 15, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{ width: '100%', maxWidth: 480, zIndex: 1 }}
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, transition: { duration: 0.3 } }}
      >
        <Card elevation={10} sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <CardContent>
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ textAlign: 'center', marginBottom: 32 }}
            >
              <Box sx={{ 
                width: 72, height: 72, mx: 'auto', mb: 2, 
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(79,70,229,0.4)',
                transform: 'translateZ(20px)'
              }}>
                <SchoolIcon sx={{ color: 'white', fontSize: 36 }} />
              </Box>
              <Typography variant="h4" component="h1" color="primary" gutterBottom sx={{ fontWeight: 800 }}>
                Campus Gateway
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to access your student portal
              </Typography>
            </motion.div>

            <form onSubmit={handleLogin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, transformStyle: 'preserve-3d' }}>
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <TextField
                    label="Student Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    required
                    fullWidth
                    // @ts-ignore
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                  <TextField
                    label="Client ID"
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                    fullWidth
                    // @ts-ignore
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CodeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
                
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                  <TextField
                    label="Client Secret Code"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    required
                    fullWidth
                    // @ts-ignore
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                {authError && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{authError}</Alert>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    disabled={isSubmitting}
                    fullWidth
                    sx={{ mt: 2, py: 1.5, fontSize: '1.1rem', boxShadow: '0 8px 20px rgba(79,70,229,0.3)' }}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Authenticate Securely"}
                  </Button>
                </motion.div>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
