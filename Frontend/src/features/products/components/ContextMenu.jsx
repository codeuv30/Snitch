import React, { useRef, useEffect, useState } from "react";

/**
 * ContextMenu
 * - Closes on outside click (mousedown outside the menu)
 * - Closes on Escape
 * - Arrow key navigation
 * - Does NOT swallow button clicks (mousedown listener is outside-only)
 */
const ContextMenu = ({ x, y, items, onClose, dark = false }) => {
  const menuRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const enabledItems = items.filter((item) => !item.disabled && !item.divider);

  // Outside click → close. Use mousedown on document but check if click is inside menu.
  useEffect(() => {
    const onMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Small delay so the right-click that opened the menu doesn't immediately close it
    const t = setTimeout(
      () => document.addEventListener("mousedown", onMouseDown),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev === -1 ? 0 : (prev + 1) % enabledItems.length,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev === -1
              ? enabledItems.length - 1
              : (prev - 1 + enabledItems.length) % enabledItems.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex !== -1 && enabledItems[focusedIndex]) {
            enabledItems[focusedIndex].onClick?.();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        default: {
          const match = items.find(
            (item) =>
              item.shortcut &&
              item.shortcut.toLowerCase() === e.key.toLowerCase() &&
              !item.disabled &&
              !item.divider,
          );
          if (match) {
            e.preventDefault();
            match.onClick?.();
            onClose();
          }
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [items, enabledItems, focusedIndex, onClose]);

  // Viewport boundary detection
  const menuWidth = 220;
  const estimatedHeight = items.length * 40 + 16;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 16);
  const adjustedY = Math.min(y, window.innerHeight - estimatedHeight - 16);

  // Theme classes
  const menuClasses = dark
    ? "fixed z-[90] bg-[#1a1a1a] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-[#2a2a2a] overflow-hidden min-w-[200px] select-none animate-context-in"
    : "fixed z-[90] bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[#e8e6e0] overflow-hidden min-w-[200px] select-none animate-context-in";

  const dividerClasses = dark
    ? "my-1.5 mx-3 border-t border-[#2a2a2a]"
    : "my-1.5 mx-3 border-t border-[#f0ede8]";

  const getItemClasses = (item, isFocused) => {
    if (item.danger) {
      return dark
        ? "text-[#ff6b6b] hover:bg-[#2a1a1a]"
        : "text-[#d14343] hover:bg-[#fff5f5]";
    }
    if (item.disabled) {
      return dark
        ? "text-[#555555] cursor-not-allowed opacity-50"
        : "text-[#b5b2a8] cursor-not-allowed opacity-50";
    }
    if (isFocused) {
      return dark
        ? "bg-[#2a2a2a] text-[#f0ebe3]"
        : "bg-[#f5f0ea] text-[#1a1a1a]";
    }
    return dark
      ? "text-[#e8e3dc] hover:bg-[#2a2a2a]"
      : "text-[#1a1a1a] hover:bg-[#f5f0ea]";
  };

  const getIconColor = (item) => {
    if (item.danger) return dark ? "text-[#ff6b6b]" : "text-[#d14343]";
    if (item.disabled) return dark ? "text-[#555555]" : "text-[#b5b2a8]";
    return dark ? "text-[#7a756f]" : "text-[#888880]";
  };

  const shortcutClasses = dark
    ? "text-[10px] text-[#555555] bg-[#2a2a2a] px-1.5 py-0.5 rounded font-mono"
    : "text-[10px] text-[#b5b2a8] bg-[#f5f0ea] px-1.5 py-0.5 rounded font-mono";

  return (
    <div
      ref={menuRef}
      className={menuClasses}
      style={{
        left: adjustedX,
        top: adjustedY,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="py-1.5">
        {items.map((item, index) => {
          if (item.divider) {
            return <div key={`divider-${index}`} className={dividerClasses} />;
          }

          const isFocused = enabledItems[focusedIndex] === item;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick?.();
                  onClose();
                }
              }}
              disabled={item.disabled}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-[13px] transition-colors duration-100 ${getItemClasses(item, isFocused)}`}
            >
              {Icon && (
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${getIconColor(item)}`}
                />
              )}
              <span className="flex-1 truncate">{item.label}</span>
              {item.shortcut && (
                <span className={shortcutClasses}>{item.shortcut}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextMenu;
