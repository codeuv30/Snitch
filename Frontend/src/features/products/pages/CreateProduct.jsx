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
  TrendingUp,
  Bell,
  Plus,
  ChevronLeft,
  Eye,
  ImageIcon,
  X,
  Package,
  Tag,
  Check,
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

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }

    .carousel-scroll::-webkit-scrollbar { height: 3px; }
    .carousel-scroll::-webkit-scrollbar-track { background: transparent; }
    .carousel-scroll::-webkit-scrollbar-thumb { background: rgba(196,149,106,0.6); border-radius: 3px; }
    .carousel-scroll { scrollbar-width: thin; scrollbar-color: rgba(196,149,106,0.6) transparent; }

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

// ── Tag/Category config from model schema ─────────────────────────────────────
const ALL_TAGS = [
  "men", "women", "shirts", "t-shirts", "jeans",
  "trousers", "blazers", "footwear", "accessories", "ethnic",
  "tops", "dresses", "outerwear", "bottoms",
];

const ALL_CATEGORIES = [
  "men", "women", "unisex",
  "shirts", "t-shirts", "jeans", "trousers",
  "blazers", "footwear", "accessories", "ethnic",
  "tops", "dresses", "outerwear", "bottoms",
];

// ── Tag Selector ──────────────────────────────────────────────────────────────
const TagSelector = ({ selectedTags, onChange }) => {
  return (
    <div>
      <p className="text-[13px] text-[#888] mb-3 font-medium">
        Select all that apply — used for search and filtering
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(selectedTags.filter((t) => t !== tag));
                } else {
                  onChange([...selectedTags, tag]);
                }
              }}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-medium tracking-[0.05em] capitalize
                         transition-all duration-150 flex items-center gap-1.5 border
                         ${isSelected
                           ? "bg-[#c4956a] text-[#0a0a0a] border-[#c4956a] shadow-md"
                           : "bg-[#141414] text-[#888] border-[#1a1a1a] hover:border-[#c4956a] hover:text-[#f0ede8] hover:bg-[#1a1a1a]"
                         }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              {tag}
            </button>
          );
        })}
      </div>
      {selectedTags.length > 0 && (
        <p className="text-[12px] text-[#c4956a] mt-3 font-medium">
          {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

// ── Category Selector ─────────────────────────────────────────────────────────
const CategorySelector = ({ value, onChange }) => {
  return (
    <div>
      <p className="text-[13px] text-[#888] mb-3 font-medium">
        Primary category — determines where your product appears in navigation
      </p>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = value === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(isSelected ? null : cat)}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-medium tracking-[0.05em] capitalize
                         transition-all duration-150 flex items-center gap-1.5 border
                         ${isSelected
                           ? "bg-[#8B6F5A] text-white border-[#8B6F5A] shadow-md"
                           : "bg-[#141414] text-[#888] border-[#1a1a1a] hover:border-[#8B6F5A] hover:text-[#f0ede8] hover:bg-[#1a1a1a]"
                         }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              {cat}
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-[12px] text-[#c4956a] mt-3 font-medium">
          Category: <span className="font-semibold capitalize">{value}</span>
        </p>
      )}
    </div>
  );
};

// ── Preview Carousel ─────────────────────────────────────────────────
function PreviewCarousel({ images, currentIndex, onSelect }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      const thumb = scrollRef.current.children[currentIndex];
      if (thumb)
        thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentIndex]);

  if (images.length <= 1) return null;

  return (
    <div className="mt-3">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto carousel-scroll pb-1 px-0.5">
        {images.map((file, idx) => {
          const preview = file._previewUrl || URL.createObjectURL(file);
          if (!file._previewUrl) file._previewUrl = preview;
          const isActive = idx === currentIndex;
          return (
            <button
              key={`thumb-${file.name}-${idx}`}
              type="button"
              onClick={() => onSelect(idx)}
              className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 border-2
                ${isActive ? "border-[#c4956a] shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100 hover:border-[#333]"}`}
            >
              <img src={preview} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Live Preview Card ─────────────────────────────────────────────────
function LivePreview({ title, description, amount, currency, images, tags, category }) {
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

  const handleTouchStart = (e) => { dragStartX.current = e.touches[0].clientX; isDragging.current = true; };
  const handleTouchMove = (e) => { if (!isDragging.current) return; dragCurrentX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    if (!isDragging.current || dragStartX.current === null || dragCurrentX.current === null) {
      isDragging.current = false; dragStartX.current = null; dragCurrentX.current = null; return;
    }
    const diff = dragStartX.current - dragCurrentX.current;
    if (Math.abs(diff) > 50) { if (diff > 0) goNext(); else goPrev(); }
    isDragging.current = false; dragStartX.current = null; dragCurrentX.current = null;
  };

  const handleMouseDown = (e) => { dragStartX.current = e.clientX; isDragging.current = true; setIsDragActive(true); e.preventDefault(); };
  const handleMouseMove = (e) => { if (!isDragging.current) return; dragCurrentX.current = e.clientX; };
  const handleMouseUp = () => {
    if (!isDragging.current || dragStartX.current === null || dragCurrentX.current === null) {
      isDragging.current = false; setIsDragActive(false); dragStartX.current = null; dragCurrentX.current = null; return;
    }
    const diff = dragStartX.current - dragCurrentX.current;
    if (Math.abs(diff) > 50) { if (diff > 0) goNext(); else goPrev(); }
    isDragging.current = false; setIsDragActive(false); dragStartX.current = null; dragCurrentX.current = null;
  };
  const handleMouseLeave = () => {
    if (isDragging.current) { isDragging.current = false; setIsDragActive(false); dragStartX.current = null; dragCurrentX.current = null; }
  };

  const currentPreview = hasImage
    ? images[currentIndex]._previewUrl ||
      (() => { images[currentIndex]._previewUrl = URL.createObjectURL(images[currentIndex]); return images[currentIndex]._previewUrl; })()
    : null;

  const slideClass = slideDirection === "right" ? "animate-slide-right" : "animate-slide-left";

  return (
    <div className="w-full select-none">
      <div className="rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#0f0f0f] shadow-sm">
        <div
          className={`relative w-full aspect-[4/3] bg-[#141414] flex items-center justify-center overflow-hidden grab-cursor ${isDragActive ? "dragging" : ""}`}
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
              <img src={currentPreview} alt="preview" className="w-full h-full object-cover pointer-events-none" draggable={false} />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <ImageIcon className="w-12 h-12 text-[#333]" />
              <span className="text-[13px] text-[#555] font-medium">No image uploaded</span>
              <span className="text-[11px] text-[#444]">Add images to see preview</span>
            </div>
          )}

          <div className="absolute top-3 left-3 bg-[#f0ede8] text-[#0a0a0a] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase pointer-events-none shadow-md">
            New
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 active:scale-90 transition-all duration-200 z-10 shadow-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 active:scale-90 transition-all duration-200 z-10 shadow-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white/80 text-[10px] px-3 py-1 rounded-full pointer-events-none select-none whitespace-nowrap font-medium">
              Drag or swipe to browse
            </div>
          )}
        </div>

        <div className="p-4">
          <p className={`font-['Playfair_Display'] text-[16px] font-semibold leading-tight mb-2 line-clamp-2 ${title ? "text-[#f0ede8]" : "text-[#555]"}`}>
            {title || "Product Title"}
          </p>
          <p className="text-[13px] leading-relaxed mb-3 line-clamp-2 text-[#888]">
            {description || "Your description will appear here"}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[11px] text-[#c4956a] bg-[#1a1108] px-2 py-1 rounded-md capitalize font-medium border border-[#2a1f0a]">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && <span className="text-[11px] text-[#555] font-medium">+{tags.length - 3}</span>}
            </div>
          )}
          <p className={`text-[16px] font-bold tracking-wide ${amount ? "text-[#c4956a]" : "text-[#555]"}`}>
            {amount ? formatAmount(amount, currency) : `${CURRENCY_CONFIG[currency]?.symbol || "$"} —`}
          </p>
        </div>
      </div>

      <PreviewCarousel
        images={images}
        currentIndex={currentIndex}
        onSelect={(idx) => { setSlideDirection(idx > currentIndex ? "right" : "left"); setCurrentIndex(idx); }}
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

  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);
  const [tagsError, setTagsError] = useState("");

  const { handleCreateProduct } = useProduct();
  const loading = useSelector((state) => state.auth.loading);
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
    minLength: { value: 10, message: "Description must be at least 10 characters" },
  });
  const amountReg = register("amount", {
    required: "Amount is required",
    min: { value: 0.01, message: "Amount must be a positive number" },
  });

  const handleImageAdd = (files) => {
    setImageError("");
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
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
    if (tags.length === 0) {
      setTagsError("Please select at least one tag");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("amount", data.amount);
    formData.append("currency", currency);

    tags.forEach((tag) => formData.append("tags[]", tag));
    if (category) formData.append("category", category);

    images.forEach((file) => formData.append("images", file));

    const product = await handleCreateProduct(formData);
    if (product) {
      toast.success("Product published successfully!");
      navigate("/seller/dashboard/products");
    }
  };

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") setPreviewImage(null); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#0a0a0a] min-h-screen">
      <FontLoader />

      {/* Dashboard Top Bar */}
      <header className="sticky top-0 lg:top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/seller/dashboard/products")}
              className="w-9 h-9 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center
                         text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold block">
                Seller Studio
              </span>
              <h1 className="font-['Playfair_Display'] text-[22px] lg:text-[26px] text-[#f0ede8] leading-tight font-semibold">
                Add New Product
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center
                               text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm hidden lg:flex">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#555] mb-8 fade-up fade-up-1">
          <button onClick={() => navigate("/seller/dashboard")} className="hover:text-[#f0ede8] transition-colors font-medium">
            Dashboard
          </button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <button onClick={() => navigate("/seller/dashboard/products")} className="hover:text-[#f0ede8] transition-colors font-medium">
            Products
          </button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <span className="text-[#f0ede8] font-semibold">Add New</span>
        </nav>

        {/* Two Column Layout: Form + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Section: Basic Info */}
            <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-2 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
                  <Package className="w-4.5 h-4.5 text-[#c4956a]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">Basic Information</h2>
                  <p className="text-[13px] text-[#888] font-medium">Name and describe your product</p>
                </div>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  label="Product Title"
                  name="title"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); titleReg.onChange(e); }}
                  onBlur={titleReg.onBlur}
                  inputRef={titleReg.ref}
                  error={errors.title?.message}
                />
                <FloatingTextArea
                  label="Product Description"
                  name="description"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); descReg.onChange(e); }}
                  onBlur={descReg.onBlur}
                  inputRef={descReg.ref}
                  error={errors.description?.message}
                  MAX_DESC={1000}
                />
              </div>
            </div>

            {/* Section: Images */}
            <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-3 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
                  <Eye className="w-4.5 h-4.5 text-[#c4956a]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">Product Images</h2>
                  <p className="text-[13px] text-[#888] font-medium">Upload up to 7 images (first is cover)</p>
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

            {/* Section: Tags */}
            <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-4 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
                  <Tag className="w-4.5 h-4.5 text-[#c4956a]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">Tags</h2>
                  <p className="text-[13px] text-[#888] font-medium">Help customers find your product</p>
                </div>
              </div>

              <TagSelector selectedTags={tags} onChange={(newTags) => { setTags(newTags); setTagsError(""); }} />
              {tagsError && (
                <p className="text-[13px] text-[#f87171] mt-3 flex items-center gap-1.5 font-medium">
                  <X className="w-4 h-4" />
                  {tagsError}
                </p>
              )}
            </div>

            {/* Section: Category */}
            <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-4 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
                  <Package className="w-4.5 h-4.5 text-[#c4956a]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">Category</h2>
                  <p className="text-[13px] text-[#888] font-medium">Primary category for navigation (optional)</p>
                </div>
              </div>

              <CategorySelector value={category} onChange={setCategory} />
            </div>

            {/* Section: Pricing */}
            <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
                  <TrendingUp className="w-4.5 h-4.5 text-[#c4956a]" />
                </div>
                <div>
                  <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">Pricing</h2>
                  <p className="text-[13px] text-[#888] font-medium">Set your product price</p>
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
                    onChange={(e) => { setAmount(e.target.value); amountReg.onChange(e); }}
                    onBlur={amountReg.onBlur}
                    inputRef={amountReg.ref}
                    error={errors.amount?.message}
                  />
                </div>
                <div className="flex-[2] w-full sm:w-auto">
                  <CurrencySelector dark={true} value={currency} onChange={setCurrency} CURRENCIES={CURRENCIES} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 fade-up fade-up-6">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#0a0a0a]
                    bg-[#c4956a] rounded-xl hover:bg-[#d4a57a] hover:text-[#0a0a0a] active:scale-[0.985]
                    transition-all duration-150 border-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading && <Spinner data-icon="inline-start" />}
                <Plus className="w-4 h-4 mr-2" />
                Publish Product
              </Button>
              <Button
                onClick={() => navigate("/seller/dashboard/products")}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#888]
                    bg-[#141414] border-2 border-[#1a1a1a] rounded-xl hover:bg-[#1a1a1a] hover:border-[#2a2a2a] hover:text-[#f0ede8] active:scale-[0.985]
                    transition-all duration-150 shadow-sm"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Right: Sticky Live Preview */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-2 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4.5 h-4.5 text-[#c4956a]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold">
                    Live Preview
                  </span>
                </div>
                <LivePreview
                  title={title}
                  description={description}
                  amount={amount}
                  currency={currency}
                  images={images}
                  tags={tags}
                  category={category}
                />
                <p className="text-[12px] text-[#555] text-center mt-4 leading-relaxed font-medium">
                  This is how your product will appear to customers in your store
                </p>
              </div>

              {/* Tips Card */}
              <div className="bg-[#141414] rounded-xl border border-[#1a1a1a] p-5 mt-4 fade-up fade-up-4 shadow-sm">
                <h3 className="font-['Playfair_Display'] text-[15px] text-[#f0ede8] mb-4 font-semibold">
                  Tips for better listings
                </h3>
                <ul className="space-y-3">
                  {[
                    "Use high-quality images with good lighting",
                    "Write detailed, honest descriptions",
                    "Add relevant tags for better discoverability",
                    "Set a primary category so customers can browse easily",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] text-[#888] leading-relaxed">
                      <div className="w-6 h-6 rounded-full bg-[#c4956a]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[11px] text-[#c4956a] font-bold">{i + 1}</span>
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

      <Footer />

      {/* Image Preview Popup */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 max-w-[90vw] max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-[#0f0f0f] text-[#f0ede8] flex items-center justify-center shadow-xl hover:bg-[#1a1a1a] transition-colors border border-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="bg-[#0f0f0f] rounded-xl overflow-hidden shadow-2xl border border-[#1a1a1a]">
              <img
                src={previewImage._previewUrl || URL.createObjectURL(previewImage)}
                alt={previewImage.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <p className="text-center text-[#f0ede8]/90 text-[13px] mt-3 font-medium">{previewImage.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}