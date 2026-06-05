import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import {
  BarChart3,
  Package,
  Download,
  TrendingUp,
  Settings,
  User,
  PanelRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import UserDetailsModal from "../../auth/components/UserDetailsModal";

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserDetails, setShowUserDetails] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.endsWith("/dashboard")) return "overview";
    if (
      path.includes("products") ||
      path.includes("create-product") ||
      path.includes("edit-product")
    )
      return "products";
    if (path.includes("orders")) return "orders";
    if (path.includes("analytics")) return "analytics";
    if (path.includes("settings")) return "settings";
    return "overview";
  };

  const activeItem = getActiveItem();

  const items = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      path: "/seller/dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/seller/dashboard/products",
    },
    {
      id: "orders",
      label: "Orders",
      icon: Download,
      path: "/seller/dashboard/orders",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      path: "/seller/dashboard/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/seller/dashboard/settings",
    },
  ];

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] transition-all duration-300 ease-in-out ${
          collapsed ? "w-[64px]" : "w-[220px]"
        }`}
      >
        {/* Logo + Toggle */}
        <div
          className={`border-b border-[#1a1a1a] transition-all duration-300 relative ${
            collapsed ? "px-3 py-7" : "px-6 py-7"
          }`}
        >
          {collapsed ? (
            <div className="group relative flex justify-center items-center h-8 cursor-pointer">
              {/* "S" text — fades out on hover */}
              <span className="font-['Playfair_Display'] text-[20px] tracking-[0.1em] text-[#c4956a] font-medium transition-opacity duration-200 group-hover:opacity-0">
                S
              </span>
              {/* PanelRight icon — fades in on hover, positioned absolutely to replace "S" */}
              <button
                onClick={onToggle}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title="Expand sidebar"
              >
                <PanelRight size={18} className="text-[#c4956a]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Link to={"/"}>
                <span className="font-['Playfair_Display'] text-[22px] tracking-[0.18em] text-[#f0ede8] font-medium block whitespace-nowrap">
                  SNITCH
                </span>
                <p className="text-[9px] text-[#c4956a] tracking-[0.22em] uppercase mt-1 font-bold whitespace-nowrap">
                  Seller Studio
                </p>
              </Link>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-[#555555] hover:text-[#f0ede8] hover:bg-[#1a1a1a] transition-all duration-200"
                title="Collapse sidebar"
              >
                <PanelRight size={16} className="rotate-180" />
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav
          className={`flex-1 py-4 space-y-0.5 transition-all duration-300 ${collapsed ? "px-2" : "px-3"}`}
        >
          {items.map(({ id, label, icon: Icon, path }) => {
            const active = activeItem === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className={`w-full flex items-center py-2.5 rounded-lg text-left text-[12px] tracking-[0.04em] transition-all duration-150 border-l-2
                  ${collapsed ? "justify-center px-2" : "gap-3 px-3"}
                  ${
                    active
                      ? "bg-[#0f0f0f] border-[#c4956a] text-[#f0ede8] font-bold shadow-sm"
                      : "border-transparent text-[#555] hover:bg-[#0f0f0f]/60 hover:text-[#f0ede8]"
                  }`}
                title={collapsed ? label : ""}
              >
                <Icon
                  size={collapsed ? 18 : 14}
                  className={`flex-shrink-0 ${active ? "text-[#c4956a]" : "text-[#444]"}`}
                />
                {!collapsed && (
                  <span className="truncate whitespace-nowrap">{label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div
          className={`border-t border-[#1a1a1a] transition-all duration-300 ${collapsed ? "px-2 py-4" : "px-3 py-4"}`}
        >
          <button
            onClick={() => setShowUserDetails(true)}
            className={`flex items-center w-full py-2.5 rounded-lg transition-all duration-200 hover:bg-[#0f0f0f]/60
              ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
            title={collapsed ? user?.fullName : ""}
          >
            <div className="w-7 h-7 rounded-full bg-[#141414] border border-[#1a1a1a] flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-[#c4956a]" />
            </div>
            {!collapsed && user && (
              <div className="flex-1 min-w-0 overflow-hidden text-left">
                <p className="text-[12px] text-[#f0ede8] font-bold truncate">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-[#444] tracking-[0.06em] font-medium">
                  {user.role}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* User Details Modal */}
      {showUserDetails && user && (
        <UserDetailsModal
          user={user}
          onClose={() => setShowUserDetails(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
