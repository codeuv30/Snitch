import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth.js";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setError } from "@/src/features/auth/state/auth.slice.js";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import Footer from "@/components/ui/Footer.jsx";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
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
);

// ── Main Component ────────────────────────────────────────────────────────────

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin } = useAuth();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const emailRegister = register("email", {
    required: "Please enter a valid email address",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  });

  const passwordRegister = register("password", {
    required: "Password is required",
  });

  const onSubmit = async (data) => {
    dispatch(setError(null));
    const user = await handleLogin({
      email: data.email,
      password: data.password,
    });
    if (user) {
      navigate("/");
    }
  };

  // Clear Redux error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  emailRegister.onChange(e);
    if (error) dispatch(setError(null));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    passwordRegister.onChange(e);
    if (error) dispatch(setError(null));
  };

  return (
    <div
      className="flex flex-col md:flex-row w-full bg-[#121212]"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #c4956a;
        }
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #333333 #0a0a0a;
        }
      `}</style>

      {/* ── MOBILE HERO ───────────────────────────────────────────────────── */}
      <div
        className="md:hidden w-full relative shrink-0"
        style={{ height: "200px" }}
      >
        <img
          src="/assets/Images/Login/Mobile/WelcomeBack.png"
          alt="Welcome Back"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-black/20 to-[#0a0a0a]/70" />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          {/* top wordmark */}
          <span
            className="text-center text-[12px] font-medium tracking-[0.3em] uppercase text-[#f0ebe3]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            SNITCH
          </span>
        </div>
      </div>

      {/* ── DESKTOP LEFT PANEL ────────────────────────────────────────────── */}
      <div
        className="hidden md:block relative flex-none overflow-hidden bg-[#0a0a0a]"
        style={{ width: "42%", minHeight: "100vh" }} // ← fix here
      >
        <img
          src="/assets/Images/Login/Desktop/WelcomeBack.png"
          alt="Welcome Back"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ opacity: 0.9 }}
        />
        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent" />

        {/* wordmark */}
        <span
          className="absolute top-7 left-9 text-[13px] font-medium tracking-[0.28em] uppercase text-[#f0ebe3] drop-shadow-[0_0_8px_rgba(196,149,106,0.3)]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          SNITCH
        </span>

        {/* bottom copy */}
        <div className="absolute bottom-10 left-9 right-9">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-[#b5b0a8] mb-2.5">
            Welcome Back
          </p>
          <h2
            className="font-medium leading-[1.1] text-white mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 3vw, 40px)",
            }}
          >
            Good to See
            <br />
            You Again.
          </h2>
          <p className="text-[13px] font-light text-[#b5b0a8] leading-relaxed max-w-[230px]">
            Your style. Your wardrobe. Pick up where you left off.
          </p>
        </div>
      </div>

      {/* ── FORM PANEL ────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col bg-[#121212]">
        <div className="flex-1 overflow-y-auto px-6 pt-8 md:py-10 md:px-14">
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-[340px] mx-auto md:mx-0">
              {/* Desktop wordmark */}
              <div className="hidden md:block mb-8">
                <span
                  className="text-[13px] font-medium tracking-[0.28em] uppercase text-[#f0ebe3] drop-shadow-[0_0_8px_rgba(196,149,106,0.3)]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  SNITCH
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-[28px] md:text-[32px] font-medium text-[#f0ebe3] mb-1 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sign In
              </h1>
              <p className="text-[12px] text-[#9a9590] mb-7">
                New to SNITCH?{" "}
                <Link
                  to="/register"
                  className="text-[#c4956a] font-medium border-b border-[#c4956a]/40 hover:border-[#c4956a] hover:text-[#e8c9a0] transition-all duration-200"
                >
                  Create Account
                </Link>
              </p>

              {/* Redux error */}
              {error && (
                <p className="text-[12px] text-[#ff6b6b] mb-4 leading-relaxed border-l-2 border-[#ff6b6b]/30 pl-3">
                  {error}
                </p>
              )}

              {/* ── Fields ─────────────────────────────────────────────── */}
              <div className="space-y-3">
                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={emailRegister.onBlur}
                  inputRef={emailRegister.ref}
                  error={errors.email?.message}
                  autoComplete="email"
                  dark={true}
                />
                <div>
                  <FloatingInput
                    label="Password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={passwordRegister.onBlur}
                    inputRef={passwordRegister.ref}
                    error={errors.password?.message}
                    autoComplete="current-password"
                    dark={true}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="text-[#555555] hover:text-[#c4956a] transition-colors duration-200"
                      >
                        {showPwd ? <EyeOpen /> : <EyeClosed />}
                      </button>
                    }
                  />
                  {/* Forgot password — right aligned below field */}
                  <div className="flex justify-end mt-1.5">
                    <a
                      href="/forgot-password"
                      className="text-[11px] text-[#c4956a] hover:underline hover:text-[#e8c9a0] transition-all flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#c4956a]/50" />
                      Forgot Password?
                    </a>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    className="w-full py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#f0ebe3]
                    bg-[#1a1a1a] border border-[#333333] text-[#f0ebe3] rounded hover:bg-[#222222] hover:border-[#c4956a] hover:text-[#c4956a] active:scale-[0.985] transition-all duration-200"
                    variant="outline"
                    disabled={loading}
                    size="sm"
                  >
                    {loading && <Spinner data-icon="inline-start" />}
                    Sign In
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5 text-[11px] tracking-wide text-[#6a6560]">
                <span className="flex-1 h-px bg-[#474746]" />
                or
                <span className="flex-1 h-px bg-[#474746]" />
              </div>

              {/* Google */}
              <ContinueWithGoogle dark={true} />

              {/* Mobile — create account link */}
              <p className="md:hidden text-center text-[12px] text-[#9a9590] mt-6">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#c4956a] font-semibold tracking-wide uppercase text-[11px] hover:text-[#e8c9a0] transition-colors"
                >
                  Create One
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ── Desktop Footer ─────────────────────────────────────────────── */}
        <Footer />
      </div>
    </div>
  );
}
