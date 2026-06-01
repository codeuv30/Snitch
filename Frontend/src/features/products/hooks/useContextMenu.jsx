import { useState, useCallback, useEffect, useRef } from "react";

/**
 * useContextMenu
 *
 * Provides:
 *   contextMenu        – null | { x, y, target, items }
 *   openContextMenu    – (x, y, target, items) => void
 *   closeContextMenu   – () => void
 *   registerShortcuts  – (shortcuts: Array<{ key, callback, preventDefault? }>) => void
 *
 * registerShortcuts registers keyboard shortcuts globally.
 * Each call replaces the previous set of shortcuts for that component.
 * Shortcuts are automatically cleaned up when the component unmounts.
 */
const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);
  const shortcutsRef = useRef([]);
  const listenerRef = useRef(null);

  const openContextMenu = useCallback((x, y, target, items) => {
    setContextMenu({ x, y, target, items });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Close on outside click or Escape (when no menu items are handling it)
  useEffect(() => {
    if (!contextMenu) return;

    const handleClick = () => closeContextMenu();
    const handleEscape = (e) => {
      if (e.key === "Escape") closeContextMenu();
    };

    // Defer so the mousedown that opened the menu doesn't immediately close it
    const t = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu, closeContextMenu]);

  /**
   * registerShortcuts
   *
   * @param {Array<{ key: string, callback: () => void, preventDefault?: boolean }>} shortcuts
   *
   * Example:
   *   registerShortcuts([
   *     { key: 'n', callback: () => navigate('/new'), preventDefault: true },
   *     { key: 'r', callback: () => window.location.reload() },
   *   ]);
   */
  const registerShortcuts = useCallback((shortcuts) => {
    // Remove previous listener if any
    if (listenerRef.current) {
      document.removeEventListener("keydown", listenerRef.current);
    }

    // Skip if shortcuts list is empty
    if (!shortcuts || shortcuts.length === 0) {
      listenerRef.current = null;
      shortcutsRef.current = [];
      return;
    }

    shortcutsRef.current = shortcuts;

    const handler = (e) => {
      // Don't fire shortcuts when typing in inputs/textareas
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) {
        return;
      }

      const match = shortcutsRef.current.find(
        (s) => s.key.toLowerCase() === e.key.toLowerCase()
      );

      if (match) {
        if (match.preventDefault) e.preventDefault();
        match.callback();
      }
    };

    listenerRef.current = handler;
    document.addEventListener("keydown", handler);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        document.removeEventListener("keydown", listenerRef.current);
      }
    };
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    registerShortcuts,
  };
};

export default useContextMenu;