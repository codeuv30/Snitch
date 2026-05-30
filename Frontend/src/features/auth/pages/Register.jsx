import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import Footer from "@/components/ui/Footer.jsx";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
import RoleSelector from "../components/RoleSelector.jsx";
import FloatingInput from "../components/FloatingInput.jsx";
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
)

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
  const [isGoogleProvider, setIsGoogleProvider] = useState(false);

  const { handleRegister } = useAuth();

  const { loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const providerEmail = params.get("email");
  const providerFullname = params.get("fullName");

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

  useEffect(() => {
    setIsGoogleProvider(!!providerEmail);

    if (providerEmail) {
      setEmail(providerEmail);
      setValue("email", providerEmail);
    }

    if (providerFullname) {
      setFullName(providerFullname);
      setValue("fullName", providerFullname);
    }
  }, [providerEmail, providerFullname, setValue]);

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
      value: 10,
      message: "Contact must be at least 10 digits",
    },
    pattern: {
      value: /^[0-9]+$/,
      message: "Contact must contain only numbers",
    },
  });

  const passwordRegister = register("password", {
    required: !isGoogleProvider ? "Password is required" : false,
    minLength: !isGoogleProvider
      ? {
          value: 6,
          message: "Password must be at least 6 characters",
        }
      : undefined,
  });

  const handleRoleChange = (value) => {
    setRole(value);
    setValue("role", value, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data) => {
    const userDetails = {
    isSeller: data.role === "seller",
    fullName: data.fullName,
    email: data.email,
    contact: data.contact,
    role: data.role,
    provider: isGoogleProvider ? "google" : "local",
  };

  if (!isGoogleProvider) {
    userDetails.password = data.password;
  }

    const user = await handleRegister(userDetails);

    if (user) {
      navigate("/");
    }
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
      className="min-h-screen flex flex-col md:flex-row w-full bg-white"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(onSubmit)();
        }
      }}
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
      <div className="flex-1 min-h-0 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto px-6 pt-8 md:py-10 md:px-14">
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-[360px] mx-auto md:mx-0">
              {/* Heading */}
              <h1
                className="text-[26px] md:text-[30px] font-medium text-[#1a1a1a] mb-1 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Create Account {isGoogleProvider && "with Google"}
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
                  isGoogleProvider={isGoogleProvider}
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
                  isGoogleProvider={isGoogleProvider}
                />
                <FloatingInput
                  label="Phone Number"
                  name="contact"
                  type="tel"
                  value={contact}
                  onChange={(e) => {
                    const cleanedValue = e.target.value.replace(/[^0-9]/g, "");
                    setContact(cleanedValue);
                    contactRegister.onChange(e);
                  }}
                  onBlur={contactRegister.onBlur}
                  inputRef={contactRegister.ref}
                  error={errors.contact?.message}
                  autoComplete="tel"
                  isGoogleProvider={isGoogleProvider}
                />

                {!isGoogleProvider && (
                  <>
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
                      isGoogleProvider={isGoogleProvider}
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
                  </>
                )}

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

              {!isGoogleProvider && (
                <>
                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5 text-[11px] tracking-wide text-[#474746]">
                    <span className="flex-1 h-px bg-[#474746]" />
                    or
                    <span className="flex-1 h-px bg-[#474746]" />
                  </div>

                  {/* Google */}
                  <ContinueWithGoogle />
                </>
              )}

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
        </div>
        <Footer />
      </div>
    </div>
  );
}
