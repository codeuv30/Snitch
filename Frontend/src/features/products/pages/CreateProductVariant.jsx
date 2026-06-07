import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import useProduct from "../hooks/useProduct";
import FloatingInput from "../components/FloatingInput.jsx";
import CurrencySelector from "../components/CurrencySelector.jsx";
import Footer from "../components/Footer";
import {
  TrendingUp,
  Bell, ChevronLeft, Package, ImageIcon, X, Check, Plus, ArrowRight,
  Layers, Tag, Box, Eye, EyeOff, Save, RotateCcw, ChevronDown,
  Upload, AlertCircle, Sparkles, Hash, Cpu, HardDrive, Palette, Ruler,
  Shirt, Footprints, Gem
} from "lucide-react";
import Toast from "@/components/ui/Toast";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(196, 149, 106, 0.2); } 50% { box-shadow: 0 0 0 8px rgba(196, 149, 106, 0); } }
    .fade-up { animation: fadeUp 0.5s ease-out both; }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.12s; }
    .fade-up-3 { animation-delay: 0.19s; }
    .fade-up-4 { animation-delay: 0.26s; }
    .fade-up-5 { animation-delay: 0.33s; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out both; }
    .animate-scale-in { animation: scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-slide-in { animation: slideInRight 0.4s ease-out both; }
    .pulse-glow { animation: pulse-glow 2s infinite; }
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

const OPTION_ICONS = {
  color: Palette,
  colour: Palette,
  size: Ruler,
  ram: Cpu,
  memory: Cpu,
  storage: HardDrive,
  disk: HardDrive,
  ssd: HardDrive,
  hdd: HardDrive,
  material: Gem,
  fabric: Shirt,
  style: Shirt,
  fit: Shirt,
  default: Tag,
};

const getOptionIcon = (name) => {
  const key = name.toLowerCase();
  return OPTION_ICONS[key] || OPTION_ICONS.default;
};

// --- Reusable Components ---

const SectionCard = ({ icon: Icon, title, subtitle, children, delay = 2, className = "" }) => (
  <div className={`bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 fade-up fade-up-${delay} shadow-sm hover:border-[#222] transition-colors duration-300 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-[#141414] flex items-center justify-center border border-[#1a1a1a]">
        <Icon className="w-[18px] h-[18px] text-[#c4956a]" />
      </div>
      <div>
        <h2 className="font-['Playfair_Display'] text-[19px] text-[#f0ede8] font-semibold">{title}</h2>
        <p className="text-[13px] text-[#888] font-medium">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-[13px] text-[#f0ede8] font-medium">{label}</p>
      {description && <p className="text-[12px] text-[#555] mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        checked ? "bg-[#c4956a]" : "bg-[#1a1a1a] border border-[#2a2a2a]"
      }`}
    >
      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-[#f0ede8] shadow-sm transition-all duration-300 ${
        checked ? "left-[calc(100%-26px)]" : "left-0.5"
      }`}>
        {checked ? (
          <Eye className="w-3 h-3 text-[#0a0a0a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <EyeOff className="w-3 h-3 text-[#555] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    </button>
  </div>
);

const ImageUploader = ({ images, onChange, maxImages = 7 }) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (files) => {
    const newImages = Array.from(files).filter(file => {
      if (!file.type.startsWith("image/")) {
        Toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const remainingSlots = maxImages - images.length;
    if (newImages.length > remainingSlots) {
      Toast.warning(`Only ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''} allowed`);
    }

    const toAdd = newImages.slice(0, remainingSlots);
    if (toAdd.length > 0) {
      onChange([...images, ...toAdd]);
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
          isDragOver
            ? "border-[#c4956a]/60 bg-[#c4956a]/10"
            : images.length > 0
              ? "border-[#c4956a]/20 bg-[#c4956a]/5"
              : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#2a2a2a] hover:bg-[#0f0f0f]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 text-center py-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isDragOver ? "bg-[#c4956a]/20 border-[#c4956a]/40" : "bg-[#141414] border-[#1a1a1a]"
          }`}>
            <Upload className={`w-5 h-5 transition-colors ${isDragOver ? "text-[#c4956a]" : "text-[#555]"}`} />
          </div>
          <div>
            <p className="text-[13px] text-[#888] font-medium">
              {isDragOver ? "Drop images here" : "Click or drag to upload images"}
            </p>
            <p className="text-[11px] text-[#555] mt-1">
              {images.length}/{maxImages} images • PNG, JPG, WEBP up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-fade-in">
          {images.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-[#1a1a1a] bg-[#141414]">
              <img
                src={URL.createObjectURL(file)}
                alt={`Variant ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/40 transition-all duration-200" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#f87171]/30 text-[#f87171] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#f87171] hover:text-[#0a0a0a]"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#0a0a0a]/80 backdrop-blur-sm text-[10px] text-[#888] font-medium border border-[#1a1a1a]">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DynamicAttributeSelector = ({ variantOptions, attributes, onChange }) => {
  if (!variantOptions || variantOptions.length === 0) return null;

  return (
    <div className="space-y-5">
      {variantOptions.map((option) => {
        const Icon = getOptionIcon(option.name);
        const isComplete = attributes[option.name] !== undefined;

        return (
          <div key={option.name} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-[#c4956a]" />
              <label className="text-[13px] text-[#888] font-medium">
                {option.name}
              </label>
              {isComplete && (
                <span className="text-[10px] text-[#c4956a] bg-[#c4956a]/10 px-1.5 py-0.5 rounded border border-[#c4956a]/20 font-medium">
                  Selected
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = attributes[option.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChange({ ...attributes, [option.name]: value })}
                    className={`px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-all duration-200 ${
                      isSelected
                        ? "bg-[#c4956a] text-[#0a0a0a] border-[#c4956a] shadow-sm shadow-[#c4956a]/20"
                        : "bg-[#141414] text-[#888] border-[#1a1a1a] hover:border-[#555] hover:text-[#f0ede8]"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 -mt-0.5" strokeWidth={3} />}
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Component ---

export default function CreateProductVariant() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleAddVariant } = useProduct();
  const loading = useSelector((state) => state.auth.loading);

  const [product, setProduct] = useState(location.state?.product || null);

  const [sku, setSku] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [attributes, setAttributes] = useState({});
  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState("");
  const [attributesError, setAttributesError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdVariants, setCreatedVariants] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: "onTouched",
    defaultValues: { sku: "", amount: "", stock: "" }
  });

  // Redirect if no product data
  useEffect(() => {
    if (!product && productId) {
      Toast.error("Product data not found. Please create a product first.");
      navigate("/seller/dashboard/products");
    }
  }, [product, productId, navigate]);

  // Auto-generate SKU based on attributes
  useEffect(() => {
    if (product && Object.keys(attributes).length > 0) {
      const attrParts = Object.entries(attributes)
        .sort(([a], [b]) => {
          const orderA = product.variantOptions?.findIndex(opt => opt.name === a) ?? -1;
          const orderB = product.variantOptions?.findIndex(opt => opt.name === b) ?? -1;
          return orderA - orderB;
        })
        .map(([_, val]) => val.toUpperCase().replace(/\s+/g, '-'));

      if (attrParts.length > 0) {
        const prefix = product.title?.substring(0, 3).toUpperCase().replace(/\s+/g, '') || 'PRD';
        const suggestedSku = `${prefix}-${attrParts.join('-')}`;
        if (!sku || sku.startsWith(prefix)) {
          setSku(suggestedSku);
        }
      }
    }
  }, [attributes, product]);

  const skuReg = register("sku", {
    required: "SKU is required",
    minLength: { value: 3, message: "SKU must be at least 3 characters" },
    maxLength: { value: 50, message: "SKU must be under 50 characters" }
  });

  const amountReg = register("amount", {
    required: "Amount is required",
    min: { value: 0.01, message: "Amount must be positive" },
    max: { value: 999999, message: "Amount seems too high" }
  });

  const stockReg = register("stock", {
    required: "Stock quantity is required",
    min: { value: 0, message: "Stock cannot be negative" },
    max: { value: 99999, message: "Stock seems too high" },
    validate: (value) => Number.isInteger(Number(value)) || "Stock must be a whole number"
  });

  const validateAttributes = () => {
    if (!product?.variantOptions) return true;

    const requiredOptions = product.variantOptions.map(opt => opt.name);
    const missing = requiredOptions.filter(opt => !attributes[opt]);

    if (missing.length > 0) {
      setAttributesError(`Please select all attributes: ${missing.join(", ")}`);
      return false;
    }

    setAttributesError("");
    return true;
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      setImagesError("At least one image is required");
      return;
    } else {
      setImagesError("");
    }

    if (!validateAttributes()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("sku", data.sku.trim().toUpperCase());
      formData.append("amount", data.amount);
      formData.append("currency", currency);
      formData.append("stock", data.stock);
      formData.append("isAvailable", isAvailable.toString());

      // Attributes must be sent as JSON string
      formData.append("attributes", JSON.stringify(attributes));

      // Append each image file
      images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await handleAddVariant(productId, formData);

      if (response?.success && response?.variant) {
        setCreatedVariants(prev => [...prev, response.variant]);

        // Reset form for next variant
        reset();
        setSku("");
        setAmount("");
        setStock("");
        setIsAvailable(true);
        setAttributes({});
        setImages([]);
        setImagesError("");
        setAttributesError("");

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Create variant error:", err);
      Toast.error("Something went wrong", {
        description: err?.message || "Please check your connection and try again"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount, currency) => {
    if (!amount) return `${CURRENCY_CONFIG[currency]?.symbol || "₹"} —`;
    return `${CURRENCY_CONFIG[currency]?.symbol || "₹"}${Number(amount).toLocaleString(CURRENCY_CONFIG[currency]?.locale || "en-IN")}`;
  };

  const getVariantKey = (attrs) => {
    return Object.entries(attrs).map(([k, v]) => `${k}: ${v}`).join(" | ");
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-[#888]">
        <AlertCircle className="w-12 h-12 text-[#c4956a] mb-4" />
        <p className="text-[16px] font-medium">Product not found</p>
        <p className="text-[13px] mt-2 mb-6">Please create a product first</p>
        <Button
          onClick={() => navigate("/seller/dashboard/products")}
          className="bg-[#c4956a] text-[#0a0a0a] hover:bg-[#d4a57a]"
        >
          Go to Products
        </Button>
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
              onClick={() => navigate("/seller/dashboard/products")}
              className="w-9 h-9 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold block">Seller Studio</span>
              <h1 className="font-['Playfair_Display'] text-[22px] lg:text-[26px] text-[#f0ede8] leading-tight font-semibold">Add Variant</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {createdVariants.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#c4956a]/10 border border-[#c4956a]/20">
                <Check className="w-3.5 h-3.5 text-[#c4956a]" />
                <span className="text-[12px] text-[#c4956a] font-medium">{createdVariants.length} created</span>
              </div>
            )}
            <button className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm hidden lg:flex">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#555] mb-8 fade-up fade-up-1">
          <button onClick={() => navigate("/seller/dashboard")} className="hover:text-[#f0ede8] transition-colors font-medium">Dashboard</button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <button onClick={() => navigate("/seller/dashboard/products")} className="hover:text-[#f0ede8] transition-colors font-medium">Products</button>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <span className="text-[#888] font-medium truncate max-w-[150px]">{product.title}</span>
          <ChevronLeft className="w-3.5 h-3.5 rotate-180 text-[#444]" />
          <span className="text-[#f0ede8] font-semibold">Add Variant</span>
        </nav>

        {/* Stepper */}
        <div className="flex items-center gap-4 mb-8 fade-up fade-up-1">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-8 h-8 rounded-full bg-[#c4956a] text-[#0a0a0a] flex items-center justify-center text-[13px] font-bold">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className="text-[13px] text-[#c4956a] font-medium">Product Info</span>
          </div>
          <div className="flex-1 h-px bg-[#c4956a]/30" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c4956a] text-[#0a0a0a] flex items-center justify-center text-[13px] font-bold shadow-sm shadow-[#c4956a]/20">2</div>
            <span className="text-[13px] text-[#c4956a] font-semibold">Variants</span>
          </div>
        </div>

        {/* Product Context Bar */}
        <div className="bg-gradient-to-r from-[#141414] to-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-4 mb-6 fade-up fade-up-2 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden flex-shrink-0">
            {product.thumbnail ? (
              <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-[#555] m-3" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#888] font-medium truncate">{product.title}</p>
            <p className="text-[12px] text-[#555]">
              Base price: {formatPrice(product.startingPrice?.amount, product.startingPrice?.currency)}
              {product.variantOptions && (
                <span className="ml-2">
                  • {product.variantOptions.map(opt => `${opt.name}: ${opt.values.length}`).join(" • ")}
                </span>
              )}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-[#555] uppercase tracking-wider">Status</span>
            <span className="text-[11px] text-[#c4956a] bg-[#c4956a]/10 px-2 py-1 rounded border border-[#c4956a]/20 font-medium">
              {product.status || "Draft"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* SKU & Stock */}
            <SectionCard icon={Box} title="Variant Details" subtitle="SKU and inventory management" delay={2}>
              <div className="space-y-4">
                <FloatingInput
                  label="SKU (Stock Keeping Unit)"
                  name="sku"
                  value={sku}
                  onChange={(e) => { setSku(e.target.value); skuReg.onChange(e); }}
                  onBlur={skuReg.onBlur}
                  inputRef={skuReg.ref}
                  error={errors.sku?.message}
                  placeholder="e.g., PHONE-8GB-128GB"
                />
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => { setStock(e.target.value); stockReg.onChange(e); }}
                    onBlur={stockReg.onBlur}
                    inputRef={stockReg.ref}
                    error={errors.stock?.message}
                    placeholder="0"
                  />
                  <div className="flex items-end">
                    <ToggleSwitch
                      checked={isAvailable}
                      onChange={setIsAvailable}
                      label="Available for sale"
                      description="Toggle to hide from store"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Pricing */}
            <SectionCard icon={TrendingUp} title="Variant Pricing" subtitle="Set price for this specific variant" delay={3}>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-[3] w-full">
                  <FloatingInput
                    label="Amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
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
              {product?.startingPrice && (
                <p className="text-[12px] text-[#555] mt-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#c4956a]" />
                  Base product price: {formatPrice(product.startingPrice.amount, product.startingPrice.currency)}
                </p>
              )}
            </SectionCard>

            {/* Dynamic Attributes */}
            <SectionCard icon={Layers} title="Variant Attributes" subtitle="Select options for this variant" delay={4}>
              <DynamicAttributeSelector
                variantOptions={product?.variantOptions}
                attributes={attributes}
                onChange={setAttributes}
              />
              {attributesError && (
                <p className="text-[13px] text-[#f87171] mt-3 flex items-center gap-1.5 font-medium animate-fade-in">
                  <AlertCircle className="w-4 h-4" />{attributesError}
                </p>
              )}
              {Object.keys(attributes).length > 0 && !attributesError && (
                <div className="mt-4 p-3 rounded-lg bg-[#c4956a]/5 border border-[#c4956a]/10">
                  <p className="text-[12px] text-[#c4956a] font-medium flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" />
                    Variant key: {getVariantKey(attributes)}
                  </p>
                </div>
              )}
            </SectionCard>

            {/* Images */}
            <SectionCard icon={ImageIcon} title="Variant Images" subtitle="Upload photos for this variant" delay={5}>
              <ImageUploader images={images} onChange={setImages} maxImages={7} />
              {imagesError && (
                <p className="text-[13px] text-[#f87171] mt-3 flex items-center gap-1.5 font-medium animate-fade-in">
                  <AlertCircle className="w-4 h-4" />{imagesError}
                </p>
              )}
            </SectionCard>

            {/* Submit Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 fade-up fade-up-5">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={loading || isSubmitting}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#0a0a0a] bg-[#c4956a] rounded-xl hover:bg-[#d4a57a] hover:text-[#0a0a0a] active:scale-[0.985] transition-all duration-150 border-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#c4956a]/10"
              >
                {(loading || isSubmitting) && <Spinner data-icon="inline-start" />}
                <Save className="w-4 h-4 mr-2" />
                Save Variant
              </Button>
              <Button
                onClick={() => {
                  reset();
                  setSku("");
                  setAmount("");
                  setStock("");
                  setIsAvailable(true);
                  setAttributes({});
                  setImages([]);
                  setImagesError("");
                  setAttributesError("");
                  Toast.info("Form cleared");
                }}
                variant="outline"
                size="sm"
                className="flex-1 py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#888] bg-[#141414] border-2 border-[#1a1a1a] rounded-xl hover:bg-[#1a1a1a] hover:border-[#2a2a2a] hover:text-[#f0ede8] active:scale-[0.985] transition-all duration-150 shadow-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Form
              </Button>
            </div>

            {/* Done Button */}
            {createdVariants.length > 0 && (
              <div className="fade-up fade-up-6">
                <Button
                  onClick={() => navigate("/seller/dashboard/products")}
                  variant="outline"
                  size="sm"
                  className="w-full py-5 text-[12px] font-semibold tracking-[0.16em] uppercase text-[#c4956a] bg-[#c4956a]/5 border-2 border-[#c4956a]/30 rounded-xl hover:bg-[#c4956a]/10 hover:border-[#c4956a]/50 active:scale-[0.985] transition-all duration-150"
                >
                  Done — View All Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Created Variants Summary */}
              {createdVariants.length > 0 && (
                <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-2 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-4 h-4 text-[#c4956a]" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold">
                      Created Variants ({createdVariants.length})
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {createdVariants.map((variant, index) => (
                      <div
                        key={variant._id || index}
                        className="animate-slide-in p-3 rounded-lg bg-[#141414] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[12px] text-[#f0ede8] font-semibold font-mono">{variant.sku}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            variant.isAvailable
                              ? "bg-[#c4956a]/10 text-[#c4956a] border border-[#c4956a]/20"
                              : "bg-[#1a1a1a] text-[#555] border border-[#2a2a2a]"
                          }`}>
                            {variant.isAvailable ? "Active" : "Hidden"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555] mb-1.5">{getVariantKey(variant.attributes)}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-[#c4956a] font-medium">
                            {formatPrice(variant.price?.amount, variant.price?.currency)}
                          </span>
                          <span className="text-[11px] text-[#555]">
                            Stock: {variant.stock}
                          </span>
                        </div>
                        {variant.images?.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {variant.images.slice(0, 3).map((img, i) => (
                              <div key={i} className="w-8 h-8 rounded border border-[#1a1a1a] overflow-hidden">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {variant.images.length > 3 && (
                              <div className="w-8 h-8 rounded border border-[#1a1a1a] bg-[#1a1a1a] flex items-center justify-center text-[10px] text-[#555]">
                                +{variant.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Preview */}
              <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-3 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-[#c4956a]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold">Preview</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#0f0f0f]">
                  <div className="aspect-[4/3] bg-[#141414] flex items-center justify-center relative">
                    {images.length > 0 ? (
                      <img
                        src={URL.createObjectURL(images[0])}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : product?.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover opacity-50"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <ImageIcon className="w-12 h-12 text-[#333]" />
                        <span className="text-[13px] text-[#555] font-medium">No images yet</span>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] bg-[#0a0a0a]/80 backdrop-blur-sm text-[#c4956a] px-2 py-1 rounded border border-[#c4956a]/20 font-bold">
                          {images.length} image{images.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-['Playfair_Display'] text-[16px] text-[#f0ede8] font-semibold leading-tight mb-2 line-clamp-2">
                      {product.title}
                    </p>

                    {Object.keys(attributes).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {Object.entries(attributes).map(([key, val]) => (
                          <span key={key} className="text-[11px] text-[#c4956a] bg-[#1a1108] px-2 py-1 rounded-md capitalize font-medium border border-[#2a1f0a]">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                      <p className={`text-[18px] font-bold tracking-wide ${amount ? "text-[#c4956a]" : "text-[#555]"}`}>
                        {formatPrice(amount, currency)}
                      </p>
                      <div className="flex items-center gap-2">
                        {sku && (
                          <span className="text-[11px] text-[#555] font-mono">{sku}</span>
                        )}
                        <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-[#c4956a] pulse-glow" : "bg-[#555]"}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-[#555] text-center mt-4 leading-relaxed font-medium">
                  This is how your variant will appear in the store
                </p>
              </div>

              {/* Tips */}
              <div className="bg-[#141414] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-4 shadow-sm">
                <h3 className="font-['Playfair_Display'] text-[15px] text-[#f0ede8] mb-4 font-semibold">Variant tips</h3>
                <ul className="space-y-3">
                  {[
                    "Use descriptive SKUs with all attribute codes",
                    "Upload multiple angles for each variant",
                    "Set stock to 0 to mark as out of stock",
                    "Toggle availability to hide without deleting",
                    "Create all combinations from product options"
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
    </div>
  );
}