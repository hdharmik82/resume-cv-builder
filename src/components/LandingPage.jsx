import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  Download,
  Palette,
  ShieldCheck,
  Zap,
  Layout,
  Briefcase,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  LogIn,
  LogOut,
  CreditCard
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./auth/AuthModal";
import PaymentModal from "./payment/PaymentModal";

export default function LandingPage({ onStartBuilding }) {
  const templates = [
    {
      id: "modern",
      name: "Modern Tech",
      tagline: "High-impact layout with clean accent lines, photo display, and skill pills",
      badge: "Popular",
      accent: "#c59b27",
      sampleRole: "Senior Software Engineer"
    },
    {
      id: "classic",
      name: "Classic Serif",
      tagline: "Formal traditional structure ideal for academia, law, and corporate CVs",
      badge: "Corporate",
      accent: "#7c3aed",
      sampleRole: "Principal Consultant & Analyst"
    },
    {
      id: "minimalist",
      name: "Minimalist ATS",
      tagline: "High-whitespace single column optimized for automated applicant tracking systems",
      badge: "ATS Optimized",
      accent: "#52525b",
      sampleRole: "Data Scientist & AI Researcher"
    },
    {
      id: "executive",
      name: "Executive Sidebar",
      tagline: "Dual-column layout highlighting leadership traits, skills, and credentials",
      badge: "Executive",
      accent: "#b76e79",
      sampleRole: "Director of Product Management"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Real-Time Live A4 Preview",
      description: "See your resume update dynamically as you type, formatted with high fidelity for standard A4 paper."
    },
    {
      icon: Download,
      title: "Vector-Crisp PDF Export",
      description: "Direct vector printing generates pristine, ultra-sharp PDFs with selectable text and functional links."
    },
    {
      icon: Layout,
      title: "4 Purpose-Built Templates",
      description: "Switch between Modern, Classic, Minimalist, and Executive formats seamlessly with zero loss of data."
    },
    {
      icon: Palette,
      title: "Curated Luxury Palettes",
      description: "Champagne Gold, Royal Amethyst, Rose Gold, Warm Copper, Obsidian Platinum, and Velvet Plum."
    },
    {
      icon: ShieldCheck,
      title: "100% Private & In-Browser",
      description: "Your information never leaves your browser storage. Zero tracking, zero ads, zero database retention."
    },
    {
      icon: FileText,
      title: "JSON Backup & Presets",
      description: "Export and import lightweight JSON backups anytime, or jumpstart with instant professional presets."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Select a Layout",
      desc: "Choose between Modern, Classic, Minimalist, or Executive styles."
    },
    {
      num: "02",
      title: "Enter Your Details",
      desc: "Input your career experience, education, skills, and optional headshot."
    },
    {
      num: "03",
      title: "Export PDF",
      desc: "Generate and download a job-ready vector PDF document with 1 click."
    }
  ];

  const { user, isPaid, logout, setAuthModalOpen, setPaymentModalOpen } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const faqs = [
    {
      q: "How much does it cost to build and download a resume?",
      a: "ProResume Studio allows you to create, edit, style, and preview resumes 100% free with no time limits or subscriptions. To download the print-ready, high-resolution vector A4 PDF document, we charge a nominal, one-time payment of ₹99 via Razorpay, granting you lifetime re-download access."
    },
    {
      q: "Why do I need to create an account before downloading?",
      a: "Creating a quick account with your name, email, and mobile number securely registers your ₹99 lifetime download pass with your profile in our MongoDB database, enabling you to sign in from anywhere and re-download your resume without paying again."
    },
    {
      q: "Are the resume templates ATS-friendly?",
      a: "Yes. All templates (Modern, Classic, Minimalist, and Executive) are crafted according to Applicant Tracking System (ATS) guidelines, featuring semantic section headings, standard fonts, and parseable content hierarchies."
    },
    {
      q: "Which payment methods are accepted by Razorpay?",
      a: "Our Razorpay gateway supports all major payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), NetBanking, and Digital Wallets."
    },
    {
      q: "How does ProResume Studio protect my data?",
      a: "Your account credentials and payment records are protected with 256-bit encryption and strict security controls. Your career information is private, and we never sell your personal data."
    }
  ];

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-400 selection:text-zinc-950">
      {/* Ambient Luxury Lighting & Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-amber-500/10 via-violet-500/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] -right-24 w-[450px] h-[450px] bg-amber-500/[0.04] blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] -left-24 w-[450px] h-[450px] bg-violet-600/[0.04] blur-[140px] pointer-events-none -z-10" />

      {/* Top Navbar with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                ProResume Studio
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/[0.05] text-amber-300 border border-white/10 backdrop-blur-sm">
                Fast & ATS-Optimized
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <a href="#templates" className="hover:text-amber-300 transition-colors">
              Templates
            </a>
            <a href="#features" className="hover:text-amber-300 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-amber-300 transition-colors">
              Workflow
            </a>
            <a href="#faq" className="hover:text-amber-300 transition-colors">
              FAQ & Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* User Account Pill or Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-200 flex items-center gap-2 transition-all border border-white/[0.08] cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] font-bold text-zinc-950">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[90px] truncate">{user.name}</span>
                  {isPaid ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ₹99 Pass
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/[0.05] text-zinc-400 border border-white/10">
                      Free
                    </span>
                  )}
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl p-2 z-50 text-xs text-zinc-200">
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                    </div>
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserDropdown(false);
                          setPaymentModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-500/10 text-amber-300 font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Unlock Downloads (₹99)</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm text-zinc-200 flex items-center gap-1.5 transition-all border border-white/[0.08] cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-semibold">Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onStartBuilding()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Launch Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-zinc-200 text-xs font-medium mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast, ATS-Optimized Resume Creator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Create Professional Resumes & CVs{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
              In Minutes.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Clean, distraction-free resume builder with instantaneous live A4 preview, multiple formats, and 1-click vector PDF export.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => onStartBuilding()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md text-zinc-300 border border-white/[0.08] transition-all"
            >
              View Templates
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>No Sign-Up or Account</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>ATS-Friendly Single/Dual Column</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Free Vector PDF Export</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Zero Tracking & 100% Private</span>
            </div>
          </div>

          {/* Clean Mockup Card with Glassmorphism */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-6 text-left shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] text-xs text-zinc-400">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80 inline-block" />
                <span className="text-zinc-500 ml-1">Live Studio Workspace</span>
              </div>
              <button
                type="button"
                onClick={() => onStartBuilding()}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-xs cursor-pointer"
              >
                <span>Open Editor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {/* Form card preview */}
              <div className="md:col-span-5 bg-zinc-950/70 backdrop-blur-md p-4 rounded-xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Work Experience</span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-white/[0.05] space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-200">Staff Systems Architect</span>
                    <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Present</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Vanguard Tech Systems • San Francisco, CA</p>
                  <p className="text-[11px] text-zinc-500">
                    • Architected microservices processing 15,000+ RPS...
                  </p>
                </div>
              </div>

              {/* Sheet preview */}
              <div className="md:col-span-7 bg-white text-zinc-900 p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="border-b-2 pb-3 mb-3 border-amber-500 flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black text-zinc-900">Alexander Wright</h4>
                      <p className="text-xs font-semibold text-amber-700">Senior Full-Stack Engineer & Cloud Architect</p>
                      <p className="text-[10px] text-zinc-500 mt-1">alexander.wright@example.com • +1 (555) 234-5678 • San Francisco, CA</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-700 leading-snug">
                    <strong>Summary:</strong> Dynamic Senior Engineer with 8+ years architecting high-concurrency cloud distributed systems and microservices...
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {["React", "Node.js", "Go", "AWS EKS", "PostgreSQL", "Docker"].map((tech) => (
                      <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onStartBuilding()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer"
                  >
                    <span>Edit Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="py-20 bg-zinc-950/60 backdrop-blur-xl border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Tailored Layouts</h2>
            <p className="text-3xl font-black text-white tracking-tight">
              4 Distinct Resume & CV Templates
            </p>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Select any layout. Switch formats at any time without losing any entered text.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="glass-card backdrop-blur-md bg-zinc-900/40 border border-white/[0.07] hover:border-amber-400/40 p-5 rounded-2xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/10">
                      {tpl.badge}
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: tpl.accent }} />
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {tpl.tagline}
                  </p>

                  <div className="mt-4 p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05] text-[11px]">
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono mb-0.5">Best For:</span>
                    <span className="font-medium text-zinc-300">{tpl.sampleRole}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartBuilding(tpl.id)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-zinc-950 text-zinc-200 border border-white/[0.08] transition-all cursor-pointer"
                >
                  <span>Select Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Core Capabilities</h2>
            <p className="text-3xl font-black text-white tracking-tight">
              Fast, Responsive, and Lightweight
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card backdrop-blur-md bg-zinc-900/40 border border-white/[0.07] p-6 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-zinc-950/60 backdrop-blur-xl border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Workflow</h2>
            <p className="text-3xl font-black text-white tracking-tight">
              3 Steps to a Job-Ready Resume
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="glass-card backdrop-blur-md bg-zinc-900/30 border border-white/[0.06] p-6 rounded-2xl">
                <span className="text-2xl font-black text-amber-400/40 font-mono block mb-2">{st.num}</span>
                <h3 className="text-base font-bold text-white mb-1.5">{st.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Optimized for SEO & Google Rich Snippets) */}
      <section id="faq" className="py-20 bg-zinc-950/40 backdrop-blur-xl border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-400 text-xs font-semibold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Got Questions? We Have Answers.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Everything you need to know about creating ATS-friendly resumes and exporting vector PDFs.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 pr-4">
                      {faq.q}
                    </h3>
                    <div className={`w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-400" : ""}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner with Glassmorphism */}
      <section className="py-20 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-panel rounded-3xl p-10 md:p-14 border border-white/[0.1] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[90px] pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Build Your Resume?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Start right now without creating an account or paying fees. Instant live editing and PDF download.
            </p>
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => onStartBuilding()}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 shadow-xl shadow-amber-500/25 transition-all cursor-pointer"
              >
                <span>Launch Resume Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-zinc-950/80 backdrop-blur-md py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950">
              <FileText className="w-3 h-3" />
            </div>
            <span className="font-bold text-zinc-300">ProResume Studio</span>
          </div>
          <p>© {new Date().getFullYear()} ProResume Studio. Built with ReactJS & Tailwind CSS.</p>
          <div className="flex items-center gap-5">
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              FAQ
            </a>
            <button
              type="button"
              onClick={() => onStartBuilding()}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              Launch Builder →
            </button>
          </div>
        </div>
      </footer>

      {/* Auth & Payment Modals */}
      <AuthModal />
      <PaymentModal />
    </div>
  );
}
