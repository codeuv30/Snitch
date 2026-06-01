import React from "react";
import { useNavigate, useLocation } from "react-router";
import { BarChart3, Package, Download, TrendingUp, Settings, User } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.endsWith("/dashboard")) return "overview";
    if (path.includes("products") || path.includes("create-product") || path.includes("edit-product")) return "products";
    if (path.includes("orders")) return "orders";
    if (path.includes("analytics")) return "analytics";
    if (path.includes("settings")) return "settings";
    return "overview";
  };

  const activeItem = getActiveItem();

  const items = [
    { id: "overview",  label: "Overview",  icon: BarChart3,  path: "/seller/dashboard" },
    { id: "products",  label: "Products",  icon: Package,    path: "/seller/dashboard/products" },
    { id: "orders",    label: "Orders",    icon: Download,   path: "/seller/dashboard/orders" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/seller/dashboard/analytics" },
    { id: "settings",  label: "Settings",  icon: Settings,   path: "/seller/dashboard/settings" },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 z-40 w-[220px] min-h-screen bg-[#0a0a0a] border-r border-[#1a1a1a]">

      {/* Logo */}
      <div className="px-6 py-7 border-b border-[#1a1a1a]">
        <span className="font-['Playfair_Display'] text-[22px] tracking-[0.18em] text-[#f0ede8] font-medium">
          SNITCH
        </span>
        <p className="text-[9px] text-[#c4956a] tracking-[0.22em] uppercase mt-1 font-bold">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[12px] tracking-[0.04em] transition-all duration-150 border-l-2
                ${active
                  ? "bg-[#0f0f0f] border-[#c4956a] text-[#f0ede8] font-bold shadow-sm"
                  : "border-transparent text-[#555] hover:bg-[#0f0f0f]/60 hover:text-[#f0ede8]"
                }`}
            >
              <Icon size={14} className={active ? "text-[#c4956a]" : "text-[#444]"} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-[#141414] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
            <User size={13} className="text-[#c4956a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#f0ede8] font-bold truncate">Utkarsh Verma</p>
            <p className="text-[10px] text-[#444] tracking-[0.06em] font-medium">Seller</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;