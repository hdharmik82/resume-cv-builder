import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  ShieldCheck,
  Users,
  UserPlus,
  CreditCard,
  Download,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Key,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileDown,
  Sparkles,
  Database,
  Server,
  Activity,
  ChevronLeft,
  ChevronRight,
  Lock,
  Copy,
  Check,
  X,
  Plus,
  LogOut,
  Sliders,
  DollarSign,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function AdminPanel({ onBackToBuilder, onBackToLanding }) {
  const { user, token, logout, login, refreshUser } = useAuth();

  // Navigation tabs: "dashboard" | "users" | "payments" | "settings"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Direct Admin Login Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError("");
    setAdminLoginLoading(true);
    try {
      if (!adminEmail.trim() || !adminPassword) {
        throw new Error("Please enter both email and password.");
      }
      const loggedUser = await login(adminEmail.trim(), adminPassword);
      if (loggedUser.role !== "admin") {
        setAdminLoginError(
          "Signed in, but this account does not have administrator privileges. Only accounts authorized by a Super Administrator can access this area."
        );
      } else {
        showToast("Signed in as Administrator!", "success");
      }
    } catch (err) {
      setAdminLoginError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setAdminLoginLoading(false);
    }
  };

  // Overview Data
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Users Data
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all"); // 'all', 'paid', 'free', 'admin'

  // Payments Data
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Modals & Forms
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);

  // Feedback notifications (toast)
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("Copied to clipboard!", "info");
  };

  // 1. Fetch Overview Metrics
  const fetchOverview = useCallback(async () => {
    if (!token) return;
    setOverviewLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOverview(data);
      } else {
        showToast(data.message || "Failed to load dashboard overview.", "error");
      }
    } catch (err) {
      showToast("Network error loading dashboard.", "error");
    } finally {
      setOverviewLoading(false);
    }
  }, [token]);

  // 2. Fetch Users
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: usersPage.toString(),
        limit: "10",
        search: userSearch,
        filter: userFilter,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const res = await fetch(`${API_BASE}/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setUsersTotalPages(data.pagination?.pages || 1);
        setUsersTotal(data.pagination?.total || 0);
      } else {
        showToast(data.message || "Failed to load users.", "error");
      }
    } catch (err) {
      showToast("Network error loading users.", "error");
    } finally {
      setUsersLoading(false);
    }
  }, [token, usersPage, userSearch, userFilter]);

  // 3. Fetch Payments
  const fetchPayments = useCallback(async () => {
    if (!token) return;
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams({
        page: paymentsPage.toString(),
        limit: "10",
        search: paymentSearch,
        status: paymentStatusFilter,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const res = await fetch(`${API_BASE}/api/admin/payments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
        setPaymentsTotalPages(data.pagination?.pages || 1);
        setPaymentsTotal(data.pagination?.total || 0);
      } else {
        showToast(data.message || "Failed to load payments.", "error");
      }
    } catch (err) {
      showToast("Network error loading payments.", "error");
    } finally {
      setPaymentsLoading(false);
    }
  }, [token, paymentsPage, paymentSearch, paymentStatusFilter]);

  // Load initial tab data
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchOverview();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "payments") {
      fetchPayments();
    }
  }, [activeTab, fetchOverview, fetchUsers, fetchPayments]);

  // Handle Quick Toggle User Paid Status
  const handleTogglePaid = async (targetUser) => {
    const updatedStatus = !targetUser.isPaid;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${targetUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPaid: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `Lifetime Pass for ${targetUser.email} ${updatedStatus ? "Activated" : "Revoked"}!`,
          "success"
        );
        fetchUsers();
        if (activeTab === "dashboard") fetchOverview();
      } else {
        showToast(data.message || "Failed to update user pass.", "error");
      }
    } catch (e) {
      showToast("Network error updating user.", "error");
    }
  };

  // Handle Quick Toggle User Role
  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    if (targetUser._id === user?._id && newRole === "user") {
      showToast("You cannot revoke your own administrator status.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${targetUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${targetUser.name} role changed to ${newRole.toUpperCase()}!`, "success");
        fetchUsers();
        if (activeTab === "dashboard") fetchOverview();
      } else {
        showToast(data.message || "Failed to change user role.", "error");
      }
    } catch (e) {
      showToast("Network error updating role.", "error");
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${deleteUserTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${deleteUserTarget.email} deleted successfully.`, "success");
        setDeleteUserTarget(null);
        fetchUsers();
        if (activeTab === "dashboard") fetchOverview();
      } else {
        showToast(data.message || "Failed to delete user.", "error");
      }
    } catch (e) {
      showToast("Network error deleting user.", "error");
    }
  };

  // Export Users CSV
  const handleExportUsers = () => {
    window.open(`${API_BASE}/api/admin/export/users?token=${token}`, "_blank");
    showToast("Downloading users CSV...", "info");
  };

  // Export Payments CSV
  const handleExportPayments = () => {
    window.open(`${API_BASE}/api/admin/export/payments?token=${token}`, "_blank");
    showToast("Downloading payments CSV...", "info");
  };

  // Re-seed mock data
  const handleSeedDemo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/seed-demo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Demo database populated!", "success");
        fetchOverview();
        fetchUsers();
        fetchPayments();
      } else {
        showToast(data.message || "Failed to seed demo data.", "error");
      }
    } catch (e) {
      showToast("Network error triggering seed.", "error");
    }
  };

  // If user is not logged in or not an admin, show dedicated Admin Sign In / Elevation Screen
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] pointer-events-none" />

        {/* Case 1: Unauthenticated User -> Direct Admin Sign In Portal */}
        {!user ? (
          <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">Admin Control Room</h2>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              Sign in with your administrator credentials to access platform controls and user management.
            </p>

            {/* Login Error Notification */}
            {adminLoginError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{adminLoginError}</span>
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLogin} className="mt-4 space-y-3.5 text-left text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@proresume.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={adminLoginLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {adminLoginLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Control Room</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </>
                )}
              </button>
            </form>

            {/* Navigation Footnotes */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onBackToBuilder}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Resume Builder</span>
              </button>
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                Home Page
              </button>
            </div>
          </div>
        ) : (
          /* Case 2: Logged in, but lacks Admin Role -> Access Denied & Super Admin Notice */
          <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">Admin Privileges Required</h2>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              Signed in as <strong className="text-zinc-200 font-mono">{user.email}</strong> (User Role).
            </p>

            {/* Super Admin Authorization Policy Notice */}
            <div className="mt-5 p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Administrator Authorization Required</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Administrator permissions can only be granted by an existing Super Administrator. Self-elevation is restricted.
              </p>
            </div>

            {/* Switch Account or Return */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={logout}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Switch User</span>
              </button>
              <button
                type="button"
                onClick={onBackToBuilder}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                Return to Builder
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs font-medium ${
            toast.type === "error"
              ? "bg-rose-950/90 border-rose-500/30 text-rose-200"
              : toast.type === "info"
              ? "bg-zinc-900/90 border-zinc-700 text-zinc-200"
              : "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle className="w-4 h-4 text-rose-400" />
          ) : toast.type === "info" ? (
            <Sparkles className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToBuilder}
            className="text-xs px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-300 flex items-center gap-1.5 transition-all border border-white/[0.08] cursor-pointer"
            title="Return to Resume Builder"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">Resume Builder</span>
          </button>

          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                ProResume Command Center
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Admin Panel
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              User Management, Live Revenue & PDF Download Access Control
            </p>
          </div>
        </div>

        {/* Admin User Details & Navigation */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-[10px] font-bold text-zinc-950">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-zinc-200 leading-tight">{user.name}</p>
              <p className="text-[9px] text-amber-400 uppercase font-mono font-bold tracking-wider">Superadmin</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-xs p-2 rounded-xl bg-white/[0.04] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Dashboard & Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Management</span>
              {overview?.metrics?.totalUsers ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-950/30 font-mono">
                  {overview.metrics.totalUsers}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("payments")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "payments"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Transactions & Revenue</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>System & Diagnostics</span>
            </button>
          </div>

          {/* Quick Global Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === "dashboard") fetchOverview();
                if (activeTab === "users") fetchUsers();
                if (activeTab === "payments") fetchPayments();
                showToast("Data refreshed", "info");
              }}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] transition-all cursor-pointer text-xs flex items-center gap-1.5"
              title="Refresh Current View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border border-amber-500/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD & ANALYTICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Users */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Total Registered</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">
                    {overviewLoading ? "..." : overview?.metrics?.totalUsers || 0}
                  </span>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="text-emerald-400 font-semibold">
                      {overview?.metrics?.paidUsers || 0} Paid Passes
                    </span>
                    <span>•</span>
                    <span>{overview?.metrics?.freeUsers || 0} Free</span>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Collected Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-amber-400">
                    ₹{overviewLoading ? "..." : (overview?.metrics?.totalRevenue || 0).toLocaleString("en-IN")}
                  </span>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    {overview?.metrics?.capturedTransactions || 0} verified ₹99 passes
                  </p>
                </div>
              </div>

              {/* Total Downloads */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Total PDF Exports</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-white">
                    {overviewLoading ? "..." : overview?.metrics?.totalDownloads || 0}
                  </span>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    High-res vector resumes generated
                  </p>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Paid Conversion Rate</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-emerald-400">
                    {overviewLoading ? "..." : `${overview?.metrics?.conversionRate || 0}%`}
                  </span>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Users with active ₹99 passes
                  </p>
                </div>
              </div>
            </div>

            {/* Split Section: Recent Signups & System Diagnostics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Recent Signups */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Recent Registrations</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    View All Users →
                  </button>
                </div>

                <div className="divide-y divide-white/[0.05]">
                  {overview?.recentUsers?.map((u) => (
                    <div key={u._id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center text-xs font-bold text-amber-300">
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-zinc-400">{u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {u.isPaid ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            ₹99 Pass
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.04] text-zinc-400 border border-white/10">
                            Free
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!overview?.recentUsers || overview.recentUsers.length === 0) && (
                    <p className="py-6 text-center text-xs text-zinc-500">No users registered yet.</p>
                  )}
                </div>
              </div>

              {/* Right Column: System Diagnostics & Quick Exports */}
              <div className="lg:col-span-5 space-y-4">
                {/* System Status Card */}
                <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">System Diagnostics</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05]">
                      <span className="text-zinc-400">Database Engine:</span>
                      <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        {overview?.system?.dbStatus?.isMemory ? "MongoDB Memory Engine" : "MongoDB Server"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05]">
                      <span className="text-zinc-400">Payment Gateway:</span>
                      <span className="font-mono text-amber-300 font-semibold">
                        {overview?.system?.paymentGateway?.mode || "Sandbox"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05]">
                      <span className="text-zinc-400">Server Runtime:</span>
                      <span className="font-mono text-zinc-300">
                        Node {overview?.system?.nodeVersion || "v20"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05]">
                      <span className="text-zinc-400">Server Uptime:</span>
                      <span className="font-mono text-zinc-300">
                        {Math.floor((overview?.system?.uptimeSeconds || 0) / 60)} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data Export Card */}
                <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08]">
                  <div className="flex items-center gap-2 mb-3">
                    <FileDown className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Export Platform Records</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">
                    Download full CSV backups of registered users and captured financial transactions.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleExportUsers}
                      className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Users CSV</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportPayments}
                      className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Payments CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUsersPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
                {[
                  { id: "all", label: "All Users" },
                  { id: "paid", label: "₹99 Lifetime Pass" },
                  { id: "free", label: "Free Tier" },
                  { id: "admin", label: "Admins" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setUserFilter(f.id);
                      setUsersPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      userFilter === f.id
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Data Table */}
            <div className="rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/60 text-zinc-400 border-b border-white/[0.06] font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                      <th className="py-3.5 px-4">Contact Phone</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4 text-center">Paid Pass (₹99)</th>
                      <th className="py-3.5 px-4 text-center">PDF Downloads</th>
                      <th className="py-3.5 px-4">Registered</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {usersLoading ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-zinc-500">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                          <span>Loading users...</span>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-zinc-500">
                          No users match your search query.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Candidate info */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center text-xs font-bold text-amber-300">
                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <div>
                                <p className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u._id === user?._id && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300">
                                      You
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-zinc-400 font-mono">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                            {u.phone || "—"}
                          </td>

                          {/* Role Pill with Toggle */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleRole(u)}
                              disabled={u._id === user?._id}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                u.role === "admin"
                                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                                  : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
                              } ${u._id === user?._id ? "opacity-60 cursor-not-allowed" : ""}`}
                              title={u._id === user?._id ? "Cannot demote self" : "Click to toggle role"}
                            >
                              {u.role.toUpperCase()}
                            </button>
                          </td>

                          {/* Interactive Toggle Switch for Paid Pass */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePaid(u)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                u.isPaid ? "bg-emerald-500" : "bg-zinc-700"
                              }`}
                              title={u.isPaid ? "Click to Revoke Paid Pass" : "Click to Grant Paid Pass"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  u.isPaid ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </td>

                          {/* Downloads Count */}
                          <td className="py-3.5 px-4 text-center font-mono font-semibold text-zinc-200">
                            {u.downloadCount || 0}
                          </td>

                          {/* Joined Date */}
                          <td className="py-3.5 px-4 text-[11px] text-zinc-400 font-mono">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer"
                                title="Edit Candidate Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPasswordUser(u)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 transition-all cursor-pointer"
                                title="Reset User Password"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                              {u._id !== user?._id && (
                                <button
                                  type="button"
                                  onClick={() => setDeleteUserTarget(u)}
                                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition-all cursor-pointer"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Showing {users.length} of {usersTotal} registered users
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                    disabled={usersPage <= 1}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-zinc-200 px-2">
                    Page {usersPage} of {usersTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setUsersPage(Math.min(usersTotalPages, usersPage + 1))}
                    disabled={usersPage >= usersTotalPages}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS & REVENUE */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order ID, payment ID, or email..."
                  value={paymentSearch}
                  onChange={(e) => {
                    setPaymentSearch(e.target.value);
                    setPaymentsPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5">
                  {["all", "captured", "created", "failed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setPaymentStatusFilter(st);
                        setPaymentsPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        paymentStatusFilter === st
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowManualPaymentModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border border-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/60 text-zinc-400 border-b border-white/[0.06] font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">User Email</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Razorpay Order ID</th>
                      <th className="py-3.5 px-4">Razorpay Payment ID</th>
                      <th className="py-3.5 px-4">Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-zinc-500">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-400" />
                          <span>Loading transaction logs...</span>
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-zinc-500">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 sm:px-6 font-medium text-white">
                            {p.userEmail}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                            ₹{p.amount}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.status === "captured"
                                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                  : p.status === "failed"
                                  ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                                  : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                            <div className="flex items-center gap-1.5">
                              <span>{p.razorpayOrderId}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(p.razorpayOrderId, p._id + "_order")}
                                className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedId === p._id + "_order" ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                            {p.razorpayPaymentId ? (
                              <div className="flex items-center gap-1.5">
                                <span>{p.razorpayPaymentId}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(p.razorpayPaymentId, p._id + "_pay")}
                                  className="text-zinc-500 hover:text-zinc-200 cursor-pointer"
                                  title="Copy Payment ID"
                                >
                                  {copiedId === p._id + "_pay" ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-zinc-400 font-mono">
                            {new Date(p.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Showing {payments.length} of {paymentsTotal} payment entries
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentsPage(Math.max(1, paymentsPage - 1))}
                    disabled={paymentsPage <= 1}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-zinc-200 px-2">
                    Page {paymentsPage} of {paymentsTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPaymentsPage(Math.min(paymentsTotalPages, paymentsPage + 1))}
                    disabled={paymentsPage >= paymentsTotalPages}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM & DIAGNOSTICS */}
        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Administrator Credentials & System Setup</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Configure platform settings, monitor database connection status, and populate demo mock datasets.
              </p>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Default Superadmin Email:</span>
                  <span className="font-mono text-amber-300 font-bold">admin@proresume.com</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Admin Authorization Policy:</span>
                  <span className="font-mono text-zinc-300">Superadmin Role Delegation Only</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Razorpay Fee Model:</span>
                  <span className="font-mono text-emerald-400 font-semibold">₹99 One-Time Lifetime Pass</span>
                </div>
              </div>

              {/* Seed Demo Data Button */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Seed Demo Candidates</h4>
                  <p className="text-[11px] text-zinc-400">
                    Instantly load test resumes, paid users, and sample transaction orders into the database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSeedDemo}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-amber-300 border border-amber-500/20 transition-all cursor-pointer"
                >
                  Seed Sample Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD USER */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={() => {
            setShowAddUserModal(false);
            showToast("New candidate account created!", "success");
            fetchUsers();
            if (activeTab === "dashboard") fetchOverview();
          }}
          token={token}
        />
      )}

      {/* MODAL 2: EDIT USER */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            showToast("Candidate profile updated!", "success");
            fetchUsers();
            if (activeTab === "dashboard") fetchOverview();
          }}
          token={token}
        />
      )}

      {/* MODAL 3: RESET PASSWORD */}
      {passwordUser && (
        <ResetPasswordModal
          user={passwordUser}
          onClose={() => setPasswordUser(null)}
          onSuccess={() => {
            setPasswordUser(null);
            showToast(`Password updated for ${passwordUser.email}!`, "success");
          }}
          token={token}
        />
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteUserTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-950 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete User Account?</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Are you sure you want to permanently delete <strong className="text-zinc-200">{deleteUserTarget.email}</strong>? All associated payment records and access passes will be removed.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteUserTarget(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: MANUAL PAYMENT */}
      {showManualPaymentModal && (
        <ManualPaymentModal
          onClose={() => setShowManualPaymentModal(false)}
          onSuccess={() => {
            setShowManualPaymentModal(false);
            showToast("Manual payment recorded & lifetime pass unlocked!", "success");
            fetchPayments();
            if (activeTab === "dashboard") fetchOverview();
          }}
          token={token}
        />
      )}
    </div>
  );
}

// Sub-Modal: Add User
function AddUserModal({ onClose, onSuccess, token }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, password, role, isPaid }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to create user.");
      }
    } catch (e) {
      setError("Network error creating user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Create Candidate Account</h3>
        <p className="text-xs text-zinc-400 mb-4">Add a new user directly to the platform database.</p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Mobile Phone</label>
            <input
              type="tel"
              required
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Access Pass</label>
              <select
                value={isPaid ? "true" : "false"}
                onChange={(e) => setIsPaid(e.target.value === "true")}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="false">Free Tier</option>
                <option value="true">₹99 Lifetime Pass</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold hover:from-amber-300 hover:to-yellow-400 shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-Modal: Edit User
function EditUserModal({ user, onClose, onSuccess, token }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [role, setRole] = useState(user.role || "user");
  const [isPaid, setIsPaid] = useState(Boolean(user.isPaid));
  const [downloadCount, setDownloadCount] = useState(user.downloadCount || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          role,
          isPaid,
          downloadCount: Number(downloadCount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to update user.");
      }
    } catch (e) {
      setError("Network error updating user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Edit Candidate Profile</h3>
        <p className="text-xs text-zinc-400 mb-4">Modify account parameters and access privileges.</p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Mobile Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-semibold">Access Pass</label>
              <select
                value={isPaid ? "true" : "false"}
                onChange={(e) => setIsPaid(e.target.value === "true")}
                className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="false">Free Tier</option>
                <option value="true">₹99 Lifetime Pass</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Total PDF Downloads</label>
            <input
              type="number"
              min="0"
              value={downloadCount}
              onChange={(e) => setDownloadCount(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold hover:from-amber-300 hover:to-yellow-400 shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-Modal: Reset Password
function ResetPasswordModal({ user, onClose, onSuccess, token }) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${user._id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (e) {
      setError("Network error updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-white mb-1">Set New Password</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Updating security key for <span className="text-amber-300 font-mono">{user.email}</span>.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">New Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold hover:from-amber-300 hover:to-yellow-400 shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-Modal: Manual Payment Record
function ManualPaymentModal({ onClose, onSuccess, token }) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(99);
  const [notes, setNotes] = useState("Offline UPI / Bank Transfer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, amount: Number(amount), notes }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to record manual payment.");
      }
    } catch (e) {
      setError("Network error recording payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Record Offline Payment</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Manually log a transaction and activate the ₹99 lifetime vector PDF pass for any user.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Candidate Email</label>
            <input
              type="email"
              required
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Amount (₹)</label>
            <input
              type="number"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-zinc-300 mb-1 font-semibold">Payment Notes / Reference</label>
            <input
              type="text"
              placeholder="e.g. Offline UPI Ref #12345678"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="mt-5 flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold hover:from-amber-300 hover:to-yellow-400 shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? "Recording..." : "Record & Unlock Pass"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
