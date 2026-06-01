import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Package, DollarSign, Eye, Plus, ArrowRight,
  ShoppingBag, Clock, CheckCircle, AlertCircle, Bell,
  RotateCw, ExternalLink,
} from "lucide-react";
import { useContextMenu } from "../context/ContextMenuContext";

// ─── Animations ───────────────────────────────────────────────────
const PageStyles = () => (
  <style>{`
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slide-up 0.4s ease-out both; }
  `}</style>
);

// ─── Quick Action Card ────────────────────────────────────────────
const QuickAction = ({ label, description, icon: Icon, onClick, accent = false }) => (
  <button
    onClick={onClick}
    className={`group text-left w-full p-5 rounded-xl border transition-all duration-200
               hover:shadow-md hover:translate-y-[-2px]
               ${accent
                 ? "bg-[#c4956a] border-[#c4956a] text-[#0a0a0a]"
                 : "bg-[#0f0f0f] border-[#1a1a1a] text-[#f0ede8] hover:border-[#2a2a2a]"}`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3
                    ${accent ? "bg-[#0a0a0a]/20" : "bg-[#141414] border border-[#1a1a1a]"}`}>
      <Icon className={`w-5 h-5 ${accent ? "text-[#0a0a0a]" : "text-[#c4956a]"}`} />
    </div>
    <p className={`text-[13px] font-semibold mb-1 ${accent ? "text-[#0a0a0a]" : "text-[#f0ede8]"}`}>{label}</p>
    <p className={`text-[11px] leading-relaxed ${accent ? "text-[#0a0a0a]/60" : "text-[#888]"}`}>{description}</p>
    <div className={`mt-3 flex items-center gap-1 text-[11px] font-bold
                    ${accent ? "text-[#0a0a0a]/80" : "text-[#f0ede8]"}`}>
      Get started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
    </div>
  </button>
);

// ─── Recent Activity Item ─────────────────────────────────────────
const ActivityItem = ({ icon: Icon, iconBg, label, sub, time }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#1a1a1a] last:border-0">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] text-[#f0ede8] font-medium truncate">{label}</p>
      <p className="text-[11px] text-[#555]">{sub}</p>
    </div>
    <span className="text-[11px] text-[#444] flex-shrink-0 font-medium">{time}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const navigate = useNavigate();
  const { openContextMenu, registerShortcuts } = useContextMenu();

  // ── Page-level keyboard shortcuts ────────────────────────────
  useEffect(() => {
    registerShortcuts([
      { key: "n", callback: () => navigate("/seller/dashboard/create-product") },
      { key: "p", callback: () => navigate("/seller/dashboard/products") },
      { key: "o", callback: () => navigate("/seller/dashboard/orders") },
      { key: "r", callback: () => window.location.reload() },
    ]);
  }, [navigate, registerShortcuts]);

  // ── Right-click handler ───────────────────────────────────────
  const handleContextMenu = useCallback((e) => {
    const target = e.target.closest("button, a, input, textarea, [data-no-context]");
    if (target) return;
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: "Refresh Page",     icon: RotateCw,     shortcut: "R", onClick: () => window.location.reload() },
      { label: "Add New Product",  icon: Plus,         shortcut: "N", onClick: () => navigate("/seller/dashboard/create-product") },
      { divider: true },
      { label: "View Products",    icon: Package,      shortcut: "P", onClick: () => navigate("/seller/dashboard/products") },
      { label: "View Orders",      icon: ShoppingBag,  shortcut: "O", onClick: () => navigate("/seller/dashboard/orders") },
      { divider: true },
      { label: "Go to Store",      icon: ExternalLink,               onClick: () => navigate("/store") },
    ]);
  }, [navigate, openContextMenu]);

  const stats = [
    { label: "Total Products", value: "24",    icon: Package,     trend: "+3 this week",      accent: true  },
    { label: "Total Orders",   value: "138",   icon: ShoppingBag, trend: "+12 this month",    accent: false },
    { label: "Revenue",        value: "₹2.4L", icon: DollarSign,  trend: "+8% vs last month", accent: false },
    { label: "Page Views",     value: "5.2K",  icon: Eye,         trend: "Last 30 days",       accent: false },
  ];

  const recentActivity = [
    { icon: CheckCircle, iconBg: "bg-[#0f2010] text-[#4ade80]",   label: "Order #1042 fulfilled",    sub: "Linen Blazer · ₹4,200",        time: "2m ago"  },
    { icon: ShoppingBag, iconBg: "bg-[#0c1a2e] text-[#60a5fa]",   label: "New order received",       sub: "Cotton Kurta Set · ₹2,800",    time: "18m ago" },
    { icon: Package,     iconBg: "bg-[#1e140a] text-[#c4956a]", label: "Product published",        sub: "Silk Maxi Dress",              time: "1h ago"  },
    { icon: AlertCircle, iconBg: "bg-[#1e1700] text-[#fbbf24]",   label: "Low stock alert",          sub: "Indigo Denim Jacket · 2 left", time: "3h ago"  },
    { icon: Clock,       iconBg: "bg-[#141414] text-[#888]",      label: "Draft saved",              sub: "Handloom Shawl",               time: "5h ago"  },
  ];

  return (
    <div onContextMenu={handleContextMenu} className="flex flex-col flex-1 bg-[#0a0a0a]">
      <PageStyles />

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#c4956a] font-bold block">Seller Studio</span>
            <h1 className="font-['Playfair_Display'] text-[24px] lg:text-[28px] text-[#f0ede8] leading-tight font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center
                               text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 hidden lg:flex">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/seller/dashboard/create-product")}
              className="bg-[#c4956a] text-[#0a0a0a] text-[11px] uppercase tracking-[0.12em] px-5 py-2.5
                        rounded-lg transition-all duration-200 hover:bg-[#d4a57a] hover:shadow-lg
                        flex items-center gap-2 font-bold shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        <div className="animate-slide-up">
          <h2 className="font-['Playfair_Display'] text-[20px] text-[#f0ede8] font-semibold">Good morning, Utkarsh 👋</h2>
          <p className="text-[13px] text-[#888] mt-1 font-medium">Here's what's happening in your store today.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}
                className={`rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] shadow-sm
                           ${stat.accent ? "bg-[#c4956a] text-[#0a0a0a]" : "bg-[#0f0f0f] border border-[#1a1a1a] text-[#f0ede8]"}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                 ${stat.accent ? "bg-[#0a0a0a]/20" : "bg-[#141414] border border-[#1a1a1a]"}`}>
                    <Icon className={`w-5 h-5 ${stat.accent ? "text-[#0a0a0a]" : "text-[#c4956a]"}`} />
                  </div>
                  <span className={`text-[10px] font-semibold ${stat.accent ? "text-[#0a0a0a]/60" : "text-[#555]"}`}>{stat.trend}</span>
                </div>
                <div className={`font-['Playfair_Display'] text-[28px] leading-none mb-1 font-bold
                               ${stat.accent ? "text-[#0a0a0a]" : "text-[#f0ede8]"}`}>
                  {stat.value}
                </div>
                <div className={`text-[11px] uppercase tracking-[0.1em] font-semibold
                               ${stat.accent ? "text-[#0a0a0a]/50" : "text-[#555]"}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#c4956a] font-bold mb-4">Quick Actions</p>
            <div className="space-y-3">
              <QuickAction label="Add New Product" description="List a new item in your store catalog"
                icon={Plus} onClick={() => navigate("/seller/dashboard/create-product")} accent />
              <QuickAction label="View All Products" description="Manage your existing listings"
                icon={Package} onClick={() => navigate("/seller/dashboard/products")} />
              <QuickAction label="Check Orders" description="Fulfill and track recent orders"
                icon={ShoppingBag} onClick={() => navigate("/seller/dashboard/orders")} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#c4956a] font-bold mb-4">Recent Activity</p>
            <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] px-5 py-2">
              {recentActivity.map((item, i) => <ActivityItem key={i} {...item} />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;