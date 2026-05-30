import React from "react";
import { useNavigate } from "react-router";
import {
  Package, TrendingUp, DollarSign, Eye, Plus, ArrowRight,
  ShoppingBag, Clock, CheckCircle, AlertCircle, Bell,
} from "lucide-react";

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
                 ? "bg-[#1a1a1a] border-[#1a1a1a] text-white"
                 : "bg-white border-[#e8e6e0] text-[#1a1a1a] hover:border-[#1a1a1a]"}`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3
                    ${accent ? "bg-white/10" : "bg-[#f5f0ea]"}`}>
      <Icon className={`w-5 h-5 ${accent ? "text-white" : "text-[#8B6F5A]"}`} />
    </div>
    <p className={`text-[13px] font-semibold mb-1 ${accent ? "text-white" : "text-[#1a1a1a]"}`}>{label}</p>
    <p className={`text-[11px] leading-relaxed ${accent ? "text-white/60" : "text-[#888880]"}`}>{description}</p>
    <div className={`mt-3 flex items-center gap-1 text-[11px] font-medium
                    ${accent ? "text-white/80" : "text-[#1a1a1a]"}`}>
      Get started <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
    </div>
  </button>
);

// ─── Recent Activity Item ─────────────────────────────────────────
const ActivityItem = ({ icon: Icon, iconBg, label, sub, time }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#f0ede8] last:border-0">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] text-[#1a1a1a] font-medium truncate">{label}</p>
      <p className="text-[11px] text-[#888880]">{sub}</p>
    </div>
    <span className="text-[11px] text-[#b5b2a8] flex-shrink-0">{time}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE  (no Sidebar / MobileHeader / outer wrapper here —
// those all live in SellerLayout which wraps this via <Outlet />)
// ═══════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Products", value: "24",    icon: Package,     trend: "+3 this week",       accent: true  },
    { label: "Total Orders",   value: "138",   icon: ShoppingBag, trend: "+12 this month",     accent: false },
    { label: "Revenue",        value: "₹2.4L", icon: DollarSign,  trend: "+8% vs last month",  accent: false },
    { label: "Page Views",     value: "5.2K",  icon: Eye,         trend: "Last 30 days",        accent: false },
  ];

  const recentActivity = [
    { icon: CheckCircle, iconBg: "bg-green-50 text-green-600",   label: "Order #1042 fulfilled",    sub: "Linen Blazer · ₹4,200",        time: "2m ago"  },
    { icon: ShoppingBag, iconBg: "bg-blue-50 text-blue-600",     label: "New order received",       sub: "Cotton Kurta Set · ₹2,800",    time: "18m ago" },
    { icon: Package,     iconBg: "bg-[#f5f0ea] text-[#8B6F5A]", label: "Product published",        sub: "Silk Maxi Dress",              time: "1h ago"  },
    { icon: AlertCircle, iconBg: "bg-amber-50 text-amber-600",   label: "Low stock alert",          sub: "Indigo Denim Jacket · 2 left", time: "3h ago"  },
    { icon: Clock,       iconBg: "bg-purple-50 text-purple-600", label: "Draft saved",              sub: "Handloom Shawl",               time: "5h ago"  },
  ];

  return (
    <>
      <PageStyles />

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#F5EFE6]/90 backdrop-blur-md border-b border-[#e8e6e0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F5A] font-medium block">Seller Studio</span>
            <h1 className="font-['Playfair_Display'] text-[24px] lg:text-[28px] text-[#1a1a1a] leading-tight">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-[#e8e6e0] flex items-center justify-center
                               text-[#888880] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-200 hidden lg:flex">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/seller/dashboard/create-product")}
              className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[0.12em] px-5 py-2.5
                        rounded-lg transition-all duration-200 hover:bg-[#333] hover:shadow-lg
                        flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Greeting */}
        <div className="animate-slide-up">
          <h2 className="font-['Playfair_Display'] text-[20px] text-[#1a1a1a]">
            Good morning, Utkarsh 👋
          </h2>
          <p className="text-[13px] text-[#888880] mt-1">Here's what's happening in your store today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]
                           ${stat.accent ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#e8e6e0]"}`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                 ${stat.accent ? "bg-white/20" : "bg-[#f5f0ea]"}`}>
                    <Icon className={`w-5 h-5 ${stat.accent ? "text-white" : "text-[#8B6F5A]"}`} />
                  </div>
                  <span className={`text-[10px] ${stat.accent ? "text-white/50" : "text-[#b5b2a8]"}`}>{stat.trend}</span>
                </div>
                <div className={`font-['Playfair_Display'] text-[28px] leading-none mb-1
                               ${stat.accent ? "text-white" : "text-[#1a1a1a]"}`}>
                  {stat.value}
                </div>
                <div className={`text-[11px] uppercase tracking-[0.1em]
                               ${stat.accent ? "text-white/50" : "text-[#b5b2a8]"}`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>

          {/* Quick Actions */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8B6F5A] font-medium mb-4">Quick Actions</p>
            <div className="space-y-3">
              <QuickAction
                label="Add New Product"
                description="List a new item in your store catalog"
                icon={Plus}
                onClick={() => navigate("/seller/dashboard/create-product")}
                accent
              />
              <QuickAction
                label="View All Products"
                description="Manage your existing listings"
                icon={Package}
                onClick={() => navigate("/seller/dashboard/products")}
              />
              <QuickAction
                label="Check Orders"
                description="Fulfill and track recent orders"
                icon={ShoppingBag}
                onClick={() => navigate("/seller/dashboard/orders")}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#8B6F5A] font-medium mb-4">Recent Activity</p>
            <div className="bg-white rounded-xl border border-[#e8e6e0] px-5 py-2">
              {recentActivity.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))}
            </div>
          </div>
        </div>

      </main>
    </>
  );
};

export default Dashboard;