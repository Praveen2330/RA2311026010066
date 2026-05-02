"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Log } from "../utils/logger";

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Clear any expired token from previous sessions to prevent background 401 errors
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
            // Hardcoded required fields to satisfy the backend
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
    <div className="login-wrapper">
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="login-title-glass">Campus Gateway</h1>
          <p className="login-subtitle">Authenticate to access notifications</p>

          <form onSubmit={handleLogin} className="glass-form">
            <div className="form-group-glass">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="input-glass"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                required
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="clientId">Client ID</label>
              <input
                type="text"
                id="clientId"
                className="input-glass"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Client ID"
                required
              />
            </div>

            <div className="form-group-glass">
              <label htmlFor="clientSecret">Client Secret Code</label>
              <input
                type="password"
                id="clientSecret"
                className="input-glass"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="••••••••••••••••"
                required
              />
            </div>

            {authError && (
              <div style={{ color: "#ef4444", fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>
                {authError}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn-glass"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : (
                "Authorize Access"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
