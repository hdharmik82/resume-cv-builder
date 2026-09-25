import React, { useState } from "react";
import {
  X,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PaymentModal({ onSuccess }) {
  const {
    paymentModalOpen,
    setPaymentModalOpen,
    createPaymentOrder,
    verifyPayment,
    sandboxCompletePayment,
    user,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!paymentModalOpen) return null;

  const handleClose = () => {
    setPaymentModalOpen(false);
    setError("");
    setSuccessMsg("");
  };

  // Dynamically load Razorpay standard checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Launch Standard Razorpay Checkout
  const handleRazorpayPayment = async () => {
    setError("");
    setLoading(true);

    try {
      // 1. Create order on server
      const orderData = await createPaymentOrder();

      if (orderData.alreadyPaid) {
        setSuccessMsg("You already have download access!");
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 600);
        return;
      }

      // 2. Load script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Razorpay SDK failed to load. You can use the Sandbox Test Payment button below."
        );
      }

      // 3. Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // 9900 paise = ₹99
        currency: orderData.currency || "INR",
        name: "ProResume Studio",
        description: "Vector PDF Download & Print Pass",
        order_id: orderData.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#c59b27", // Champagne Gold theme accent
        },
        handler: async function (response) {
          try {
            setLoading(true);
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccessMsg("Payment verified! Downloading your resume...");
            setTimeout(() => {
              handleClose();
              if (onSuccess) onSuccess();
            }, 600);
          } catch (err) {
            setError(err.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setError(response.error?.description || "Payment was not completed.");
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.warn("Razorpay Checkout flow warning:", err);
      setError(
        err.message ||
          "Unable to open Razorpay gateway. Please try the Instant Sandbox Test button below."
      );
    } finally {
      setLoading(false);
    }
  };

  // Sandbox Test Mode Payment
  const handleSandboxPayment = async () => {
    setError("");
    setLoading(true);

    try {
      const orderData = await createPaymentOrder();
      await sandboxCompletePayment(orderData.orderId);

      setSuccessMsg("Sandbox payment verified (₹99)! Downloading PDF...");
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err) {
      setError(err.message || "Sandbox payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-zinc-950/95 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Razorpay Secure Checkout</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Unlock High-Resolution PDF Export
          </h2>

          <p className="mt-1 text-xs text-zinc-400">
            One-time nominal payment of ₹99 unlocks lifetime vector PDF downloads and printing.
          </p>
        </div>

        {/* Price Card */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] mb-5 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs font-semibold mb-1">
            <span>One-Time Download Pass</span>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-white">₹99</span>
            <span className="text-xs text-zinc-400 font-medium">/ lifetime access</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-left text-[11px] text-zinc-300 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Vector-Crisp A4 Layout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>All 4 ATS Templates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Zero Ads & Watermarks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Unlimited Re-downloads</span>
            </div>
          </div>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Main Razorpay Gateway Button */}
          <button
            type="button"
            onClick={handleRazorpayPayment}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹99 via Razorpay (UPI / Cards / NetBanking)</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </button>

          {/* Instant Sandbox Test Mode Button */}
          <button
            type="button"
            onClick={handleSandboxPayment}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-amber-500/30 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ Instant Sandbox Test Pay (₹99 Test Simulation)</span>
          </button>
        </div>

        {/* Security & User Details Footer */}
        <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit SSL • Razorpay Sandbox</span>
          </div>
          <span>Account: {user?.email || "Guest"}</span>
        </div>
      </div>
    </div>
  );
}
