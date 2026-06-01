import React, { useEffect } from "react";
import { Outlet } from "react-router";
import {
  ContextMenuProvider,
  useContextMenu,
} from "../context/ContextMenuContext";
import ContextMenu from "../components/ContextMenu";
import Sidebar from "../components/DashboardSidebar";

const LayoutInner = () => {
  const { menu, closeContextMenu } = useContextMenu();

  return (
    <div className="min-h-screen flex bg-[#F5EFE6]">
      <Sidebar />

      {menu && (
        <ContextMenu
          dark={true}
          x={menu.x}
          y={menu.y}
          items={menu.items}
          onClose={closeContextMenu}
        />
      )}

      <div className="flex-1 flex flex-col lg:ml-[220px] min-h-screen">
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
