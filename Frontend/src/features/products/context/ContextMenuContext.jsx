import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const ContextMenuCtx = createContext(null);

export const useContextMenu = () => {
  const ctx = useContext(ContextMenuCtx);
  if (!ctx) throw new Error("useContextMenu must be used inside <ContextMenuProvider>");
  return ctx;
};

export const ContextMenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(null);
  const shortcutsRef = useRef([]);
  const handlerRef = useRef(null);
  const menuRef = useRef(null); // passed down so we can detect outside clicks

  const openContextMenu = useCallback((x, y, items) => setMenu({ x, y, items }), []);
  const closeContextMenu = useCallback(() => setMenu(null), []);

  // The ContextMenu component handles its own outside-click detection
  // We only need to register/clean up shortcuts here

  const registerShortcuts = useCallback((shortcuts) => {
    if (handlerRef.current) {
      document.removeEventListener("keydown", handlerRef.current);
      handlerRef.current = null;
    }
    if (!shortcuts?.length) { shortcutsRef.current = []; return; }

    shortcutsRef.current = shortcuts;
    const handler = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) return;
      const match = shortcutsRef.current.find(
        s => s.key.toLowerCase() === e.key.toLowerCase()
      );
      if (match) {
        if (match.preventDefault !== false) e.preventDefault();
        match.callback();
      }
    };
    handlerRef.current = handler;
    document.addEventListener("keydown", handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => {
    if (handlerRef.current) document.removeEventListener("keydown", handlerRef.current);
  }, []);

  return (
    <ContextMenuCtx.Provider value={{ menu, openContextMenu, closeContextMenu, registerShortcuts }}>
      {children}
    </ContextMenuCtx.Provider>
  );
};