import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PaymentModal({ onSuccess }) {
  const {
    paymentModalOpen,
    setPaymentModalOpen,
    createPaymentOrder,
    verifyPayment,
    user,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Pre-load official Razorpay checkout script on mount
  useEffect(() => {
    if (paymentModalOpen && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [paymentModalOpen]);

  if (!paymentModalOpen) return null;

  const handleClose = () => {
    if (loading) return; // Prevent closing mid-transaction
    setPaymentModalOpen(false);
    setError("");
    setSuccessMsg("");
  };

  // Dynamically load Razorpay standard checkout script if not ready
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

  // Launch Official Razorpay Standard Checkout
  const handleRazorpayPayment = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // 1. Create real order on backend server (calls Razorpay Orders API)
      const orderData = await createPaymentOrder();

      if (orderData.alreadyPaid) {
        setSuccessMsg("You already have unlimited download access!");
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 600);
        return;
      }

      // 2. Ensure official Razorpay SDK script is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Failed to load the Razorpay checkout gateway. Please check your internet connection and try again."
        );
      }

      // Format contact number for Razorpay (10 digits)
      const sanitizedPhone = user?.phone
        ? user.phone.replace(/\D/g, "").slice(-10)
        : "";

      // 3. Configure official Razorpay Checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // 9900 paise = ₹99.00
        currency: orderData.currency || "INR",
        name: "ProResume Studio",
        description: "Vector PDF Download & ATS Printing Pass",
        image: "/favicon.svg",
        order_id: orderData.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: sanitizedPhone,
        },
        notes: {
          userId: String(user?._id || user?.id || ""),
          email: user?.email || "",
          purpose: "Resume Download Pass",
        },
        theme: {
          color: "#c59b27", // Champagne Gold theme accent
          backdrop_color: "rgba(0, 0, 0, 0.8)",
        },
        handler: async function (response) {
          try {
            setLoading(true);
            setSuccessMsg("Verifying payment with Razorpay...");

            // Call backend endpoint to cryptographically verify HMAC-SHA256 signature
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccessMsg("Payment verified successfully! Downloading your resume...");
            setTimeout(() => {
              handleClose();
              if (onSuccess) onSuccess();
            }, 800);
          } catch (err) {
            console.error("[Razorpay Verification Error]:", err);
            setError(
              err.message ||
                "Payment was processed by Razorpay but signature verification failed. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log("[Razorpay Checkout]: Checkout popup was closed by user.");
          },
        },
      };

      // 4. Open the official Razorpay Checkout dialog
      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        console.error("[Razorpay Payment Failed]:", response.error);
        setError(
          response.error?.description ||
            response.error?.reason ||
            "Payment failed or was cancelled. Please try again."
        );
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error("[Razorpay Checkout Error]:", err);
      setError(
        err.message ||
          "Unable to initialize Razorpay checkout. Please try again."
      );
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
          disabled={loading}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer z-10 disabled:opacity-30"
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
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("open-support", {
                    detail: {
                      category: "payment",
                      subject: "Payment Issue with ₹99 Pass",
                      message: `I encountered an issue during payment checkout: "${error}"`,
                    },
                  })
                );
              }}
              className="text-amber-400 hover:text-amber-300 underline font-medium text-[11px] self-start cursor-pointer"
            >
              Need payment assistance? Contact support now →
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Primary Razorpay Gateway Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRazorpayPayment}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting to Razorpay...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹99 via Razorpay (UPI / Cards / NetBanking)</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </button>
        </div>

        {/* Supported Payment Methods Badge List */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
          <span>UPI (GPay / PhonePe / Paytm)</span>
          <span>•</span>
          <span>Debit & Credit Cards</span>
          <span>•</span>
          <span>NetBanking</span>
        </div>

        {/* Security & User Details Footer */}
        <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit SSL • Official Razorpay Gateway</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>{user?.email || "Authenticated"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
