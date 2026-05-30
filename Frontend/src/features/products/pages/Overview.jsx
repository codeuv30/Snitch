import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3, Package, Download, TrendingUp, Settings,
  User, Bell, Plus, ArrowUpRight, ArrowRight,
  ShoppingBag, Zap, Eye, DollarSign,
  Clock, CheckCircle2, AlertCircle, Circle,
} from "lucide-react";

// ─── Fonts & Animations ───────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    @keyframes in-up {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes in-left {
      from { opacity: 0; transform: translateX(-14px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes ticker {
      0%   { transform: translateY(0); }
      20%  { transform: translateY(-100%); }
      40%  { transform: translateY(-200%); }
      60%  { transform: translateY(-300%); }
      80%  { transform: translateY(-400%); }
      100% { transform: translateY(-400%); }
    }
    @keyframes bar-grow {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    @keyframes number-count {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }
    @keyframes shimmer-dark {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes line-draw {
      from { stroke-dashoffset: 1000; }
      to   { stroke-dashoffset: 0; }
    }

    .anim-up-1  { animation: in-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
    .anim-up-2  { animation: in-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
    .anim-up-3  { animation: in-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
    .anim-up-4  { animation: in-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
    .anim-up-5  { animation: in-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.33s both; }
    .anim-up-6  { animation: in-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.40s both; }
    .anim-left  { animation: in-left 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
    .anim-fade  { animation: fade-in 0.4s ease-out 0.2s both; }

    .bar-animate { animation: bar-grow 0.9s cubic-bezier(0.16,1,0.3,1) both; transform-origin: bottom; }

    .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

    .ticker-wrap { height: 1.2em; overflow: hidden; }
    .ticker-inner { animation: ticker 8s steps(1) infinite; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

    .stat-hover {
      transition: background 0.2s, border-color 0.2s, transform 0.2s;
    }
    .stat-hover:hover {
      background: #1a1a1a !important;
      border-color: #2a2a2a !important;
      transform: translateY(-3px);
    }

    .nav-btn {
      transition: background 0.15s, color 0.15s;
    }
    .nav-btn:hover {
      background: #1e1e1e;
      color: #f0ede8;
    }
  `}</style>
);

// ─── Sidebar ──────────────────────────────────────────────────────
const Sidebar = ({ activeItem = "overview" }) => {
  const navigate = useNavigate();
  const items = [
    { id: "overview",  label: "Overview",  icon: BarChart3,  path: "/seller/dashboard" },
    { id: "products",  label: "Products",  icon: Package,    path: "/seller/dashboard/products" },
    { id: "orders",    label: "Orders",    icon: Download,   path: "/seller/dashboard/orders" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/seller/dashboard/analytics" },
    { id: "settings",  label: "Settings",  icon: Settings,   path: "/seller/dashboard/settings" },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 z-40 w-[220px] min-h-screen"
      style={{ background: "#0d0d0d", borderRight: "1px solid #1c1c1c" }}
    >
      {/* Logo */}
      <div className="px-6 py-7" style={{ borderBottom: "1px solid #1c1c1c" }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "22px",
          letterSpacing: "0.18em",
          color: "#f0ede8",
          fontWeight: 500,
        }}>SNITCH</span>
        <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "4px" }}>
          Seller Studio
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map(({ id, label, icon: Icon, path }) => {
          const active = activeItem === id;
          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              className="nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left"
              style={{
                fontSize: "12px",
                letterSpacing: "0.04em",
                background: active ? "#1a1a1a" : "transparent",
                color: active ? "#f0ede8" : "#555",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: active ? 500 : 400,
                borderLeft: active ? "2px solid #c4956a" : "2px solid transparent",
              }}
            >
              <Icon size={14} style={{ opacity: active ? 1 : 0.5 }} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid #1c1c1c" }}>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
            <User size={13} style={{ color: "#555" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "12px", color: "#d0cdc8", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Utkarsh Verma
            </p>
            <p style={{ fontSize: "10px", color: "#444", letterSpacing: "0.06em" }}>Seller</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ─── Mobile Header ────────────────────────────────────────────────
const MobileHeader = () => (
  <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3"
    style={{ background: "#0d0d0d", borderBottom: "1px solid #1c1c1c" }}>
    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", letterSpacing: "0.15em", color: "#f0ede8" }}>
      SNITCH
    </span>
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: "#1a1a1a", border: "1px solid #222" }}>
        <Bell size={14} style={{ color: "#888" }} />
      </button>
    </div>
  </div>
);

// ─── Sparkline SVG ────────────────────────────────────────────────
const Sparkline = ({ data, color = "#c4956a", delay = 0 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `${pts} ${w},${h} 0,${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 36, overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${delay}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${delay})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1000"
        strokeDashoffset="0"
        style={{ animation: `line-draw 1.2s ease-out ${delay}s both` }}
      />
    </svg>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────
const MiniBarChart = ({ data, labels }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-sm overflow-hidden" style={{ height: "64px", display: "flex", alignItems: "flex-end" }}>
            <div
              className="w-full rounded-sm bar-animate"
              style={{
                height: `${(v / max) * 100}%`,
                background: i === data.length - 1 ? "#c4956a" : "#1e1e1e",
                animationDelay: `${i * 0.07 + 0.4}s`,
                border: i === data.length - 1 ? "none" : "1px solid #222",
              }}
            />
          </div>
          <span style={{ fontSize: "9px", color: "#444", fontFamily: "'DM Mono', monospace" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Animated Counter ─────────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = "", suffix = "", delay = 0 }) => {
  const [displayed, setDisplayed] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const num = parseFloat(value);
    const steps = 40;
    const duration = 900;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(num * eased);
        if (step >= steps) { clearInterval(interval); setDisplayed(num); setDone(true); }
      }, stepTime);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const fmt = (n) => {
    if (suffix === "L") return n.toFixed(1);
    if (Number.isInteger(parseFloat(value))) return Math.round(n).toString().padStart(2, "0");
    return n.toFixed(1);
  };

  return (
    <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {prefix}{fmt(displayed)}{suffix}
    </span>
  );
};

// ─── Activity Feed Item ───────────────────────────────────────────
const ActivityItem = ({ type, label, sub, time, isLast }) => {
  const configs = {
    success: { icon: CheckCircle2, color: "#4ade80", bg: "#0f2010" },
    order:   { icon: ShoppingBag,  color: "#60a5fa", bg: "#0c1a2e" },
    product: { icon: Package,      color: "#c4956a", bg: "#1e140a" },
    warning: { icon: AlertCircle,  color: "#fbbf24", bg: "#1e1700" },
    draft:   { icon: Clock,        color: "#888",    bg: "#141414" },
  };
  const { icon: Icon, color, bg } = configs[type] || configs.draft;

  return (
    <div className="flex items-start gap-3 group" style={{ paddingBottom: isLast ? 0 : "14px" }}>
      {/* Timeline line */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: bg, border: `1px solid ${color}22` }}>
          <Icon size={13} style={{ color }} />
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, minHeight: 14, background: "#1c1c1c", marginTop: 4 }} />}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p style={{ fontSize: "12.5px", color: "#d0cdc8", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
          {label}
        </p>
        <p style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>{sub}</p>
      </div>
      <span style={{ fontSize: "10px", color: "#333", fontFamily: "'DM Mono', monospace", flexShrink: 0, paddingTop: 2 }}>
        {time}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// OVERVIEW PAGE
// ═══════════════════════════════════════════════════════════════════

const Overview = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const weekBars   = [42, 58, 31, 75, 64, 88, 97];
  const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const sparkRevenue = [28, 42, 35, 58, 47, 63, 55, 71, 68, 84, 78, 96];
  const sparkOrders  = [5, 9, 7, 14, 11, 18, 13, 22, 19, 26, 21, 30];
  const sparkViews   = [120, 180, 145, 210, 190, 260, 230, 310, 280, 350, 320, 410];

  const stats = [
    {
      label: "Revenue",
      value: "2.4", prefix: "₹", suffix: "L",
      change: "+8.2%",
      positive: true,
      spark: sparkRevenue,
      sparkColor: "#c4956a",
      sub: "vs last month",
      delay: 0.1,
    },
    {
      label: "Orders",
      value: "138", prefix: "", suffix: "",
      change: "+12",
      positive: true,
      spark: sparkOrders,
      sparkColor: "#60a5fa",
      sub: "this month",
      delay: 0.18,
    },
    {
      label: "Page Views",
      value: "5.2", prefix: "", suffix: "K",
      change: "+340",
      positive: true,
      spark: sparkViews,
      sparkColor: "#a78bfa",
      sub: "last 30 days",
      delay: 0.26,
    },
  ];

  const activity = [
    { type: "success", label: "Order #1042 fulfilled",      sub: "Linen Blazer · ₹4,200",        time: "2m" },
    { type: "order",   label: "New order received",          sub: "Cotton Kurta Set · ₹2,800",    time: "18m" },
    { type: "product", label: "Product published",           sub: "Silk Maxi Dress",               time: "1h" },
    { type: "warning", label: "Low stock alert",             sub: "Indigo Denim Jacket · 2 left", time: "3h" },
    { type: "draft",   label: "Draft saved",                 sub: "Handloom Shawl",               time: "5h" },
  ];

  const quickActions = [
    { label: "Add Product",    icon: Plus,        path: "/seller/dashboard/create-product", accent: true },
    { label: "View Products",  icon: Package,     path: "/seller/dashboard/products" },
    { label: "Check Orders",   icon: ShoppingBag, path: "/seller/dashboard/orders" },
    { label: "Analytics",      icon: TrendingUp,  path: "/seller/dashboard/analytics" },
  ];

  return (
    <div className="min-h-screen font-['DM_Sans']" style={{ background: "#0a0a0a", color: "#f0ede8" }}>
      <FontLoader />
      <MobileHeader />
      <Sidebar activeItem="overview" />

      <div className="lg:ml-[220px] min-h-screen flex flex-col">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
          style={{ background: "#0a0a0a", borderBottom: "1px solid #141414" }}>
          <div className="anim-left">
            <p style={{ fontSize: "9px", color: "#c4956a", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
              Seller Studio · Overview
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 400, lineHeight: 1.1, color: "#f0ede8", marginTop: 2 }}>
              Good morning, Utkarsh
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Live clock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "#111", border: "1px solid #1c1c1c" }}>
              <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: "#4ade80", display: "inline-block" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#555" }}>
                {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>

            <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#111", border: "1px solid #1c1c1c" }}>
              <Bell size={14} style={{ color: "#555" }} />
            </button>

            <button
              onClick={() => navigate("/seller/dashboard/create-product")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{ background: "#c4956a", color: "#0a0a0a", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}
              onMouseEnter={e => e.currentTarget.style.background = "#d4a57a"}
              onMouseLeave={e => e.currentTarget.style.background = "#c4956a"}
            >
              <Plus size={13} />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-5">

          {/* ── Top row: Stats ───────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`stat-hover rounded-xl p-5 anim-up-${i + 2} relative overflow-hidden`}
                style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", cursor: "default" }}
              >
                {/* Label */}
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontSize: "9px", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                    {s.label}
                  </span>
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded"
                    style={{ fontSize: "10px", background: s.positive ? "#0f2010" : "#200f0f", color: s.positive ? "#4ade80" : "#f87171", fontFamily: "'DM Mono', monospace" }}
                  >
                    <ArrowUpRight size={9} />
                    {s.change}
                  </span>
                </div>

                {/* Number */}
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 42px)", fontWeight: 300, color: "#f0ede8", lineHeight: 1 }}>
                  <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} delay={s.delay} />
                </div>
                <p style={{ fontSize: "10px", color: "#333", marginTop: "4px", fontFamily: "'DM Mono', monospace" }}>{s.sub}</p>

                {/* Sparkline */}
                <div className="mt-4" style={{ opacity: 0.8 }}>
                  <Sparkline data={s.spark} color={s.sparkColor} delay={s.delay + 0.3} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Middle row: Bar chart + Quick actions ─────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">

            {/* Weekly Bar Chart */}
            <div className="lg:col-span-3 rounded-xl p-5 anim-up-5"
              style={{ background: "#0f0f0f", border: "1px solid #1a1a1a" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                    Weekly Orders
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#f0ede8", marginTop: 2, fontWeight: 400 }}>
                    97 <span style={{ fontSize: "13px", color: "#444" }}>today</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "#141414", border: "1px solid #1c1c1c" }}>
                  <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: "#c4956a", display: "inline-block" }} />
                  <span style={{ fontSize: "10px", color: "#c4956a", fontFamily: "'DM Mono', monospace" }}>LIVE</span>
                </div>
              </div>
              <MiniBarChart data={weekBars} labels={weekLabels} />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 rounded-xl p-5 anim-up-5"
              style={{ background: "#0f0f0f", border: "1px solid #1a1a1a" }}>
              <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map(({ label, icon: Icon, path, accent }) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    className="flex flex-col items-start gap-2.5 p-3.5 rounded-lg text-left transition-all duration-200"
                    style={{
                      background: accent ? "#1a1108" : "#141414",
                      border: `1px solid ${accent ? "#c4956a33" : "#1c1c1c"}`,
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = accent ? "#221509" : "#1a1a1a";
                      e.currentTarget.style.borderColor = accent ? "#c4956a55" : "#2a2a2a";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = accent ? "#1a1108" : "#141414";
                      e.currentTarget.style.borderColor = accent ? "#c4956a33" : "#1c1c1c";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ background: accent ? "#c4956a22" : "#1e1e1e" }}>
                      <Icon size={13} style={{ color: accent ? "#c4956a" : "#555" }} />
                    </div>
                    <span style={{
                      fontSize: "11px",
                      color: accent ? "#c4956a" : "#888",
                      letterSpacing: "0.04em",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                    }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom row: Activity + Inventory snapshot ──────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">

            {/* Activity Feed */}
            <div className="lg:col-span-3 rounded-xl p-5 anim-up-6"
              style={{ background: "#0f0f0f", border: "1px solid #1a1a1a" }}>
              <div className="flex items-center justify-between mb-5">
                <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                  Recent Activity
                </p>
                <button
                  onClick={() => navigate("/seller/dashboard/orders")}
                  className="flex items-center gap-1 transition-colors"
                  style={{ fontSize: "10px", color: "#444", fontFamily: "'DM Mono', monospace" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#c4956a"}
                  onMouseLeave={e => e.currentTarget.style.color = "#444"}
                >
                  View all <ArrowRight size={10} />
                </button>
              </div>
              <div>
                {activity.map((item, i) => (
                  <ActivityItem key={i} {...item} isLast={i === activity.length - 1} />
                ))}
              </div>
            </div>

            {/* Inventory Snapshot */}
            <div className="lg:col-span-2 rounded-xl p-5 anim-up-6"
              style={{ background: "#0f0f0f", border: "1px solid #1a1a1a" }}>
              <div className="flex items-center justify-between mb-5">
                <p style={{ fontSize: "9px", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
                  Inventory
                </p>
                <button
                  onClick={() => navigate("/seller/dashboard/products")}
                  className="flex items-center gap-1 transition-colors"
                  style={{ fontSize: "10px", color: "#444", fontFamily: "'DM Mono', monospace" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#c4956a"}
                  onMouseLeave={e => e.currentTarget.style.color = "#444"}
                >
                  Manage <ArrowRight size={10} />
                </button>
              </div>

              {/* Big number */}
              <div className="mb-5">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "52px", fontWeight: 300, color: "#f0ede8", lineHeight: 1 }}>
                  <AnimatedNumber value={24} delay={0.4} />
                </div>
                <p style={{ fontSize: "10px", color: "#333", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>total products</p>
              </div>

              {/* Status breakdown */}
              {[
                { label: "Live",    value: 18, color: "#4ade80", pct: 75 },
                { label: "Drafts",  value: 4,  color: "#fbbf24", pct: 17 },
                { label: "Low stock", value: 2, color: "#f87171", pct: 8 },
              ].map(({ label, value, color, pct }) => (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Circle size={6} fill={color} stroke="none" />
                      <span style={{ fontSize: "11px", color: "#555", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                    </div>
                    <span style={{ fontSize: "10px", color: "#444", fontFamily: "'DM Mono', monospace" }}>{value}</span>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: "#1a1a1a" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      background: color,
                      transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                    }} />
                  </div>
                </div>
              ))}

              {/* Divider + CTA */}
              <div className="mt-5 pt-4" style={{ borderTop: "1px solid #1a1a1a" }}>
                <button
                  onClick={() => navigate("/seller/dashboard/create-product")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-200"
                  style={{ background: "#141414", border: "1px solid #1c1c1c", fontSize: "11px", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1a1108"; e.currentTarget.style.borderColor = "#c4956a33"; e.currentTarget.style.color = "#c4956a"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#141414"; e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.color = "#555"; }}
                >
                  <Plus size={12} />
                  Add new product
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Overview;