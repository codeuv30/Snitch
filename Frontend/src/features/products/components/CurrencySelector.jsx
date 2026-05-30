import { useEffect, useRef, useState } from "react";

function CurrencySelector({ value, onChange, CURRENCIES }) {
  const containerRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = CURRENCIES.indexOf(value);
    const buttons = container.querySelectorAll("button");
    if (buttons[idx]) {
      setPillStyle({
        left: buttons[idx].offsetLeft,
        width: buttons[idx].offsetWidth,
      });
    }
  }, [value, CURRENCIES]);

  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#8B6F5A] mb-2">
        Currency
      </p>
      <div
        ref={containerRef}
        className="relative flex border border-[#d6d1c8] rounded bg-[#f8f7f4] p-[3px]"
      >
        {/* sliding pill */}
        <span
          className="absolute top-[3px] bottom-[3px] rounded bg-[#1a1a1a] transition-all duration-200 ease-in-out pointer-events-none"
          style={{ left: pillStyle.left, width: pillStyle.width }}
        />
        {CURRENCIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`relative flex-1 py-[7px] text-[10px] font-medium tracking-[0.05em] uppercase z-10 transition-colors duration-150 cursor-pointer
              ${value === c ? "text-white" : "text-[#888880] hover:text-[#1a1a1a]"}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CurrencySelector;