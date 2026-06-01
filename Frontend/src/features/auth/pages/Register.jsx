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

const EyeOpen = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "Very weak", color: "bg-[#d14343]" };

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

  if (score >= 80) { label = "Strong"; color = "bg-[#22c55e]"; }
  else if (score >= 60) { label = "Medium"; color = "bg-[#f59e0b]"; }
  else if (score >= 40) { label = "Weak"; color = "bg-[#f97316]"; }

  return { score, label, color };
}

export default function Register() {
  const [role, setRole] = useState("buyer");
  const [showPwd, setShowPwd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleProvider, setIsGoogleProvider] = useState(false);

  const { handleRegister } = useAuth();

  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const providerEmail = params.get("email");
  const providerFullname = params.get("fullName");

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
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

  const hasAppliedGoogleOAuth = useRef(false);

  useEffect(() => {
    if (hasAppliedGoogleOAuth.current) return;

    setIsGoogleProvider(!!providerEmail);

    if (providerEmail) {
      setEmail(providerEmail);
      setValue("email", providerEmail, { shouldValidate: false });
    }

    if (providerFullname) {
      setFullName(providerFullname);
      setValue("fullName", providerFullname, { shouldValidate: false });
    }

    hasAppliedGoogleOAuth.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    minLength: { value: 10, message: "Contact must be at least 10 digits" },
    pattern: { value: /^[0-9]+$/, message: "Contact must contain only numbers" },
  });

  const passwordRegister = register("password", {
    required: !isGoogleProvider ? "Password is required" : false,
    minLength: !isGoogleProvider
      ? { value: 6, message: "Password must be at least 6 characters" }
      : undefined,
  });

  const handleRoleChange = (value) => {
    setRole(value);
    setValue("role", value, { shouldValidate: true, shouldDirty: true });
  };

  const handleInputChange = (setter, fieldName, e) => {
    setter(e.target.value);
    if (errors[fieldName]) clearErrors(fieldName);
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
    if (user) navigate("/");
  };

  const passwordStrength = getPasswordStrength(password);

  const roles = [
    { value: "buyer", label: "Buyer" },
    { value: "seller", label: "Seller" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row w-full bg-[#121212]"
      style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #c4956a; }
        * { scrollbar-width: thin; scrollbar-color: #333333 #0a0a0a; }
      `}</style>

      {/* ── MOBILE HERO ───────────────────────────────────────────────────── */}
      <div className="md:hidden w-full relative shrink-0" style={{ height: "200px" }}>
        <img
          src="/assets/Images/Register/Mobile/JoinTheEdit.png"
          alt="Join The Edit"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-black/20 to-[#0a0a0a]/70" />
        <div className="absolute inset-0 flex flex-col justify-between p-5" />
      </div>

      {/* ── DESKTOP LEFT PANEL ────────────────────────────────────────────── */}
      <div className="hidden md:block relative flex-[0.7] bg-[#0a0a0a]">
        <img
          src="/assets/Images/Register/Desktop/StyleStartsHere1.png"
          alt="Style Starts Here"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ opacity: 0.9 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent" />
        <span
          className="absolute top-7 left-9 text-[13px] font-medium tracking-[0.28em] uppercase text-[#f0ebe3] drop-shadow-[0_0_8px_rgba(196,149,106,0.3)]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          SNITCH
        </span>
        <div className="absolute bottom-10 left-9 right-9">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#b5b0a8] mb-2.5">
            Join the Edit
          </p>
          <h2
            className="text-[40px] font-medium leading-[1.1] text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Style Starts<br />Here.
          </h2>
          <p className="text-[13px] font-light text-[#b5b0a8] leading-relaxed max-w-[230px]">
            Discover curated fashion, delivered to your door.
          </p>
        </div>
      </div>

      {/* ── FORM PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col bg-[#121212]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 pt-8 md:py-10 md:px-14"
          noValidate
        >
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-[360px] mx-auto md:mx-0">

              <h1
                className="text-[26px] md:text-[30px] font-medium text-[#f0ebe3] mb-1 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Create Account {isGoogleProvider && "with Google"}
              </h1>
              <p className="text-[12px] text-[#9a9590] mb-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#c4956a] font-medium border-b border-[#c4956a]/40 hover:border-[#c4956a] hover:text-[#e8c9a0] transition-all duration-200"
                >
                  Sign In
                </Link>
              </p>

              {/* API Error from Redux — same style as Login.jsx */}
              {error && (
                <p className="text-[12px] text-[#ff6b6b] mb-4 leading-relaxed border-l-2 border-[#ff6b6b]/30 pl-3">
                  {error}
                </p>
              )}

              <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[#7a756f] mb-2">
                I am a
              </p>
              <div className="mb-5">
                <RoleSelector
                  role={role}
                  dark={true}
                  setRole={handleRoleChange}
                  options={roles}
                />
              </div>

              <div className="space-y-3">
                <FloatingInput
                  label="Full Name"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => handleInputChange(setFullName, "fullName", e)}
                  onBlur={fullNameRegister.onBlur}
                  inputRef={fullNameRegister.ref}
                  error={errors.fullName?.message}
                  autoComplete="name"
                  isGoogleProvider={isGoogleProvider}
                  dark={true}
                />
                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange(setEmail, "email", e)}
                  onBlur={emailRegister.onBlur}
                  inputRef={emailRegister.ref}
                  error={errors.email?.message}
                  autoComplete="email"
                  isGoogleProvider={isGoogleProvider}
                  dark={true}
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
                    if (errors.contact) clearErrors("contact");
                  }}
                  onBlur={contactRegister.onBlur}
                  inputRef={contactRegister.ref}
                  error={errors.contact?.message}
                  autoComplete="tel"
                  isGoogleProvider={isGoogleProvider}
                  dark={true}
                />

                {!isGoogleProvider && (
                  <>
                    <FloatingInput
                      label="Password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => handleInputChange(setPassword, "password", e)}
                      onBlur={passwordRegister.onBlur}
                      inputRef={passwordRegister.ref}
                      error={errors.password?.message}
                      autoComplete="new-password"
                      isGoogleProvider={isGoogleProvider}
                      dark={true}
                      suffix={
                        <button
                          type="button"
                          onClick={() => setShowPwd((v) => !v)}
                          className="text-[#555555] hover:text-[#c4956a] transition-colors"
                        >
                          {showPwd ? <EyeOpen /> : <EyeClosed />}
                        </button>
                      }
                    />
                    <div className="mt-2">
                      <div className="h-1 w-full overflow-hidden rounded-full bg-[#222222]">
                        <div
                          className={`h-full rounded-full ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-[#6a6560]">
                        Password strength:{" "}
                        <span className="font-semibold">{passwordStrength.label}</span>
                      </p>
                    </div>
                  </>
                )}

                {/* FIX 3: <Button> component, identical props to Login.jsx */}
                <div className="pt-1">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#f0ebe3]
                      bg-[#1a1a1a] border border-[#333333] rounded hover:bg-[#222222] hover:border-[#c4956a] hover:text-[#c4956a] active:scale-[0.985] transition-all duration-200"
                    variant="outline"
                    size="sm"
                  >
                    {loading && <Spinner data-icon="inline-start" />}
                    Create Account
                  </Button>
                </div>
              </div>

              {!isGoogleProvider && (
                <>
                  <div className="flex items-center gap-3 my-5 text-[11px] tracking-wide text-[#6a6560]">
                    <span className="flex-1 h-px bg-[#474746]" />
                    or
                    <span className="flex-1 h-px bg-[#474746]" />
                  </div>
                  <ContinueWithGoogle dark={true} />
                </>
              )}

              <p className="md:hidden text-center text-[12px] text-[#9a9590] mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#c4956a] font-semibold tracking-wide uppercase text-[11px] hover:text-[#e8c9a0] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
}