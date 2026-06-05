import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import {
  ContextMenuProvider,
  useContextMenu,
} from "../context/ContextMenuContext";
import ContextMenu from "../components/ContextMenu";
import Sidebar from "../components/DashboardSidebar";

const LayoutInner = () => {
  const { menu, closeContextMenu } = useContextMenu();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F5EFE6]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {menu && (
        <ContextMenu
          dark={true}
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={closeContextMenu}
        />
      )}

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:ml-[64px]" : "lg:ml-[220px]"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

const SellerLayout = () => {
  return (
    <ContextMenuProvider>
      <LayoutInner />
    </ContextMenuProvider>
  );
};

export default SellerLayout;
