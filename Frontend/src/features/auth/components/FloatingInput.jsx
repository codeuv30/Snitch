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
  dark = false,
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || (value && value.length > 0);

  // Theme classes
  const containerClasses = dark
    ? "relative border border-[#2a2a2a] rounded bg-[#0f0f0f] hover:border-[#3a3a3a] focus-within:border-[#c4956a] focus-within:bg-[#141414] focus-within:shadow-[0_0_0_3px_rgba(196,149,106,0.12)] transition-all duration-200"
    : "relative border border-[#e2e0d8] rounded bg-[#f8f7f4] focus-within:border-[#c4956a] focus-within:bg-white transition-colors";

  const labelRaisedClasses = dark
    ? "top-[7px] text-[9px] tracking-[0.1em] uppercase text-[#c4956a]"
    : "top-[7px] text-[9px] tracking-[0.1em] uppercase text-[#c4956a]";

  const labelPlaceholderClasses = dark
    ? "top-1/2 -translate-y-1/2 text-[13px] text-[#7a756f]"
    : "top-1/2 -translate-y-1/2 text-[13px] text-[#474746]";

  const inputClasses = dark
    ? "w-full bg-transparent outline-none text-[13px] text-[#e8e3dc] font-light placeholder:text-[#555555] autofill-dark"
    : "w-full bg-transparent outline-none text-[13px] text-[#1a1a1a] font-light";

  const errorClasses = dark
    ? "mt-1 text-[11px] text-[#ff6b6b]"
    : "mt-1 text-[11px] text-[#d14343]";

  // Autofill fix styles for dark mode
  const autofillStyles = dark ? {
    WebkitBoxShadow: "0 0 0px 1000px #0f0f0f inset",
    WebkitTextFillColor: "#e8e3dc",
    caretColor: "#e8e3dc",
    transition: "background-color 5000s ease-in-out 0s",
  } : {};

  return (
    <div>
      <div className={containerClasses}>
        <label
          className={`absolute left-3.5 transition-all duration-150 pointer-events-none select-none
            ${
              raised
                ? labelRaisedClasses
                : labelPlaceholderClasses
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
          className={`${inputClasses}
            ${raised ? "pt-[22px] pb-[7px] px-3.5" : "py-3 px-3.5"}
            ${suffix ? "pr-10" : ""}`}
          style={autofillStyles}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  );
}

export default FloatingInput;