import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  BarChart3, Package, Download, TrendingUp, Settings,
  User, Bell,
} from "lucide-react";

// ─── Fonts ────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #d6d1c8; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #b5b2a8; }
  `}</style>
);

// ─── Sidebar ──────────────────────────────────────────────────────
export const Sidebar = ({ activeItem = "overview" }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: "overview",  label: "Overview",  icon: BarChart3,  path: "/seller/dashboard" },
    { id: "products",  label: "Products",  icon: Package,    path: "/seller/dashboard/products" },
    { id: "orders",    label: "Orders",    icon: Download,   path: "/seller/dashboard/orders" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/seller/dashboard/analytics" },
    { id: "settings",  label: "Settings",  icon: Settings,   path: "/seller/dashboard/settings" },
  ];

  return (
    <aside className="w-[240px] min-h-screen bg-white border-r border-[#e8e6e0] fixed left-0 top-0 z-40 hidden lg:flex flex-col">
      <div className="p-6 border-b border-[#e8e6e0]">
        <span className="font-['Playfair_Display'] text-[18px] tracking-[0.15em] text-[#1a1a1a] font-semibold">
          SNITCH
        </span>
        <p className="text-[10px] text-[#b5b2a8] uppercase tracking-[0.2em] mt-1">Seller Studio</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] transition-all duration-200
                         ${isActive
                           ? "bg-[#1a1a1a] text-white font-medium shadow-md"
                           : "text-[#888880] hover:bg-[#f5f0ea] hover:text-[#1a1a1a]"}`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e8e6e0]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-[#e8e6e0] flex items-center justify-center">
            <User className="w-4 h-4 text-[#888880]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#1a1a1a] font-medium truncate">Utkarsh Verma</p>
            <p className="text-[11px] text-[#b5b2a8]">Seller</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ─── Mobile Header ────────────────────────────────────────────────
export const MobileHeader = () => (
  <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8e6e0]">
    <div className="flex items-center justify-between px-4 py-3">
      <span className="font-['Playfair_Display'] text-[16px] tracking-[0.15em] text-[#1a1a1a] font-semibold">
        SNITCH
      </span>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-[#f5f0ea] flex items-center justify-center">
          <Bell className="w-4 h-4 text-[#1a1a1a]" />
        </button>
        <div className="w-9 h-9 rounded-full bg-[#e8e6e0] flex items-center justify-center">
          <User className="w-4 h-4 text-[#888880]" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Layout Shell ─────────────────────────────────────────────────
// `activeItem` is passed down from each route via the <SellerLayout> wrapper.
// We derive it automatically from the current pathname instead so every
// child page gets the correct highlight without any extra prop drilling.
const SellerLayout = () => {
  const location = useLocation();
  // Derive which nav item is active from the URL
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/seller/dashboard" || path === "/seller/dashboard/") return "overview";
    if (path.includes("/products") || path.includes("/create-product") || path.includes("/edit-product")) return "products";
    if (path.includes("/orders"))   return "orders";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/settings")) return "settings";
    return "overview";
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] font-['DM_Sans']">
      <FontLoader />

      {/* Static sidebar — never unmounts */}
      <MobileHeader />
      <Sidebar activeItem={getActiveItem()} />

      {/* Scrollable content area — only this re-renders on navigation */}
      <div className="lg:ml-[240px] min-h-screen flex flex-col">
        {/* React Router swaps this out on every navigation */}
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;