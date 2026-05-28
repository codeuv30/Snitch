import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import DesktopFooter from "@/components/ui/Footer.jsx";

// ── SVG Icons ────────────────────────────────────────────────────────────────

const EyeOpen = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ── Sliding Pill Role Selector ────────────────────────────────────────────────

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

// ── Floating Label Input ──────────────────────────────────────────────────────

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

function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "Very weak", color: "bg-[#d14343]" };
  }

  const rules = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 8,
  ];

  const score = Math.round((rules.filter(Boolean).length / rules.length) * 100);
  let label = "Very weak";
  let color = "bg-[#d14343]";

  if (score >= 80) {
    label = "Strong";
    color = "bg-[#22c55e]";
  } else if (score >= 60) {
    label = "Medium";
    color = "bg-[#f59e0b]";
  } else if (score >= 40) {
    label = "Weak";
    color = "bg-[#f97316]";
  }

  return { score, label, color };
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Register() {
  const [role, setRole] = useState("buyer");
  const [showPwd, setShowPwd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const { handleRegister } = useAuth();

  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      contact: "",
      password: "",
      role: "buyer",
    },
  });

  const fullNameRegister = register("fullName", {
    required: "Full name is required",
  });

  const emailRegister = register("email", {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email",
    },
  });

  const contactRegister = register("contact", {
    required: "Contact is required",
    minLength: {
      value: 7,
      message: "Enter a valid contact number",
    },
  });

  const passwordRegister = register("password", {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  });

  const handleRoleChange = (value) => {
    setRole(value);
    setValue("role", value, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data) => {
    const user = {
      isSeller: data.role === "seller",
      fullName: data.fullName,
      email: data.email,
      contact: data.contact,
      password: data.password,
      role: data.role,
    };

    await handleRegister(user);
  };

  const passwordStrength = getPasswordStrength(password);

  const desktopRoles = [
    { value: "buyer", label: "Buyer" },
    { value: "seller", label: "Seller" },
  ];

  const mobileRoles = [
    { value: "buyer", label: "Buyer" },
    { value: "seller", label: "Seller" },
  ];

  return (
    <div
      className="flex flex-col md:flex-row w-full bg-white"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
      `}</style>

      {/* ── MOBILE HERO ───────────────────────────────────────────────────── */}
      <div
        className="md:hidden w-full relative shrink-0"
        style={{ height: "200px" }}
      >
        <img
          src="/assets/Images/Register/Mobile/JoinTheEdit.png"
          alt="Join The Edit"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/65" />
        <div className="absolute inset-0 flex flex-col justify-between p-5"></div>
      </div>

      {/* ── DESKTOP LEFT PANEL ────────────────────────────────────────────── */}
      <div className="hidden md:block relative flex-[0.7] bg-[#111]">
        <img
          src="/assets/Images/Register/Desktop/StyleStartsHere1.png"
          alt="Style Starts Here"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ opacity: 0.88 }}
        />
        {/* bottom-to-top dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* brand wordmark */}
        <span
          className="absolute top-7 left-9 text-[13px] font-medium tracking-[0.28em] uppercase text-white/90"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          SNITCH
        </span>

        {/* bottom copy */}
        <div className="absolute bottom-10 left-9 right-9">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/55 mb-2.5">
            Join the Edit
          </p>
          <h2
            className="text-[40px] font-medium leading-[1.1] text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Style Starts
            <br />
            Here.
          </h2>
          <p className="text-[13px] font-light text-white/55 leading-relaxed max-w-[230px]">
            Discover curated fashion, delivered to your door.
          </p>
        </div>
      </div>

      {/* ── FORM PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-6 py-8 md:py-12 md:px-12 bg-white overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-[360px] mx-auto md:mx-0">
            {/* Heading */}
            <h1
              className="text-[26px] md:text-[30px] font-medium text-[#1a1a1a] mb-1 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Create Account
            </h1>
            <p className="text-[12px] text-[#888880] mb-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#c4956a] font-medium border-b border-[#c4956a]/40 hover:border-[#c4956a] transition-colors"
              >
                Sign In
              </Link>
            </p>

            {/* ── Role Selector ──────────────────────────────────────────── */}
            <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#888880] mb-2">
              I am a
            </p>

            {/* Desktop: Buyer / Seller (2 options) */}
            <div className="hidden md:block mb-5">
              <RoleSelector
                role={role}
                setRole={handleRoleChange}
                options={desktopRoles}
              />
            </div>

            {/* Mobile: Men / Women / Both (3 options) */}
            <div className="md:hidden mb-5">
              <RoleSelector
                role={role}
                setRole={handleRoleChange}
                options={mobileRoles}
              />
            </div>

            {/* ── Fields ─────────────────────────────────────────────────── */}
            <div className="space-y-3">
              <FloatingInput
                label="Full Name"
                name="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  fullNameRegister.onChange(e);
                }}
                onBlur={fullNameRegister.onBlur}
                inputRef={fullNameRegister.ref}
                error={errors.fullName?.message}
                autoComplete="name"
              />
              <FloatingInput
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  emailRegister.onChange(e);
                }}
                onBlur={emailRegister.onBlur}
                inputRef={emailRegister.ref}
                error={errors.email?.message}
                autoComplete="email"
              />
              <FloatingInput
                label="Phone Number"
                name="contact"
                type="tel"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  contactRegister.onChange(e);
                }}
                onBlur={contactRegister.onBlur}
                inputRef={contactRegister.ref}
                error={errors.contact?.message}
                autoComplete="tel"
              />
              <FloatingInput
                label="Password"
                name="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  passwordRegister.onChange(e);
                }}
                onBlur={passwordRegister.onBlur}
                inputRef={passwordRegister.ref}
                error={errors.password?.message}
                autoComplete="new-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-[#888880] hover:text-[#1a1a1a] transition-colors"
                  >
                    {showPwd ? <EyeOpen /> : <EyeClosed />}
                  </button>
                }
              />
              <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#e2e0d8]">
                  <div
                    className={`h-full rounded-full ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-[#555]">
                  Password strength:{" "}
                  <span className="font-semibold">
                    {passwordStrength.label}
                  </span>
                </p>
              </div>

              {/* Submit */}
              <div>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-white
                bg-[#1a1a1a] rounded hover:bg-[#2e2e2e] hover:text-white active:scale-[0.985] transition-all duration-150 mt-1"
                  variant="outline"
                  disabled={loading}
                  size="sm"
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  Create Account
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5 text-[11px] tracking-wide text-[#474746]">
              <span className="flex-1 h-px bg-[#474746]" />
              or
              <span className="flex-1 h-px bg-[#474746]" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 text-[12px] tracking-[0.06em] uppercase text-[#1a1a1a]
              bg-white border border-[#e2e0d8] rounded hover:bg-[#f8f7f4] hover:border-[#c4956a]/40 transition-all duration-150"
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </button>

            {/* Mobile bottom sign-in link */}
            <p className="md:hidden text-center text-[12px] text-[#888880] mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1a1a1a] font-semibold tracking-wide uppercase text-[11px]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <DesktopFooter />
      </div>
    </div>
  );
}
