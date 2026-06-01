import { useEffect, useRef, useState } from "react";

function RoleSelector({ role, setRole, options, dark = false }) {
  const containerRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = options.findIndex((o) => o.value === role);
    const buttons = container.querySelectorAll("button");
    if (buttons[idx]) {
      const btn = buttons[idx];
      setPillStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      });
    }
  }, [role, options]);

  // Theme classes
  const containerClasses = dark
    ? "relative flex border border-[#2a2a2a] rounded overflow-hidden bg-[#0f0f0f]"
    : "relative flex border border-[#e2e0d8] rounded overflow-hidden";

  const pillClasses = dark
    ? "absolute top-[3px] bottom-[3px] rounded bg-[#c4956a] transition-all duration-200 ease-in-out pointer-events-none"
    : "absolute top-[3px] bottom-[3px] rounded bg-[#1a1a1a] transition-all duration-200 ease-in-out pointer-events-none";

  const activeTextClasses = dark
    ? "text-[#1a1a1a]"
    : "text-white";

  const inactiveTextClasses = dark
    ? "text-[#7a756f] hover:text-[#b5b0a8]"
    : "text-[#888880] hover:text-[#1a1a1a]";

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{ padding: "3px" }}
    >
      {/* sliding pill */}
      <span
        className={pillClasses}
        style={{ left: pillStyle.left, width: pillStyle.width }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setRole(opt.value)}
          className={`relative flex-1 py-[7px] text-[11px] font-medium tracking-[0.08em] uppercase z-10 transition-colors duration-150
            ${role === opt.value ? activeTextClasses : inactiveTextClasses}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default RoleSelector;