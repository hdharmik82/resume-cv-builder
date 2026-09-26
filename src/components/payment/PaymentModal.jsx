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
  ArrowLeft,
  Smartphone,
  Building2,
  Info,
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
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedOrder, setSimulatedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'card' | 'netbanking'
  const [testUpiApp, setTestUpiApp] = useState("gpay");

  if (!paymentModalOpen) return null;

  const handleClose = () => {
    setPaymentModalOpen(false);
    setError("");
    setSuccessMsg("");
    setShowSimulator(false);
    setSimulatedOrder(null);
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

      // Check if real merchant keys or local mock test keys are configured
      const isMockKey =
        !orderData.keyId ||
        orderData.keyId.includes("mock") ||
        orderData.keyId === "rzp_test_proresume_mock";

      if (isMockKey) {
        // Launch Interactive Razorpay Test Portal Simulator
        setSimulatedOrder(orderData);
        setShowSimulator(true);
        setLoading(false);
        return;
      }

      // 2. Real keys configured: Load official Razorpay SDK script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(
          "Razorpay SDK failed to load. You can use the Sandbox Test Payment button below."
        );
      }

      // 3. Configure official Razorpay options
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

  // Complete simulated payment through the interactive Razorpay test portal
  const handleCompleteSimulatedPayment = async () => {
    setError("");
    setLoading(true);

    try {
      const orderId = simulatedOrder?.orderId || `order_sb_${Date.now()}`;
      await sandboxCompletePayment(orderId);

      setSuccessMsg("Payment verified (₹99.00)! Vector PDF downloading...");
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err) {
      setError(err.message || "Simulated payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFailure = () => {
    setError("Payment simulation: Transaction cancelled or declined in test mode.");
  };

  // Direct Sandbox Test Mode Payment
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
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {showSimulator ? (
          <div>
            {/* Razorpay Simulator Header */}
            <div className="bg-[#0b1a30] border-b border-blue-900/40 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-5 mb-5 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSimulator(false);
                      setError("");
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer mr-1"
                    title="Back to options"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-[#3399cc] tracking-tight">
                        Razorpay
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        Test Mode
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Order: {simulatedOrder?.orderId || "order_sb_active"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    Amount
                  </div>
                  <div className="text-xl font-black text-amber-400">₹99.00</div>
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

            {/* Simulated Payment Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "upi"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "card"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "netbanking"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] mb-5">
              {paymentMethod === "upi" && (
                <div className="space-y-3">
                  <div className="text-xs text-zinc-300 font-medium">Select Test UPI App:</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: "gpay", label: "Google Pay" },
                      { id: "phonepe", label: "PhonePe" },
                      { id: "paytm", label: "Paytm UPI" },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setTestUpiApp(app.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          testUpiApp === app.id
                            ? "bg-blue-500/10 border-blue-400/50 text-blue-300 font-bold"
                            : "bg-zinc-800/40 border-white/[0.06] text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-400 pt-1 flex items-center justify-between">
                    <span>Virtual UPI ID:</span>
                    <span className="font-mono text-zinc-200">{user?.email?.split("@")[0] || "user"}@okrazorpay</span>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-2 text-xs">
                  <div className="text-zinc-300 font-medium">Razorpay Standard Test Card:</div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 font-mono space-y-1.5 text-zinc-300">
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>TEST CARD</span>
                      <span className="text-[10px] text-emerald-400">SUCCESS SIMULATOR</span>
                    </div>
                    <div className="text-sm font-bold tracking-widest text-white">4111 •••• •••• 1111</div>
                    <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
                      <span>EXP: 12/28</span>
                      <span>CVV: 123</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-2 text-xs">
                  <div className="text-zinc-300 font-medium">Select Test Bank:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"].map((bank, i) => (
                      <div
                        key={bank}
                        className={`p-2 rounded-xl border text-[11px] text-center ${
                          i === 0
                            ? "bg-blue-500/10 border-blue-400/50 text-blue-300 font-semibold"
                            : "bg-zinc-800/40 border-white/[0.06] text-zinc-400"
                        }`}
                      >
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Test Simulation Notice */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-5 text-[11px] text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong>Sandbox Simulator:</strong> Simulates a successful ₹99 Razorpay transaction. It securely updates your account in local MongoDB and immediately triggers the vector PDF download.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleCompleteSimulatedPayment}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay ₹99.00 (Simulate Success)</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSimulateFailure}
                disabled={loading}
                className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-xs font-medium text-zinc-400 hover:text-rose-300 transition-all cursor-pointer text-center"
              >
                Simulate Payment Failure / User Cancel
              </button>
            </div>

            {/* Live Dashboard Notice */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] text-zinc-400 flex items-center justify-between">
              <span>Razorpay Test Gateway v1</span>
              <span>Account: {user?.email || "Guest"}</span>
            </div>
          </div>
        ) : (
          /* Normal Price Card View */
          <div>
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
        )}
      </div>
    </div>
  );
}
