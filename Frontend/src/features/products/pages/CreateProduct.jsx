import React, { useState, useRef, useEffect, useCallback } from "react";
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
import Footer from "../components/Footer";
import {
  ArrowLeft,
  Package,
  BarChart3,
  TrendingUp,
  Download,
  Settings,
  User,
  Bell,
  Plus,
  ChevronLeft,
  Eye,
  ImageIcon,
  X,
} from "lucide-react";

// ── Fonts & Animations ───────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
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
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
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
    .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #d6d1c8; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #b5b2a8; }

    /* Carousel */
    .carousel-scroll::-webkit-scrollbar { height: 3px; }
    .carousel-scroll::-webkit-scrollbar-track { background: transparent; }
    .carousel-scroll::-webkit-scrollbar-thumb { background: rgba(196,149,106,0.4); border-radius: 3px; }
    .carousel-scroll { scrollbar-width: thin; scrollbar-color: rgba(196,149,106,0.4) transparent; }
    
    .grab-cursor { cursor: grab; }
    .grab-cursor:active, .grab-cursor.dragging { cursor: grabbing; }
  `}</style>
);

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];

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

// ── Preview Carousel ─────────────────────────────────────────────────
function PreviewCarousel({ images, currentIndex, onSelect }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      const thumb = scrollRef.current.children[currentIndex];
      if (thumb)
        thumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
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
              className={`relative flex-shrink-0 w-10 h-10 rounded overflow-hidden transition-all duration-200
                ${isActive ? "ring-2 ring-[#c4956a] ring-offset-1 ring-offset-[#141414] opacity-100 scale-105" : "opacity-50 hover:opacity-80 hover:scale-105"}`}
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

// ── Live Preview Card ─────────────────────────────────────────────────
function LivePreview({ title, description, amount, currency, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");
  const hasImage = images.length > 0;
  const dragStartX = useRef(null);
  const dragCurrentX = useRef(null);
  const isDragging = useRef(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) setCurrentIndex(0);
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
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    isDragging.current = false;
    dragStartX.current = null;
    dragCurrentX.current = null;
  };

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
    setIsDragActive(true);
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
    if (Math.abs(diff) > 50) {
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
    <div className="w-full select-none">
      <div className="rounded-xl overflow-hidden border border-[#e8e6e0] bg-white shadow-sm">
        <div
          className={`relative w-full aspect-[4/3] bg-[#f0ede8] flex items-center justify-center overflow-hidden grab-cursor ${isDragActive ? "dragging" : ""}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <ImageIcon className="w-10 h-10 text-[#d6d1c8]" />
              <span className="text-[11px] text-[#b5b2a8]">
                No image uploaded
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[9px] font-medium tracking-widest px-2 py-1 rounded-md uppercase pointer-events-none">
            New
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2.5 py-1 rounded-full pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all duration-200 z-10"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 flex items-center justify-center hover:bg-black/70 active:scale-90 transition-all duration-200 z-10"
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

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/60 text-[9px] px-2.5 py-1 rounded-full pointer-events-none select-none whitespace-nowrap">
              Drag or swipe to browse
            </div>
          )}
        </div>

        <div className="p-4">
          <p
            className={`font-['Playfair_Display'] text-[15px] font-medium leading-tight mb-1 line-clamp-2 ${title ? "text-[#1a1a1a]" : "text-[#b5b2a8]"}`}
          >
            {title || "Product Title"}
          </p>
          <p className="text-[12px] leading-relaxed mb-3 line-clamp-2 text-[#888880]">
            {description || "Your description will appear here"}
          </p>
          <p
            className={`text-[15px] font-semibold tracking-wide ${amount ? "text-[#c4956a]" : "text-[#d6d1c8]"}`}
          >
            {amount
              ? formatAmount(amount, currency)
              : `${CURRENCY_CONFIG[currency]?.symbol || "$"} —`}
          </p>
        </div>
      </div>

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

