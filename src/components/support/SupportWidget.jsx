import React, { useState, useEffect } from "react";
import {
  LifeBuoy,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  LogIn,
  FileDown,
  Wrench,
  HelpCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const CATEGORIES = [
  { id: "payment", label: "Payment Issue (₹99 Pass)", icon: CreditCard, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "login", label: "Login & Account", icon: LogIn, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "export", label: "Resume Export / PDF", icon: FileDown, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "builder", label: "Resume Builder Bug", icon: Wrench, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "other", label: "General Inquiry", icon: HelpCircle, color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
];

export default function SupportWidget() {
  const { user, token } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("payment");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync user info if logged in
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Listen to programmatic open triggers (e.g. from payment error or login error)
  useEffect(() => {
    const handleOpenSupport = (e) => {
      setIsOpen(true);
      if (e?.detail?.category) {
        setCategory(e.detail.category);
      }
      if (e?.detail?.subject && !subject) {
        setSubject(e.detail.subject);
      }
      if (e?.detail?.message && !message) {
        setMessage(e.detail.message);
      }
    };

    window.addEventListener("open-support", handleOpenSupport);
    return () => window.removeEventListener("open-support", handleOpenSupport);
  }, [subject, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address so our team can follow up.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      setError("Please describe the issue in detail (at least 5 characters).");
      return;
    }

    setSubmitting(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/support/ticket`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: trimmedEmail,
          category,
          subject: subject.trim() || `${category.toUpperCase()} Issue Inquiry`,
          message: trimmedMessage,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit support request. Please try again.");
      }

      setSubmittedTicket(data.ticketId);
      // Reset form
      setMessage("");
      setSubject("");
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setError("");
  };

  return (
    <aside aria-label="Customer Support Widget" className="no-print">
      {/* 1. FLOATING ACTION BUTTON (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white backdrop-blur-xl border border-white/[0.12] hover:border-amber-400/40 shadow-2xl hover:shadow-amber-500/10 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          title="Need Help? Contact Support"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <LifeBuoy className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold tracking-wide">Support & Help</span>
        </button>
      )}

      {/* 2. FLOATING SUPPORT FORM POP-UP DIALOG */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-dialog-title"
          className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] max-h-[85vh] flex flex-col rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Pop-up Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <h3 id="support-dialog-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                  Need Help?
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400">
                    Live Assistance
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Submit a ticket for payments, login, or exports.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Close support window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pop-up Body / Scrollable Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-zinc-300">
            {/* SUCCESS STATE */}
            {submittedTicket ? (
              <div className="py-6 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Ticket Submitted Successfully!</h4>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    Our support administrators have received your inquiry. We will review it and reply directly to your email.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/[0.08] flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                      Ticket Reference ID
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {submittedTicket}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Copy Ticket ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-2 justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300 transition-all cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* SUPPORT FORM */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      const isSelected = category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCategory(c.id)}
                          className={`p-2 rounded-xl text-left border text-[11px] font-medium flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? `${c.color} ring-1 ring-amber-400/40 font-semibold`
                              : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                          } ${c.id === "other" ? "col-span-2" : ""}`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Your Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] focus:border-amber-400/50 text-white placeholder-zinc-500 text-xs outline-none transition-all"
                  />
                </div>

                {/* Name (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Your Name <span className="text-zinc-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] focus:border-amber-400/50 text-white placeholder-zinc-500 text-xs outline-none transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Subject / Short Summary
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      category === "payment"
                        ? "e.g., Payment completed but pass still locked"
                        : category === "export"
                        ? "e.g., PDF formatting error or print issue"
                        : "e.g., Cannot sign in to my account"
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] focus:border-amber-400/50 text-white placeholder-zinc-500 text-xs outline-none transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Detailed Description <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe what occurred, any error message you saw, or how we can assist you..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] focus:border-amber-400/50 text-white placeholder-zinc-500 text-xs outline-none resize-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Support Ticket</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-500 text-center">
                  Protected by secure end-to-end administration. Response typically within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
