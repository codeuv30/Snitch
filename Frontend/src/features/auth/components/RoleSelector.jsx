import { useEffect, useRef, useState } from "react";

function RoleSelector({ role, setRole, options }) {
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

  return (
    <div
      ref={containerRef}
      className="relative flex border border-[#e2e0d8] rounded overflow-hidden"
      style={{ padding: "3px" }}
    >
      {/* sliding pill */}
      <span
        className="absolute top-[3px] bottom-[3px] rounded bg-[#1a1a1a] transition-all duration-200 ease-in-out pointer-events-none"
        style={{ left: pillStyle.left, width: pillStyle.width }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setRole(opt.value)}
          className={`relative flex-1 py-[7px] text-[11px] font-medium tracking-[0.08em] uppercase z-10 transition-colors duration-150
            ${role === opt.value ? "text-white" : "text-[#888880] hover:text-[#1a1a1a]"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default RoleSelector;