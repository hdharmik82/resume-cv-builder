import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// In production, optionally point to an external backend URL via VITE_API_URL.
// Defaults to empty string, which routes to relative /api (handled by Vite proxy locally or Vercel rewrites in production).
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("proresume_token") || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState("");

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("proresume_user", JSON.stringify(data.user));
          } else {
            logout();
          }
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        // Fallback to cached user in local storage
        const cached = localStorage.getItem("proresume_user");
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            // ignore
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  // Login with Email & Password
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to log in.");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("proresume_token", data.token);
    localStorage.setItem("proresume_user", JSON.stringify(data.user));
    setAuthModalOpen(false);
    return data.user;
  };

  // Register with Name, Email, Phone, Password
  const register = async (name, email, phone, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Registration failed.");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("proresume_token", data.token);
    localStorage.setItem("proresume_user", JSON.stringify(data.user));
    setAuthModalOpen(false);
    return data.user;
  };

  // Google OAuth Simulated / Production Sign-In
  const loginWithGoogle = async (googleUser) => {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googleUser),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Google sign-in failed.");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("proresume_token", data.token);
    localStorage.setItem("proresume_user", JSON.stringify(data.user));
    setAuthModalOpen(false);
    return data.user;
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("proresume_token");
    localStorage.removeItem("proresume_user");
  };

  // Refresh user profile from backend
  const refreshUser = async () => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("proresume_user", JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.warn("Failed to refresh user:", e);
    }
    return null;
  };

  // Create Razorpay Order
  const createPaymentOrder = async () => {
    if (!token) {
      throw new Error("You must be logged in to initiate payment.");
    }

    const res = await fetch(`${API_BASE}/api/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to create payment order.");
    }

    return data;
  };

  // Verify Razorpay Payment Signature
  const verifyPayment = async (paymentDetails) => {
    if (!token) {
      throw new Error("Authentication token required.");
    }

    const res = await fetch(`${API_BASE}/api/payment/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Payment verification failed.");
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("proresume_user", JSON.stringify(data.user));
    }
    setPaymentModalOpen(false);
    return data;
  };

  // Sandbox Test Payment Helper
  const sandboxCompletePayment = async (orderId) => {
    if (!token) {
      throw new Error("Authentication token required.");
    }

    const res = await fetch(`${API_BASE}/api/payment/sandbox-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Sandbox payment failed.");
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem("proresume_user", JSON.stringify(data.user));
    }
    setPaymentModalOpen(false);
    return data;
  };

  // Record Download
  const recordDownload = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/payment/record-download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      refreshUser();
    } catch {
      // Non-blocking log
    }
  };

  const isPaid = Boolean(user?.isPaid);

  const value = {
    user,
    token,
    isPaid,
    loading,
    authModalOpen,
    setAuthModalOpen,
    paymentModalOpen,
    setPaymentModalOpen,
    authNotice,
    setAuthNotice,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
    createPaymentOrder,
    verifyPayment,
    sandboxCompletePayment,
    recordDownload,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
