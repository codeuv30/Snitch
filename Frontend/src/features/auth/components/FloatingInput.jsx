import { useState } from "react";

function FloatingInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  autoComplete,
  suffix,
  inputRef,
  error,
  isGoogleProvider,
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div>
      <div className="relative border border-[#e2e0d8] rounded bg-[#f8f7f4] focus-within:border-[#c4956a] focus-within:bg-white transition-colors">
        <label
          className={`absolute left-3.5 transition-all duration-150 pointer-events-none select-none
            ${
              raised
                ? "top-[7px] text-[9px] tracking-[0.1em] uppercase text-[#c4956a]"
                : "top-1/2 -translate-y-1/2 text-[13px] text-[#474746]"
            }`}
        >
          {label}
        </label>
        <input
          readOnly={name === "email" && isGoogleProvider}
          ref={inputRef}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={(event) => {
            setFocused(false);
            if (onBlur) onBlur(event);
          }}
          onFocus={() => setFocused(true)}
          autoComplete={autoComplete}
          className={`w-full bg-transparent outline-none text-[13px] text-[#1a1a1a] font-light
            ${raised ? "pt-[22px] pb-[7px] px-3.5" : "py-3 px-3.5"}
            ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-[11px] text-[#d14343]">{error}</p>}
    </div>
  );
}

export default FloatingInput;