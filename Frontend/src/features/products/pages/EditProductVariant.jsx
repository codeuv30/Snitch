import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Toast from "@/components/ui/Toast";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import useProduct from "../hooks/useProduct";
import FloatingInput from "../components/FloatingInput.jsx";
import Footer from "../components/Footer";
import {
  TrendingUp,
  Bell,
  Plus,
  ChevronLeft,
  Package,
  ImageIcon,
  X,
  Check,
  Layers,
  Sparkles,
  Pencil,
  Loader2,
  ArrowRight,
  FolderOpen,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Save,
} from "lucide-react";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .fade-up { animation: fadeUp 0.5s ease-out both; }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.12s; }
    .fade-up-3 { animation-delay: 0.19s; }
    .fade-up-4 { animation-delay: 0.26s; }
    .fade-up-5 { animation-delay: 0.33s; }
    .fade-up-6 { animation-delay: 0.40s; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out both; }
    .animate-scale-in { animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-slide-in { animation: slideIn 0.3s ease-out both; }
    .shimmer-bg { background: linear-gradient(90deg, #141414 25%, #1a1a1a 50%, #141414 75%); background-size: 200% 100%; animation: shimmer 2s infinite; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #444; }
  `}</style>
);

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY"];
const CURRENCY_CONFIG = {
  INR: { symbol: "₹", locale: "en-IN" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  JPY: { symbol: "¥", locale: "ja-JP" },
};

// --- Reusable Components ---

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  delay = 2,
  className = "",
}) => (
  <div
    className={`bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-${delay} shadow-sm hover:border-[#222] transition-colors duration-300 ${className}`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
        <Icon className="w-[18px] h-[18px] text-[#c4956a]" />
      </div>
      <div>
        <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">
          {title}
        </h2>
        <p className="text-[13px] text-[#888] font-medium">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const Chip = ({ label, onRemove, color = "gold", small = false }) => {
  const styles = {
    gold: "bg-[#c4956a]/10 text-[#c4956a] border-[#c4956a]/20",
    neutral: "bg-[#1a1a1a] text-[#888] border-[#2a2a2a]",
    active: "bg-[#c4956a] text-[#0a0a0a] border-[#c4956a]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-medium ${styles[color]} ${small ? "text-[11px] px-2 py-1 rounded-md" : "text-[12px] px-3 py-1.5 rounded-lg"}`}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-[#f87171] transition-colors"
        >
          <X className={`${small ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
        </button>
      )}
    </span>
  );
};

// --- Currency Selector ---

const CurrencySelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[13px] text-[#888] font-medium mb-2 block">
        Currency
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 bg-[#0a0a0a] border rounded-lg text-[13px] text-left flex items-center justify-between transition-all border-[#1a1a1a] hover:border-[#2a2a2a] text-[#f0ede8]`}
      >
        <span className="flex items-center gap-2">
          <span className="font-bold">
            {CURRENCY_CONFIG[value]?.symbol || "₹"}
          </span>
          {value}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#555] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-[#141414] border border-[#1a1a1a] rounded-lg shadow-xl max-h-[200px] overflow-y-auto animate-fade-in">
          <div className="p-1">
            {CURRENCIES.map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => {
                  onChange(curr);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors flex items-center gap-2 ${
                  value === curr
                    ? "bg-[#c4956a]/10 text-[#c4956a] font-medium"
                    : "text-[#888] hover:bg-[#1a1a1a] hover:text-[#f0ede8]"
                }`}
              >
                <span className="font-bold">
                  {CURRENCY_CONFIG[curr]?.symbol}
                </span>
                {curr}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Toggle Switch ---

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-[13px] text-[#f0ede8] font-medium">{label}</p>
      <p className="text-[11px] text-[#555] mt-0.5">
        {checked
          ? "Variant is visible to customers"
          : "Variant is hidden from customers"}
      </p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${checked ? "bg-[#c4956a]" : "bg-[#2a2a2a]"}`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-[#f0ede8] shadow-sm transition-all duration-300 ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  </div>
);

// --- Image Gallery Uploader ---

const ImageGalleryUploader = ({ images, onChange, existingImages = [], onExistingChange  }) => {
  const [previews, setPreviews] = useState([]);
  const [existingPreviews, setExistingPreviews] = useState(existingImages);
  const inputRef = useRef(null);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleFile = (files) => {
    const totalAfterAdd = existingImages.length + images.length + files.length;

    if (totalAfterAdd > 7) {
      Toast.error(
        `Maximum 7 images allowed. You can add ${7 - existingImages.length - images.length} more.`,
      );
      return;
    }
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        Toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast.error(`${file.name} is over 5MB`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }
  };

  const removeNewImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const removeExistingImage = (index) => {
    const newExisting = [...existingPreviews];
    newExisting.splice(index, 1);
    setExistingPreviews(newExisting);
    onExistingChange?.(newExisting);
  };

  const totalImages = existingPreviews.length + images.length;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {/* Existing Images */}
        {existingPreviews.map((img, index) => (
          <div
            key={`existing-${index}`}
            className="relative group aspect-square rounded-lg overflow-hidden border border-[#1a1a1a] bg-[#141414]"
          >
            <img
              src={img.url}
              alt={`Variant ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="p-2 bg-[#f87171]/20 text-[#f87171] rounded-lg hover:bg-[#f87171]/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-1.5 left-1.5">
              <span className="text-[9px] bg-[#0a0a0a]/80 text-[#888] px-1.5 py-0.5 rounded border border-[#2a2a2a]">
                Existing
              </span>
            </div>
          </div>
        ))}

        {/* New Images */}
        {previews.map((url, index) => (
          <div
            key={`new-${index}`}
            className="relative group aspect-square rounded-lg overflow-hidden border border-[#c4956a]/30 bg-[#141414]"
          >
            <img
              src={url}
              alt={`New ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                className="p-2 bg-[#f87171]/20 text-[#f87171] rounded-lg hover:bg-[#f87171]/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-1.5 left-1.5">
              <span className="text-[9px] bg-[#c4956a]/20 text-[#c4956a] px-1.5 py-0.5 rounded border border-[#c4956a]/30 font-medium">
                New
              </span>
            </div>
          </div>
        ))}

        {/* Add Button */}
        {totalImages < 7 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#c4956a]/40 hover:bg-[#c4956a]/5 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#1a1a1a] flex items-center justify-center group-hover:border-[#c4956a]/30 transition-all">
              <Plus className="w-5 h-5 text-[#555] group-hover:text-[#c4956a] transition-colors" />
            </div>
            <span className="text-[11px] text-[#555] group-hover:text-[#888] transition-colors">
              Add Image
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) =>
          e.target.files?.length > 0 && handleFile(e.target.files)
        }
        className="hidden"
      />

      <p className="text-[11px] text-[#555]">
        {totalImages}/7 images • PNG, JPG, WEBP up to 5MB each
      </p>
    </div>
  );
};

// --- Attributes Builder ---

const AttributesBuilder = ({ attributes, onChange }) => {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addAttribute = () => {
    const key = newKey.trim();
    const value = newValue.trim();
    if (!key || !value) {
      Toast.error("Enter both attribute name and value");
      return;
    }
    if (attributes[key]) {
      Toast.error("Attribute already exists");
      return;
    }
    onChange({ ...attributes, [key]: value });
    setNewKey("");
    setNewValue("");
  };

  const removeAttribute = (key) => {
    const newAttrs = { ...attributes };
    delete newAttrs[key];
    onChange(newAttrs);
  };

  return (
    <div className="space-y-4">
      {/* Add New Attribute */}
      <div className="flex gap-2 animate-fade-in">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Attribute name (e.g., Color)"
          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-[13px] text-[#f0ede8] placeholder:text-[#555] focus:outline-none focus:border-[#c4956a]/40 focus:ring-1 focus:ring-[#c4956a]/10 transition-all"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addAttribute())
          }
          placeholder="Value (e.g., Black)"
          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-[13px] text-[#f0ede8] placeholder:text-[#555] focus:outline-none focus:border-[#c4956a]/40 focus:ring-1 focus:ring-[#c4956a]/10 transition-all"
        />
        <button
          type="button"
          onClick={addAttribute}
          className="px-4 py-2.5 bg-[#c4956a] text-[#0a0a0a] rounded-lg text-[13px] font-semibold hover:bg-[#d4a57a] transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Existing Attributes */}
      {Object.keys(attributes).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(attributes).map(([key, value]) => (
            <div
              key={key}
              className="group flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 hover:border-[#c4956a]/20 transition-all"
            >
              <span className="text-[11px] text-[#c4956a] uppercase font-bold">
                {key}
              </span>
              <span className="text-[13px] text-[#f0ede8] font-medium">
                {value}
              </span>
              <button
                type="button"
                onClick={() => removeAttribute(key)}
                className="text-[#555] hover:text-[#f87171] transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {Object.keys(attributes).length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-[#1a1a1a] rounded-xl">
          <Layers className="w-6 h-6 text-[#333] mx-auto mb-2" />
          <p className="text-[12px] text-[#555] font-medium">
            No attributes defined
          </p>
          <p className="text-[11px] text-[#444] mt-1">
            Add attributes like Color, Size, Material...
          </p>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

export default function EditProductVariant() {
  const { productId, variantId } = useParams();
  const navigate = useNavigate();

  // Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [attributes, setAttributes] = useState({});
  const [newImages, setNewImages] = useState([]); // File[] for new uploads
  const [existingImages, setExistingImages] = useState([]); // {url, _id}[] from API
  const [variantKey, setVariantKey] = useState(""); // Display only
  const [remainingExistingImages, setRemainingExistingImages] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [noChangesError, setNoChangesError] = useState("");

  const { handleGetVariant, handleEditProductVariant } = useProduct();
  const authLoading = useSelector((state) => state.auth.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: { amount: "", stock: "", sku: "" },
  });

  const amountReg = register("amount", {
    required: "Amount is required",
    min: { value: 0.01, message: "Amount must be a positive number" },
    max: { value: 999999, message: "Amount seems too high" },
  });

  const stockReg = register("stock", {
    required: "Stock is required",
    min: { value: 0, message: "Stock cannot be negative" },
    max: { value: 99999, message: "Stock seems too high" },
  });

  const skuReg = register("sku", {
    required: "SKU is required",
    minLength: { value: 3, message: "SKU must be at least 3 characters" },
    maxLength: { value: 50, message: "SKU must be under 50 characters" },
  });

  // Fetch Variant Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await handleGetVariant(variantId);

        if (response.success) {
          const variant = response.variant;

          // Pre-fill form
          setAmount(variant.price?.amount?.toString() || "");
          setCurrency(variant.price?.currency || "INR");
          setStock(variant.stock?.toString() || "");
          setSku(variant.sku || "");
          setIsAvailable(variant.isAvailable !== false); // default true
          setAttributes(variant.attributes || {});
          setExistingImages(variant.images || []);
          setRemainingExistingImages(variant.images || [])
          setVariantKey(variant.variantKey || "");

          // Reset react-hook-form
          reset({
            amount: variant.price?.amount?.toString() || "",
            stock: variant.stock?.toString() || "",
            sku: variant.sku || "",
          });
        } else {
          setError(response.message || "Failed to load variant details");
        }
      } catch (err) {
        console.error("Fetch variant error:", err);
        setError(
          "Error fetching variant details or the product is not Live. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (variantId) fetchDetails();
  }, [variantId, handleGetVariant, reset]);

  // Check if any changes were made
  const hasChanges = (data) => {
    // Compare current values with original (you'd need to store originals)
    // For simplicity, we check if any field is filled and new images exist
    return true; // Always allow submit for now, or implement deep comparison
  };

  const onSubmit = async (data) => {
    setNoChangesError("");

    // Check if any changes were actually made
    const originalAmount = existingImages.length > 0 ? existingImages[0] : null; // placeholder logic

    // Build current state for comparison
    const currentState = {
      amount: parseFloat(data.amount),
      currency,
      stock: parseInt(data.stock),
      sku: data.sku.trim(),
      isAvailable,
      attributes,
      images: newImages,
    };

    // Simple check: if no new images and all fields match original, show error
    // (In production, you'd store original values and do deep comparison)
    if (newImages.length === 0 && !hasChanges(data)) {
      setNoChangesError(
        "No changes detected. Please modify at least one field before submitting.",
      );
      Toast.error("No changes made", {
        description: "Modify at least one field to update",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("amount", data.amount);
      formData.append("currency", currency);
      formData.append("stock", data.stock);
      formData.append("sku", data.sku.trim());
      formData.append("isAvailable", isAvailable.toString());
      formData.append("attributes", JSON.stringify(attributes));

      formData.append(
        "existingImages",
        JSON.stringify(remainingExistingImages.map((img) => img.url)),
      );
      newImages.forEach((file) => {
        formData.append("images", file);
      });

      const response = await handleEditProductVariant(
        productId,
        variantId,
        formData,
      );

      if (response.success) {
        navigate(`/seller/dashboard/products`);
      } else {
        setError(response.message || "Failed to update variant");
      }
    } catch (err) {
      console.error("Edit variant error:", err);
      setError("Error updating variant. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount, currency) => {
    if (!amount) return `${CURRENCY_CONFIG[currency]?.symbol || "₹"} —`;
    return `${CURRENCY_CONFIG[currency]?.symbol || "₹"}${Number(amount).toLocaleString(CURRENCY_CONFIG[currency]?.locale || "en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-[#0a0a0a] min-h-screen">
        <FontLoader />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#c4956a] border-t-transparent animate-spin" />
            <p className="text-[14px] text-[#888] font-medium animate-pulse">
              Loading variant details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#0a0a0a] min-h-screen">
      <FontLoader />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate(`/seller/dashboard/products`)
              }
              className="w-9 h-9 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold block">
                Seller Studio
              </span>
              <h1 className="font-['Playfair_Display'] text-[22px] lg:text-[26px] text-[#f0ede8] leading-tight font-semibold">
                Edit Variant
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm hidden lg:flex">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#555] mb-8 fade-up fade-up-1">
          <button
            onClick={() => navigate("/seller/dashboard")}
            className="hover:text-[#f0ede8] transition-colors font-medium"
          >
            Dashboard
          </button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <button
            onClick={() => navigate("/seller/dashboard/products")}
            className="hover:text-[#f0ede8] transition-colors font-medium"
          >
            Products
          </button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <button
            onClick={() =>
              navigate(`/seller/dashboard/products`)
            }
            className="hover:text-[#f0ede8] transition-colors font-medium"
          >
            Edit
          </button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <span className="text-[#f0ede8] font-semibold">Variant</span>
        </nav>

        {/* Variant Key Badge */}
        <div className="mb-6 fade-up fade-up-1">
          <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#1a1a1a] rounded-lg px-4 py-2.5">
            <Layers className="w-4 h-4 text-[#c4956a]" />
            <span className="text-[13px] text-[#f0ede8] font-medium">
              {variantKey || "Variant"}
            </span>
            <span className="text-[11px] text-[#555] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#2a2a2a]">
              {variantId?.slice(-6)}
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-[#f87171]/10 border border-[#f87171]/20 rounded-xl text-[#f87171] animate-fade-in">
            <p className="text-[14px] font-medium">{error}</p>
          </div>
        )}

        {noChangesError && (
          <div className="mb-6 p-4 bg-[#eab308]/10 border border-[#eab308]/20 rounded-xl text-[#eab308] animate-fade-in">
            <p className="text-[14px] font-medium">{noChangesError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pricing & Stock */}
            <SectionCard
              icon={TrendingUp}
              title="Pricing & Inventory"
              subtitle="Set price, currency, and stock level"
              delay={2}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <FloatingInput
                      label="Amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
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
                  <div className="sm:col-span-1">
                    <CurrencySelector value={currency} onChange={setCurrency} />
                  </div>
                </div>
                <FloatingInput
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    stockReg.onChange(e);
                  }}
                  onBlur={stockReg.onBlur}
                  inputRef={stockReg.ref}
                  error={errors.stock?.message}
                />
              </div>
            </SectionCard>

            {/* SKU & Availability */}
            <SectionCard
              icon={Package}
              title="SKU & Status"
              subtitle="Manage SKU and visibility"
              delay={3}
            >
              <div className="space-y-5">
                <FloatingInput
                  label="SKU (Stock Keeping Unit)"
                  name="sku"
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value);
                    skuReg.onChange(e);
                  }}
                  onBlur={skuReg.onBlur}
                  inputRef={skuReg.ref}
                  error={errors.sku?.message}
                />
                <div className="pt-2">
                  <ToggleSwitch
                    label="Variant Availability"
                    checked={isAvailable}
                    onChange={setIsAvailable}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Attributes */}
            <SectionCard
              icon={Layers}
              title="Attributes"
              subtitle="Define variant-specific attributes"
              delay={4}
            >
              <AttributesBuilder
                attributes={attributes}
                onChange={setAttributes}
              />
            </SectionCard>

            {/* Images */}
            <SectionCard
              icon={ImageIcon}
              title="Variant Images"
              subtitle="Upload up to 7 product images"
              delay={5}
            >
              <ImageGalleryUploader
                images={newImages}
                onChange={setNewImages}
                existingImages={existingImages}
                onExistingChange={setRemainingExistingImages}
              />
            </SectionCard>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 fade-up fade-up-6">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={authLoading || isSubmitting}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#0a0a0a] bg-[#c4956a] rounded-xl hover:bg-[#d4a57a] hover:text-[#0a0a0a] active:scale-[0.985] transition-all duration-150 border-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#c4956a]/10"
              >
                {(authLoading || isSubmitting) && (
                  <Spinner data-icon="inline-start" />
                )}
                Save Changes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() =>
                  navigate(`/seller/dashboard/products`)
                }
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#888] bg-[#141414] border-2 border-[#1a1a1a] rounded-xl hover:bg-[#1a1a1a] hover:border-[#2a2a2a] hover:text-[#f0ede8] active:scale-[0.985] transition-all duration-150 shadow-sm"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Variant Summary Card */}
              <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-2 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-[#c4956a]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold">
                    Variant Summary
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                    <span className="text-[12px] text-[#888] font-medium">
                      Price
                    </span>
                    <span
                      className={`text-[18px] font-bold tracking-wide ${amount ? "text-[#c4956a]" : "text-[#555]"}`}
                    >
                      {formatPrice(amount, currency)}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                    <span className="text-[12px] text-[#888] font-medium">
                      Stock
                    </span>
                    <span
                      className={`text-[16px] font-semibold ${parseInt(stock) < 5 ? "text-[#f87171]" : "text-[#f0ede8]"}`}
                    >
                      {stock || "—"}{" "}
                      <span className="text-[11px] text-[#555] font-normal">
                        units
                      </span>
                    </span>
                  </div>

                  {/* SKU */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                    <span className="text-[12px] text-[#888] font-medium">
                      SKU
                    </span>
                    <span className="font-mono text-[13px] text-[#f0ede8] bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a]">
                      {sku || "—"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]">
                    <span className="text-[12px] text-[#888] font-medium">
                      Status
                    </span>
                    <span
                      className={`text-[12px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        isAvailable
                          ? "bg-[#2d5a3d]/20 text-[#4ade80] border border-[#2d5a3d]/30"
                          : "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20"
                      }`}
                    >
                      {isAvailable ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Attributes */}
                  <div>
                    <span className="text-[12px] text-[#888] font-medium block mb-2">
                      Attributes
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(attributes).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-1.5 bg-[#1a1a1a] px-2 py-1.5 rounded-lg border border-[#2a2a2a]"
                        >
                          <span className="text-[10px] text-[#c4956a] uppercase font-bold">
                            {key}
                          </span>
                          <span className="text-[11px] text-[#f0ede8]">
                            {value}
                          </span>
                        </div>
                      ))}
                      {Object.keys(attributes).length === 0 && (
                        <span className="text-[11px] text-[#555]">
                          No attributes
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-[#141414] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-4 shadow-sm">
                <h3 className="font-['Playfair_Display'] text-[15px] text-[#f0ede8] mb-4 font-semibold">
                  Editing Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    "Price and stock are the most commonly updated fields",
                    "SKU must be unique across all your variants",
                    "Set stock to 0 to mark as out of stock without deleting",
                    "Toggle availability to hide variants from customers",
                    "Attributes define how this variant appears in filters",
                    "Upload clear images showing this specific variant",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[13px] text-[#888] leading-relaxed"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#c4956a]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[11px] text-[#c4956a] font-bold">
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
      <Footer />
    </div>
  );
}