// ── Main Dashboard Create Product ─────────────────────────────────────
export default function CreateProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
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
    if (product) {
      toast.success("Product published successfully!");
      navigate("/seller/dashboard/products");
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <FontLoader />

      {/* Main Content */}

      {/* Dashboard Top Bar */}
      <header className="sticky top-0 lg:top-0 z-30 bg-[#F5EFE6]/90 backdrop-blur-md border-b border-[#e8e6e0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/seller/dashboard/products")}
              className="w-9 h-9 rounded-lg bg-white border border-[#e8e6e0] flex items-center justify-center
                         text-[#888880] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F5A] font-medium block">
                Seller Studio
              </span>
              <h1 className="font-['Playfair_Display'] text-[22px] lg:text-[26px] text-[#1a1a1a] leading-tight">
                Add New Product
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full bg-white border border-[#e8e6e0] flex items-center justify-center
                               text-[#888880] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-200
                               hidden lg:flex"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-[#b5b2a8] mb-8 fade-up fade-up-1">
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="hover:text-[#1a1a1a] transition-colors"
          >
            Dashboard
          </button>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <button
            onClick={() => navigate("/seller/dashboard/products")}
            className="hover:text-[#1a1a1a] transition-colors"
          >
            Products
          </button>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="text-[#1a1a1a] font-medium">Add New</span>
        </nav>

        {/* Two Column Layout: Form + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section: Basic Info */}
            <div className="bg-white rounded-xl border border-[#e8e6e0] p-6 fade-up fade-up-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#f5f0ea] flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#8B6F5A]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[18px] text-[#1a1a1a]">
                    Basic Information
                  </h2>
                  <p className="text-[12px] text-[#888880]">
                    Name and describe your product
                  </p>
                </div>
              </div>

              <div className="space-y-4">
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
                  MAX_DESC={1000}
                />
              </div>
            </div>

            {/* Section: Images */}
            <div className="bg-white rounded-xl border border-[#e8e6e0] p-6 fade-up fade-up-3">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#f5f0ea] flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#8B6F5A]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[18px] text-[#1a1a1a]">
                    Product Images
                  </h2>
                  <p className="text-[12px] text-[#888880]">
                    Upload up to 7 images (first is cover)
                  </p>
                </div>
              </div>
              <ImageUploader
                images={images}
                onAdd={handleImageAdd}
                onRemove={handleImageRemove}
                error={imageError}
                onPreview={(file) => setPreviewImage(file)}
              />
            </div>

            {/* Section: Pricing */}
            <div className="bg-white rounded-xl border border-[#e8e6e0] p-6 fade-up fade-up-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#f5f0ea] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#8B6F5A]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[18px] text-[#1a1a1a]">
                    Pricing
                  </h2>
                  <p className="text-[12px] text-[#888880]">
                    Set your product price
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start">
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
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 fade-up fade-up-5">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-white
                    bg-[#1a1a1a] rounded-xl hover:bg-[#2e2e2e] hover:text-white active:scale-[0.985]
                    transition-all duration-150 border-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Spinner data-icon="inline-start" />}
                <Plus className="w-4 h-4 mr-2" />
                Publish Product
              </Button>
              <Button
                onClick={() => navigate("/seller/dashboard/products")}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[11px] font-medium tracking-[0.16em] uppercase text-[#1a1a1a]
                    bg-white border border-[#e8e6e0] rounded-xl hover:bg-[#f5f0ea] active:scale-[0.985]
                    transition-all duration-150"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Right: Sticky Live Preview */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-xl border border-[#e8e6e0] p-5 fade-up fade-up-2">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-[#8B6F5A]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F5A] font-medium">
                    Live Preview
                  </span>
                </div>
                <LivePreview
                  title={title}
                  description={description}
                  amount={amount}
                  currency={currency}
                  images={images}
                />
                <p className="text-[11px] text-[#b5b2a8] text-center mt-4 leading-relaxed">
                  This is how your product will appear to customers in your
                  store
                </p>
              </div>

              {/* Tips Card */}
              <div className="bg-[#f5f0ea] rounded-xl border border-[#e8e6e0] p-5 mt-4 fade-up fade-up-4">
                <h3 className="font-['Playfair_Display'] text-[14px] text-[#1a1a1a] mb-3">
                  Tips for better listings
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Use high-quality images with good lighting",
                    "Write detailed, honest descriptions",
                    "Price competitively within your category",
                    "Upload multiple angles of your product",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[12px] text-[#888880] leading-relaxed"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#c4956a]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-[#c4956a] font-bold">
                          {i + 1}
                        </span>
                      </div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Image Preview Popup */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative z-10 max-w-[90vw] max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-white text-[#1a1a1a] flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <img
                src={
                  previewImage._previewUrl || URL.createObjectURL(previewImage)
                }
                alt={previewImage.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <p className="text-center text-white/80 text-xs mt-3 font-light">
              {previewImage.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
