import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import useProduct from "../hooks/useProduct";
import FloatingInput from "../components/FloatingInput.jsx";
import FloatingTextArea from "../components/FloatingTextArea.jsx";
import CurrencySelector from "../components/CurrencySelector.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import Footer from "@/components/ui/Footer.jsx";

// ── Fonts & Animations ───────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.96); }
      to   { opacity: 1; transform: scale(1); }
    }
    .fade-up { animation: fadeUp 0.5s ease-out both; }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.12s; }
    .fade-up-3 { animation-delay: 0.19s; }
    .fade-up-4 { animation-delay: 0.26s; }
    .fade-up-5 { animation-delay: 0.33s; }
    .fade-up-6 { animation-delay: 0.40s; }
    .fade-up-7 { animation-delay: 0.47s; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out both; }
    .animate-scale-in { animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }

    /* Carousel slide animations */
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px) scale(0.98); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-30px) scale(0.98); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    .animate-slide-right { animation: slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .animate-slide-left  { animation: slideInLeft  0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

    /* Custom scrollbar for carousel */
    .carousel-scroll::-webkit-scrollbar { height: 3px; }
    .carousel-scroll::-webkit-scrollbar-track { background: transparent; }
    .carousel-scroll::-webkit-scrollbar-thumb { background: rgba(196,149,106,0.4); border-radius: 3px; }
    .carousel-scroll { scrollbar-width: thin; scrollbar-color: rgba(196,149,106,0.4) transparent; }

    /* Cursor grab for drag area */
    .grab-cursor { cursor: grab; }
    .grab-cursor:active { cursor: grabbing; }
    .grab-cursor.dragging { cursor: grabbing; }
  `}</style>
);

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];
const MAX_DESC = 1000;

// ── Currency Config: Symbol + Locale ────────────────────────────────────────
const CURRENCY_CONFIG = {
  INR: { symbol: "₹", locale: "en-IN", prefix: true },
  USD: { symbol: "$", locale: "en-US", prefix: true },
  EUR: { symbol: "€", locale: "de-DE", prefix: true },
  GBP: { symbol: "£", locale: "en-GB", prefix: true },
  JPY: { symbol: "¥", locale: "ja-JP", prefix: true },
};

function formatAmount(amount, currency) {
  if (!amount || isNaN(Number(amount))) return null;
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const num = Number(amount);

  if (currency === "JPY") {
    return `${cfg.symbol}${Math.round(num).toLocaleString(cfg.locale)}`;
  }

  const formatted = num.toLocaleString(cfg.locale, {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${cfg.symbol}${formatted}`;
}

// ── Image Carousel for Live Preview ──────────────────────────────────────────
function PreviewCarousel({ images, currentIndex, onSelect }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const thumb = scrollRef.current.children[currentIndex];
      if (thumb) {
        thumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentIndex]);

  if (images.length <= 1) return null;

  return (
    <div className="mt-3">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto carousel-scroll pb-1 px-0.5"
      >
        {images.map((file, idx) => {
          const preview = file._previewUrl || URL.createObjectURL(file);
          if (!file._previewUrl) file._previewUrl = preview;
          const isActive = idx === currentIndex;

          return (
            <button
              key={`thumb-${file.name}-${idx}`}
              type="button"
              onClick={() => onSelect(idx)}
              className={`
                relative flex-shrink-0 w-10 h-10 rounded overflow-hidden transition-all duration-200
                ${
                  isActive
                    ? "ring-2 ring-[#c4956a] ring-offset-1 ring-offset-[#141414] opacity-100 scale-105"
                    : "opacity-50 hover:opacity-80 hover:scale-105"
                }
              `}
            >
              <img
                src={preview}
                alt={`thumb-${idx}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Live Preview Card (with drag/swipe + animated carousel) ──────────────────
function LivePreview({ title, description, amount, currency, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");
  const hasImage = images.length > 0;

  // ── Drag / Swipe state for both touch and mouse ──
  const dragStartX = useRef(null);
  const dragCurrentX = useRef(null);
  const isDragging = useRef(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const imageContainerRef = useRef(null);

  // Auto-advance carousel when images change
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setSlideDirection("left");
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // ── Touch handlers (mobile) ──
  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    dragCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      !isDragging.current ||
      dragStartX.current === null ||
      dragCurrentX.current === null
    ) {
      isDragging.current = false;
      dragStartX.current = null;
      dragCurrentX.current = null;
      return;
    }
    const diff = dragStartX.current - dragCurrentX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goNext();
      else goPrev();
    }
    isDragging.current = false;
    dragStartX.current = null;
    dragCurrentX.current = null;
  };

  // ── Mouse drag handlers (desktop) ──
  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
    setIsDragActive(true);
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    dragCurrentX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (
      !isDragging.current ||
      dragStartX.current === null ||
      dragCurrentX.current === null
    ) {
      isDragging.current = false;
      setIsDragActive(false);
      dragStartX.current = null;
      dragCurrentX.current = null;
      return;
    }
    const diff = dragStartX.current - dragCurrentX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goNext();
      else goPrev();
    }
    isDragging.current = false;
    setIsDragActive(false);
    dragStartX.current = null;
    dragCurrentX.current = null;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDragActive(false);
      dragStartX.current = null;
      dragCurrentX.current = null;
    }
  };

  const currentPreview = hasImage
    ? images[currentIndex]._previewUrl ||
      (() => {
        images[currentIndex]._previewUrl = URL.createObjectURL(
          images[currentIndex],
        );
        return images[currentIndex]._previewUrl;
      })()
    : null;

  const slideClass =
    slideDirection === "right" ? "animate-slide-right" : "animate-slide-left";

  return (
    <div className="w-full max-w-[220px] mx-auto select-none">
      <div
        className="rounded-lg overflow-hidden border border-white/10"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {/* Image area with drag/swipe support for BOTH mobile + desktop */}
        <div
          ref={imageContainerRef}
          className={`relative w-full aspect-[3/4] bg-white/5 flex items-center justify-center overflow-hidden grab-cursor ${isDragActive ? "dragging" : ""}`}
          // Touch events (mobile)
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // Mouse events (desktop drag)
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {hasImage ? (
            <div key={currentIndex} className={`w-full h-full ${slideClass}`}>
              <img
                src={currentPreview}
                alt="preview"
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}

          {/* NEW badge */}
          <div className="absolute top-2 left-2 bg-[#c4956a]/90 text-white text-[9px] font-medium tracking-widest px-1.5 py-0.5 rounded-sm uppercase pointer-events-none">
            New
          </div>

          {/* Image counter badge */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation arrows for multiple images — FIXED: no translateY animation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white/80 flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all duration-200 z-10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white/80 flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all duration-200 z-10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Drag/swipe hint — shows on both mobile and desktop */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/60 text-[9px] px-2 py-0.5 rounded-full pointer-events-none select-none whitespace-nowrap">
              Drag or swipe to browse
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p
            className="font-['Playfair_Display'] text-[13px] font-medium leading-tight mb-1 line-clamp-2"
            style={{
              color: title ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
            }}
          >
            {title || "Product Title"}
          </p>
          <p
            className="text-[10px] leading-relaxed mb-2.5 line-clamp-2"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {description || "Your description will appear here"}
          </p>
          <p
            className="text-[13px] font-medium tracking-wide"
            style={{ color: amount ? "#c4956a" : "rgba(255,255,255,0.2)" }}
          >
            {amount
              ? formatAmount(amount, currency)
              : `${CURRENCY_CONFIG[currency]?.symbol || "$"} —`}
          </p>
        </div>
      </div>

      {/* Thumbnail carousel below card */}
      <PreviewCarousel
        images={images}
        currentIndex={currentIndex}
        onSelect={(idx) => {
          setSlideDirection(idx > currentIndex ? "right" : "left");
          setCurrentIndex(idx);
        }}
      />
    </div>
  );
}

// ── Mobile Preview Sheet (collapsible on small screens) ────────────────────
function MobilePreviewSheet({
  title,
  description,
  amount,
  currency,
  images,
  isOpen,
  onToggle,
}) {
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-4 bg-[#1a1a1a] text-white rounded-lg mb-4"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase text-white/70">
          Live Preview
        </span>
        <svg
          className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6 animate-scale-in">
          <LivePreview
            title={title}
            description={description}
            amount={amount}
            currency={currency}
            images={images}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { handleCreateProduct } = useProduct();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { title: "", description: "", amount: "" },
  });

  const titleReg = register("title", {
    required: "Product title is required",
    minLength: { value: 3, message: "Title must be at least 3 characters" },
  });
  const descReg = register("description", {
    required: "Product description is required",
    minLength: {
      value: 10,
      message: "Description must be at least 10 characters",
    },
  });
  const amountReg = register("amount", {
    required: "Amount is required",
    min: { value: 0.01, message: "Amount must be a positive number" },
  });

  const handleImageAdd = (files) => {
    setImageError("");
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setImages((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const fresh = incoming.filter((f) => !existingNames.has(f.name));
      const combined = [...prev, ...fresh];
      if (combined.length > 7) {
        toast.error("Only 7 images allowed. Extra images were removed.");
        return combined.slice(0, 7);
      }
      return combined;
    });
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      setImageError("Please upload at least one product image");
      return;
    }

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("amount", data.amount);
    formData.append("currency", currency);

    images.forEach((file) => {
      formData.append("images", file);
    });

    const product = await handleCreateProduct(formData);

    if (product) navigate("/");
  };

  // Close preview on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5EFE6] font-['DM_Sans']">
      <FontLoader />

      {/* ── LEFT PANEL — dark editorial (hidden on mobile) ─────────────── */}
      <div className="hidden md:flex w-full md:w-[42%] lg:w-[38%] xl:w-[35%] min-h-screen bg-[#141414] relative flex-col justify-between p-8 lg:p-10 overflow-hidden flex-shrink-0">
        {/* subtle grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        {/* warm accent line top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c4956a] to-transparent" />

        {/* top — wordmark */}
        <div className="relative z-10">
          <span className="font-['Playfair_Display'] text-[13px] font-medium tracking-[0.28em] uppercase text-white/85">
            SNITCH
          </span>
        </div>

        {/* middle — live preview */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-full">
            <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/35 mb-2.5 text-center">
              Live Preview
            </p>
            <LivePreview
              title={title}
              description={description}
              amount={amount}
              currency={currency}
              images={images}
            />
          </div>
        </div>

        {/* bottom — editorial copy */}
        <div className="relative z-10">
          <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/35 mb-2.5">
            Seller Studio
          </p>
          <h2 className="font-['Playfair_Display'] text-[clamp(28px,2.8vw,38px)] font-medium leading-[1.1] text-white mb-3">
            Add Your
            <br />
            Product to
            <br />
            the Edit.
          </h2>
          <p className="text-xs font-light text-white/40 leading-relaxed max-w-[220px]">
            Every great collection starts with a single listing. Make yours
            count.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ──────────────────────────────────────────── */}
      <div className="flex-1 min-h-screen overflow-y-auto bg-[#FAF8F5] flex flex-col">
        <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
          <div className="max-w-[440px] w-full mx-auto md:mx-0">
            {/* mobile wordmark */}
            <div className="md:hidden mb-6">
              <span className="font-['Playfair_Display'] text-[13px] font-medium tracking-[0.28em] uppercase text-[#1a1a1a]">
                SNITCH
              </span>
            </div>

            {/* Mobile collapsible preview */}
            <MobilePreviewSheet
              title={title}
              description={description}
              amount={amount}
              currency={currency}
              images={images}
              isOpen={mobilePreviewOpen}
              onToggle={() => setMobilePreviewOpen(!mobilePreviewOpen)}
            />

            {/* heading */}
            <div className="fade-up fade-up-1 mb-6 md:mb-8">
              <h1 className="font-['Playfair_Display'] text-[clamp(24px,2.5vw,30px)] font-medium text-[#1a1a1a] tracking-tight mb-1.5">
                List a Product
              </h1>
              <p className="text-xs text-[#888880] leading-relaxed">
                Fill in the details below to publish to your store.
              </p>
            </div>

            {/* ── Fields ── */}
            <div className="flex flex-col gap-4">
              <div className="fade-up fade-up-2">
                <FloatingInput
                  label="Product Title"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    titleReg.onChange(e);
                  }}
                  onBlur={titleReg.onBlur}
                  inputRef={titleReg.ref}
                  error={errors.title?.message}
                />
              </div>

              <div className="fade-up fade-up-3">
                <FloatingTextArea
                  label="Product Description"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    descReg.onChange(e);
                  }}
                  onBlur={descReg.onBlur}
                  inputRef={descReg.ref}
                  error={errors.description?.message}
                  MAX_DESC={MAX_DESC}
                />
              </div>

              <div className="fade-up fade-up-4">
                <ImageUploader
                  images={images}
                  onAdd={handleImageAdd}
                  onRemove={handleImageRemove}
                  error={imageError}
                  onPreview={(file) => setPreviewImage(file)}
                />
              </div>

              {/* pricing divider */}
              <div className="fade-up fade-up-5 flex items-center gap-3 my-1">
                <span className="flex-1 h-px bg-[#e8e6e0]" />
                <span className="text-[10px] tracking-[0.14em] uppercase text-[#b5b2a8] font-medium">
                  Pricing
                </span>
                <span className="flex-1 h-px bg-[#e8e6e0]" />
              </div>

              <div className="fade-up fade-up-5 flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-[3] w-full">
                  <FloatingInput
                    label="Amount"
                    name="amount"
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      amountReg.onChange(e);
                    }}
                    onBlur={amountReg.onBlur}
                    inputRef={amountReg.ref}
                    error={errors.amount?.message}
                  />
                </div>
                <div className="flex-[2] w-full sm:w-auto">
                  <CurrencySelector
                    value={currency}
                    onChange={setCurrency}
                    CURRENCIES={CURRENCIES}
                  />
                </div>
              </div>

              <div className="fade-up fade-up-6 pt-1">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-white
                    bg-[#1a1a1a] rounded hover:bg-[#2e2e2e] hover:text-white active:scale-[0.985]
                    transition-all duration-150 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <Spinner data-icon="inline-start" />}
                  Publish Product
                </Button>
              </div>
            </div>

            {/* back link */}
            <p className="text-center text-xs text-[#888880] mt-5">
              Changed your mind?{" "}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-[#c4956a] font-medium border-b border-[#c4956a]/40 hover:border-[#c4956a] bg-transparent cursor-pointer p-0 transition-colors pb-0.5"
              >
                Go Back
              </button>
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto">
          <Footer />
        </div>
      </div>

      {/* ── Image Preview Popup Modal ───────────────────────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative z-10 max-w-[90vw] max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-white text-[#1a1a1a] flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Image container */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={
                  previewImage._previewUrl || URL.createObjectURL(previewImage)
                }
                alt={previewImage.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Filename */}
            <p className="text-center text-white/80 text-xs mt-3 font-light">
              {previewImage.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
