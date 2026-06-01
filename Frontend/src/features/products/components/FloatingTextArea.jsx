import { useState } from "react";

function FloatingTextArea({
  label,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  MAX_DESC,
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div>
      <div className="relative border border-[#1a1a1a] rounded bg-[#141414] focus-within:border-[#c4956a] focus-within:bg-[#1a1a1a] transition-colors duration-150">
        <label
          className={`absolute left-3.5 transition-all duration-150 pointer-events-none select-none
            ${
              raised
                ? "top-[7px] text-[9px] tracking-[0.1em] uppercase text-[#c4956a] font-bold"
                : "top-4 text-[13px] text-[#555]"
            }`}
        >
          {label}
        </label>
        <textarea
          ref={inputRef}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          maxLength={MAX_DESC}
          rows={5}
          className={`w-full bg-transparent outline-none text-[13px] text-[#f0ede8] font-medium resize-y leading-relaxed
            ${raised ? "pt-[24px] pb-3 px-3.5" : "py-3 px-3.5"}`}
          style={{ minHeight: "120px" }}
        />
        {/* character counter */}
        <span className="absolute bottom-2.5 right-3.5 text-[10px] text-[#444] pointer-events-none font-medium">
          {value.length} / {MAX_DESC}
        </span>
      </div>
      {error && <p className="mt-1 text-[11px] text-[#f87171] font-medium">{error}</p>}
    </div>
  );
}

export default FloatingTextArea;