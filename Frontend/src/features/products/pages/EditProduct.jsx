import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Toast from "@/components/ui/Toast";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import useProduct from "../hooks/useProduct";
import FloatingInput from "../components/FloatingInput.jsx";
import FloatingTextArea from "../components/FloatingTextArea.jsx";
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
  Tag,
  Pencil,
  Loader2,
  ArrowRight,
  FolderOpen,
  ChevronDown,
  MoreVertical,
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

const CATEGORIES = [
  "men",
  "women",
  "shirts",
  "t-shirts",
  "jeans",
  "trousers",
  "blazers",
  "footwear",
  "accessories",
  "ethnic",
  "tops",
  "dresses",
  "outerwear",
  "bottoms",
];

const PRESET_COLORS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Navy", hex: "#1a2744" },
  { name: "Red", hex: "#c41e3a" },
  { name: "Green", hex: "#2d5a3d" },
  { name: "Beige", hex: "#d4c5a9" },
  { name: "Grey", hex: "#6b6b6b" },
  { name: "Brown", hex: "#5c3a21" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Pink", hex: "#db2777" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Orange", hex: "#f97316" },
  { name: "Purple", hex: "#9333ea" },
  { name: "Teal", hex: "#14b8a6" },
];

const PRESET_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "One Size",
];
const PRESET_RAM = ["4GB", "6GB", "8GB", "12GB", "16GB", "32GB", "64GB"];
const PRESET_STORAGE = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];

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

// --- Category Selector ---

const CategorySelector = ({ value, onChange, error }) => {
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
        Category
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 bg-[#0a0a0a] border rounded-lg text-[13px] text-left flex items-center justify-between transition-all ${
          error
            ? "border-[#f87171]/50"
            : "border-[#1a1a1a] hover:border-[#2a2a2a]"
        } ${value ? "text-[#f0ede8]" : "text-[#555]"}`}
      >
        <span className="capitalize">{value || "Select a category"}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#555] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-[#141414] border border-[#1a1a1a] rounded-lg shadow-xl max-h-[240px] overflow-y-auto animate-fade-in">
          <div className="p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-[13px] capitalize transition-colors ${
                  value === cat
                    ? "bg-[#c4956a]/10 text-[#c4956a] font-medium"
                    : "text-[#888] hover:bg-[#1a1a1a] hover:text-[#f0ede8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-[12px] text-[#f87171] mt-1.5 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// --- Tags Input ---

const TagsInput = ({ tags, onChange, maxTags = 10 }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim().toLowerCase();
    if (!tag) return;
    if (tags.includes(tag)) {
      Toast.error("Tag already added");
      return;
    }
    if (tags.length >= maxTags) {
      Toast.error(`Maximum ${maxTags} tags`);
      return;
    }
    onChange([...tags, tag]);
    setInput("");
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="Add tags (e.g., men, summer, sale)..."
          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-[13px] text-[#f0ede8] placeholder:text-[#555] focus:outline-none focus:border-[#c4956a]/40 focus:ring-1 focus:ring-[#c4956a]/10 transition-all"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2.5 bg-[#141414] border border-[#1a1a1a] rounded-lg text-[#888] hover:text-[#f0ede8] hover:border-[#c4956a] transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip key={tag} label={tag} onRemove={() => removeTag(tag)} small />
          ))}
        </div>
      )}

      <p className="text-[11px] text-[#555]">
        {tags.length}/{maxTags} tags
      </p>
    </div>
  );
};

// --- Dynamic Variant Options Builder (Edit Mode) ---

const VariantOptionsBuilder = ({ options, onChange }) => {
  const [newOptionName, setNewOptionName] = useState("");
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const [valueInput, setValueInput] = useState("");

  const addOption = () => {
    const name = newOptionName.trim();
    if (!name) {
      Toast.error("Enter an option name");
      return;
    }
    if (options.some((opt) => opt.name.toLowerCase() === name.toLowerCase())) {
      Toast.error("Option already exists");
      return;
    }

    const newOptions = [...options, { name, values: [] }];
    onChange(newOptions);
    setNewOptionName("");
    setActiveOptionIndex(newOptions.length - 1);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
    if (activeOptionIndex >= newOptions.length) {
      setActiveOptionIndex(Math.max(0, newOptions.length - 1));
    }
  };

  const addValue = (optionIndex) => {
    const value = valueInput.trim();
    if (!value) return;
    if (options[optionIndex].values.includes(value)) {
      Toast.error("Value already added");
      return;
    }

    const newOptions = options.map((opt, i) =>
      i === optionIndex ? { ...opt, values: [...opt.values, value] } : opt,
    );
    onChange(newOptions);
    setValueInput("");
  };

  const removeValue = (optionIndex, value) => {
    const newOptions = options.map((opt, i) =>
      i === optionIndex
        ? { ...opt, values: opt.values.filter((v) => v !== value) }
        : opt,
    );
    onChange(newOptions);
  };

  const getPresets = (optionName) => {
    const lower = optionName.toLowerCase();
    if (lower.includes("color") || lower.includes("colour"))
      return PRESET_COLORS.map((c) => c.name);
    if (lower.includes("size")) return PRESET_SIZES;
    if (lower.includes("ram") || lower.includes("memory")) return PRESET_RAM;
    if (
      lower.includes("storage") ||
      lower.includes("disk") ||
      lower.includes("ssd") ||
      lower.includes("hdd")
    )
      return PRESET_STORAGE;
    return [];
  };

  const togglePreset = (optionIndex, value) => {
    const opt = options[optionIndex];
    const isSelected = opt.values.includes(value);

    if (isSelected) {
      removeValue(optionIndex, value);
    } else {
      const newOptions = options.map((o, i) =>
        i === optionIndex ? { ...o, values: [...o.values, value] } : o,
      );
      onChange(newOptions);
    }
  };

  const totalCombinations = options.reduce(
    (acc, opt) => acc * (opt.values.length || 1),
    1,
  );
  const validOptions = options.filter((opt) => opt.values.length > 0);

  return (
    <div className="space-y-5">
      {/* Add New Option */}
      {options.length < 5 && (
        <div className="flex gap-2 animate-fade-in">
          <input
            type="text"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addOption())
            }
            placeholder="Add option type (e.g., RAM, Storage, Material...)"
            className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-[13px] text-[#f0ede8] placeholder:text-[#555] focus:outline-none focus:border-[#c4956a]/40 focus:ring-1 focus:ring-[#c4956a]/10 transition-all"
          />
          <button
            type="button"
            onClick={addOption}
            className="px-4 py-2.5 bg-[#c4956a] text-[#0a0a0a] rounded-lg text-[13px] font-semibold hover:bg-[#d4a57a] transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      )}

      {/* Option Tabs */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt, index) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => setActiveOptionIndex(index)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all duration-200 ${
                activeOptionIndex === index
                  ? "bg-[#c4956a] text-[#0a0a0a] border-[#c4956a] shadow-sm shadow-[#c4956a]/20"
                  : "bg-[#141414] text-[#888] border-[#1a1a1a] hover:border-[#555] hover:text-[#f0ede8]"
              }`}
            >
              <span>{opt.name}</span>
              {opt.values.length > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    activeOptionIndex === index
                      ? "bg-[#0a0a0a]/20 text-[#0a0a0a]"
                      : "bg-[#2a2a2a] text-[#888]"
                  }`}
                >
                  {opt.values.length}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(index);
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeOptionIndex === index ? "text-[#0a0a0a]/60 hover:text-[#0a0a0a]" : "text-[#555] hover:text-[#f87171]"}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Active Option Panel */}
      {options.length > 0 && activeOptionIndex < options.length && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[#888] font-medium">
              Values for{" "}
              <span className="text-[#c4956a]">
                {options[activeOptionIndex].name}
              </span>
            </p>
            <span className="text-[11px] text-[#555]">
              {options[activeOptionIndex].values.length} selected
            </span>
          </div>

          {/* Presets */}
          {getPresets(options[activeOptionIndex].name).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {getPresets(options[activeOptionIndex].name).map((preset) => {
                const isSelected =
                  options[activeOptionIndex].values.includes(preset);
                const isColor = options[activeOptionIndex].name
                  .toLowerCase()
                  .includes("color");

                if (isColor) {
                  const colorObj = PRESET_COLORS.find((c) => c.name === preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => togglePreset(activeOptionIndex, preset)}
                      className={`group relative w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-[#c4956a] scale-110 shadow-lg shadow-[#c4956a]/20"
                          : "border-[#2a2a2a] hover:border-[#555] hover:scale-105"
                      }`}
                      style={{ backgroundColor: colorObj?.hex || "#333" }}
                      title={preset}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className={`w-3.5 h-3.5 ${preset === "White" || preset === "Beige" ? "text-[#1a1a1a]" : "text-white"} drop-shadow-md`}
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => togglePreset(activeOptionIndex, preset)}
                    className={`px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-all duration-200 ${
                      isSelected
                        ? "bg-[#c4956a] text-[#0a0a0a] border-[#c4956a] shadow-sm shadow-[#c4956a]/20"
                        : "bg-[#141414] text-[#888] border-[#1a1a1a] hover:border-[#555] hover:text-[#f0ede8]"
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className="w-3 h-3 inline mr-1 -mt-0.5"
                        strokeWidth={3}
                      />
                    )}
                    {preset}
                  </button>
                );
              })}
            </div>
          )}

          {/* Custom Value Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), addValue(activeOptionIndex))
              }
              placeholder={`Add ${options[activeOptionIndex].name} value...`}
              className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-[13px] text-[#f0ede8] placeholder:text-[#555] focus:outline-none focus:border-[#c4956a]/40 focus:ring-1 focus:ring-[#c4956a]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => addValue(activeOptionIndex)}
              className="px-3 py-2.5 bg-[#141414] border border-[#1a1a1a] rounded-lg text-[#888] hover:text-[#f0ede8] hover:border-[#c4956a] transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Values */}
          {options[activeOptionIndex].values.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {options[activeOptionIndex].values.map((val) => (
                <Chip
                  key={val}
                  label={val}
                  onRemove={() => removeValue(activeOptionIndex, val)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {options.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-[#1a1a1a] rounded-xl">
          <Layers className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p className="text-[13px] text-[#555] font-medium">
            No variant options yet
          </p>
          <p className="text-[12px] text-[#444] mt-1">
            Add options like Color, Size, RAM, Storage...
          </p>
        </div>
      )}

      {/* Combination Preview */}
      {validOptions.length > 0 && (
        <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5 mt-4 animate-scale-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#c4956a]" />
            <p className="text-[12px] text-[#888] font-medium uppercase tracking-wider">
              Variant Matrix
            </p>
          </div>
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            {validOptions.map((opt, i) => (
              <React.Fragment key={opt.name}>
                <span className="text-[24px] font-['Playfair_Display'] text-[#c4956a] font-bold">
                  {opt.values.length}
                </span>
                <span className="text-[11px] text-[#555] font-medium uppercase">
                  {opt.name}
                </span>
                {i < validOptions.length - 1 && (
                  <span className="text-[#333] mx-1 text-[20px]">×</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-[#333] mx-1 text-[20px]">=</span>
            <span className="text-[28px] font-['Playfair_Display'] text-[#f0ede8] font-bold">
              {totalCombinations}
            </span>
            <span className="text-[11px] text-[#555] font-medium uppercase">
              variants
            </span>
          </div>
          <p className="text-[12px] text-[#555] mt-2 leading-relaxed">
            Existing variants will be preserved. New combinations will need to
            be created.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {validOptions.map((opt) => (
              <div
                key={opt.name}
                className="flex items-center gap-1.5 bg-[#1a1a1a] px-2.5 py-1.5 rounded-lg border border-[#2a2a2a]"
              >
                <span className="text-[10px] text-[#c4956a] uppercase font-bold">
                  {opt.name}
                </span>
                <span className="text-[10px] text-[#555]">
                  {opt.values.slice(0, 3).join(", ")}
                </span>
                {opt.values.length > 3 && (
                  <span className="text-[10px] text-[#555]">
                    +{opt.values.length - 3}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ThumbnailUploader = ({ thumbnail, onChange, previewUrl, existingUrl }) => {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) { Toast.error("Please upload an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { Toast.error("Image must be under 5MB"); return; }
    onChange(file);
  };

  const displayUrl = previewUrl || existingUrl;

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
        className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
          displayUrl
            ? "border-[#c4956a]/30 bg-[#c4956a]/5"
            : isDragOver
              ? "border-[#c4956a]/60 bg-[#c4956a]/10"
              : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#2a2a2a] hover:bg-[#0f0f0f]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        {displayUrl ? (
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={displayUrl}
                alt="Thumbnail"
                className="w-20 h-20 rounded-lg object-cover border border-[#1a1a1a]"
              />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c4956a] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-[#0a0a0a]" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#f0ede8] font-medium truncate">
                {thumbnail ? thumbnail.name : "Current thumbnail"}
              </p>
              <p className="text-[12px] text-[#555]">
                {thumbnail ? `${(thumbnail.size / 1024).toFixed(1)} KB • ${thumbnail.type.split('/')[1].toUpperCase()}` : "Click to replace"}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null); // This triggers handleThumbnailChange(null) in parent
              }}
              className="p-2 rounded-lg bg-[#1a1a1a] text-[#555] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center py-2">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 ${
              isDragOver ? "bg-[#c4956a]/20 border-[#c4956a]/40" : "bg-[#141414] border-[#1a1a1a]"
            }`}>
              <ImageIcon className={`w-5 h-5 transition-colors ${isDragOver ? "text-[#c4956a]" : "text-[#555]"}`} />
            </div>
            <div>
              <p className="text-[13px] text-[#888] font-medium">
                {isDragOver ? "Drop image here" : "Click or drag to upload new thumbnail"}
              </p>
              <p className="text-[11px] text-[#555] mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Variant Card (Bottom Section) ---

const VariantCard = ({ variant, product }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditVariant = () => {
    navigate(`/seller/dashboard/edit-product/${variant.product}/variants/${variant._id}`);
  };

  const handleAddVariant = () => {
    navigate(`/seller/dashboard/add-variant/${variant.product}/`, {
      state: { product }
    });
  };

  return (
    <div className="group bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-4 hover:border-[#c4956a]/30 hover:shadow-lg hover:shadow-[#c4956a]/5 transition-all relative">

      {/* Dropdown Menu - Top Right */}
      <div className="absolute top-3 right-3 z-20" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          className="p-2 bg-[#141414] border border-[#1a1a1a] rounded-lg text-[#555] hover:text-[#c4956a] hover:border-[#c4956a]/30 transition-all"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[#141414] border border-[#1a1a1a] rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                handleEditVariant();
              }}
              className="w-full text-left px-4 py-3 text-[13px] text-[#f0ede8] hover:bg-[#c4956a]/10 hover:text-[#c4956a] transition-colors flex items-center gap-2.5"
            >
              <Pencil className="w-4 h-4" />
              Edit Variant
            </button>
            <div className="h-px bg-[#1a1a1a]" />
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                handleAddVariant();
              }}
              className="w-full text-left px-4 py-3 text-[13px] text-[#f0ede8] hover:bg-[#c4956a]/10 hover:text-[#c4956a] transition-colors flex items-center gap-2.5"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-4 pr-8">
        {/* Variant Image */}
        <div className="w-16 h-16 rounded-lg bg-[#141414] flex-shrink-0 overflow-hidden border border-[#1a1a1a] group-hover:border-[#2a2a2a] transition-colors">
          {!imageError && variant.images && variant.images.length > 0 ? (
            <img
              src={variant.images[0].url}
              alt={variant.variantKey}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#333]">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-['Playfair_Display'] text-[15px] font-semibold text-[#f0ede8] truncate">
              {variant.variantKey}
            </h3>
            <span
              className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                variant.isAvailable
                  ? "bg-[#2d5a3d]/20 text-[#4ade80] border border-[#2d5a3d]/30"
                  : "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20"
              }`}
            >
              {variant.isAvailable ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-1 text-[12px] text-[#888]">
            <p className="flex items-center gap-2">
              <span className="text-[#555] font-medium">SKU:</span>
              <span className="font-mono text-[11px] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#2a2a2a] text-[#f0ede8]">
                {variant.sku}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#555] font-medium">Price:</span>
              <span className="text-[#c4956a] font-semibold">
                {variant.price.currency} {variant.price.amount.toLocaleString()}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#555] font-medium">Stock:</span>
              <span
                className={
                  variant.stock < 5
                    ? "text-[#f87171] font-semibold"
                    : "text-[#f0ede8]"
                }
              >
                {variant.stock} units
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [thumbnail, setThumbnail] = useState(null); // File object for new upload
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Object URL for new file
  const [existingThumbnail, setExistingThumbnail] = useState(""); // URL from API
  const [variantOptions, setVariantOptions] = useState([]);
  const [startingPrice, setStartingPrice] = useState({
    amount: "",
    currency: "INR",
  });
  const [existingThumbnailRemoved, setExistingThumbnailRemoved] =
    useState(false);

  // UI State
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productVariants, setProductVariants] = useState([]);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState("");
  const [variantError, setVariantError] = useState("");
  const [product, setProduct] = useState(null)

  const { handleGetProductDetails, handleEditProduct } = useProduct();
  const authLoading = useSelector((state) => state.auth.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
    defaultValues: { title: "", description: "" },
  });

  const titleReg = register("title", {
    required: "Product title is required",
    minLength: { value: 3, message: "Title must be at least 3 characters" },
    maxLength: { value: 120, message: "Title must be under 120 characters" },
  });

  const descReg = register("description", {
    required: "Product description is required",
    minLength: {
      value: 10,
      message: "Description must be at least 10 characters",
    },
    maxLength: {
      value: 2000,
      message: "Description must be under 2000 characters",
    },
  });

  // Fetch Product Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await handleGetProductDetails(productId);

        if (response.success) {
          const { product, variants } = response;

          // Pre-fill form
          setProduct(product);
          setTitle(product.title || "");
          setDescription(product.description || "");
          setCategory(product.category || "");
          setTags(product.tags || []);
          setStartingPrice(
            product.startingPrice || { amount: "", currency: "INR" },
          );
          setExistingThumbnail(product.thumbnail || "");

          // Set variant options (deep copy)
          setVariantOptions(
            (product.variantOptions || []).map((opt) => ({
              name: opt.name,
              values: [...opt.values],
            })),
          );

          // Store variants for bottom display
          setProductVariants(variants || []);

          // Reset react-hook-form with fetched values
          reset({
            title: product.title || "",
            description: product.description || "",
          });
        } else {
          setError(response.message || "Failed to load product details");
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        setError(
          "Error fetching product details or the product is under review. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchDetails();
  }, [productId, handleGetProductDetails, reset]);

  // Cleanup thumbnail preview URL
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (file) => {
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setExistingThumbnailRemoved(false); // New upload means we have a thumbnail
    } else {
      setThumbnail(null);
      setThumbnailPreview(null);
      setExistingThumbnailRemoved(true); // User clicked X to remove
    }
  };

  const onSubmit = async (data) => {
    let hasError = false;

    if (!category) {
      setCategoryError("Please select a category");
      hasError = true;
    } else {
      setCategoryError("");
    }

    if (
      variantOptions.length === 0 ||
      variantOptions.some((opt) => opt.values.length === 0)
    ) {
      setVariantError("Add at least one option type with values");
      hasError = true;
    } else {
      setVariantError("");
    }

    if (hasError) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Build formData matching your API structure
      // Note: In edit, any field can be skipped. We send all current values.
      const formData = new FormData();

      formData.append("title", data.title.trim());
      formData.append("description", data.description.trim());
      formData.append("category", category);

      // Only send tags if they exist
      if (tags.length > 0) {
        tags.forEach((tag) => {
          formData.append("tags[]", tag);
        });
      }

      // Send variantOptions in exact API format
      formData.append(
        "variantOptions",
        JSON.stringify(
          variantOptions
            .map((opt) => ({
              name: opt.name,
              values: opt.values.filter((v) => v.trim() !== ""),
            }))
            .filter((opt) => opt.name.trim() !== "" && opt.values.length > 0),
        ),
      );

      // Only append thumbnail if user selected a new file
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await handleEditProduct(formData, productId);

      if (response.success) {
        navigate(`/seller/dashboard/products`);
      } else {
        setError(response.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Edit product error:", err);
      setError("Error updating product. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount, currency) => {
    if (!amount) return "₹ —";
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };
    return `${symbols[currency] || "₹"}${Number(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-[#0a0a0a] min-h-screen">
        <FontLoader />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#c4956a] border-t-transparent animate-spin" />
            <p className="text-[14px] text-[#888] font-medium animate-pulse">
              Loading product details...
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
              onClick={() => navigate("/seller/dashboard/products")}
              className="w-9 h-9 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold block">
                Seller Studio
              </span>
              <h1 className="font-['Playfair_Display'] text-[22px] lg:text-[26px] text-[#f0ede8] leading-tight font-semibold">
                Edit Product
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
          <span className="text-[#f0ede8] font-semibold">Edit</span>
        </nav>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-[#f87171]/10 border border-[#f87171]/20 rounded-xl text-[#f87171] animate-fade-in">
            <p className="text-[14px] font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Info */}
            <SectionCard
              icon={Package}
              title="Basic Information"
              subtitle="Name and describe your product"
              delay={2}
            >
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
                  MAX_DESC={2000}
                />
              </div>
            </SectionCard>

            {/* Category & Tags */}
            <SectionCard
              icon={FolderOpen}
              title="Category & Tags"
              subtitle="Organize your product for discovery"
              delay={3}
            >
              <div className="space-y-5">
                <CategorySelector
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setCategoryError("");
                  }}
                  error={categoryError}
                />
                <div>
                  <label className="text-[13px] text-[#888] font-medium mb-2 block">
                    Tags
                  </label>
                  <TagsInput tags={tags} onChange={setTags} />
                </div>
              </div>
            </SectionCard>

            {/* Thumbnail */}
            <SectionCard
              icon={ImageIcon}
              title="Product Thumbnail"
              subtitle="Replace the main listing image"
              delay={4}
            >
              <ThumbnailUploader
                thumbnail={thumbnail}
                onChange={handleThumbnailChange}
                previewUrl={thumbnailPreview}
                existingUrl={
                  existingThumbnailRemoved ? null : existingThumbnail
                }
              />
            </SectionCard>

            {/* Dynamic Variant Options */}
            <SectionCard
              icon={Layers}
              title="Variant Options"
              subtitle="Define customizable attributes for this product"
              delay={5}
            >
              <VariantOptionsBuilder
                options={variantOptions}
                onChange={setVariantOptions}
              />
              {variantError && (
                <p className="text-[13px] text-[#f87171] mt-4 flex items-center gap-1.5 font-medium animate-fade-in">
                  <X className="w-4 h-4" />
                  {variantError}
                </p>
              )}
            </SectionCard>

            {/* Starting Price - DISABLED */}
            <SectionCard
              icon={TrendingUp}
              title="Starting Price"
              subtitle="Automatically set by your lowest variant price"
              delay={6}
            >
              <div className="relative">
                <FloatingInput
                  label="Starting Price"
                  name="startingPrice"
                  value={formatPrice(
                    startingPrice.amount,
                    startingPrice.currency,
                  )}
                  disabled={true}
                  className="opacity-60 cursor-not-allowed"
                />
                <div className="absolute right-3 top-[38px] flex items-center gap-1.5">
                  <span className="text-[11px] text-[#555] bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a] font-medium uppercase tracking-wider">
                    Locked
                  </span>
                </div>
                <p className="text-[12px] text-[#555] mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4956a]" />
                  This value is auto-calculated from your variants and cannot be
                  edited directly
                </p>
              </div>
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
                onClick={() => navigate("/seller/dashboard/products")}
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
              {/* Product Preview Card */}
              <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-2 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-[#c4956a]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold">
                    Live Preview
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#0f0f0f]">
                  <div className="aspect-[4/3] bg-[#141414] flex items-center justify-center relative">
                    {existingThumbnail || thumbnailPreview ? (
                      <img
                        src={thumbnailPreview || existingThumbnail}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-[#333]" />
                        </div>
                        <span className="text-[13px] text-[#555] font-medium">
                          No thumbnail
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] uppercase tracking-wider bg-[#0a0a0a]/80 backdrop-blur-sm text-[#c4956a] px-2 py-1 rounded border border-[#c4956a]/20 font-bold">
                        Editing
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p
                      className={`font-['Playfair_Display'] text-[16px] font-semibold leading-tight mb-2 line-clamp-2 ${title ? "text-[#f0ede8]" : "text-[#555]"}`}
                    >
                      {title || "Product Title"}
                    </p>
                    <p className="text-[13px] leading-relaxed mb-3 line-clamp-2 text-[#888]">
                      {description || "Your description will appear here"}
                    </p>

                    {category && (
                      <div className="mb-2">
                        <span className="text-[10px] text-[#c4956a] bg-[#1a1108] px-2 py-1 rounded-md capitalize font-medium border border-[#2a1f0a]">
                          {category}
                        </span>
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-[#888] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#2a2a2a] capitalize"
                          >
                            #{tag}
                          </span>
                        ))}
                        {tags.length > 4 && (
                          <span className="text-[10px] text-[#555]">
                            +{tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {variantOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {variantOptions.slice(0, 3).map((opt) => (
                          <span
                            key={opt.name}
                            className="text-[10px] text-[#c4956a] bg-[#1a1108] px-2 py-1 rounded-md capitalize font-medium border border-[#2a1f0a]"
                          >
                            {opt.name}: {opt.values.length}
                          </span>
                        ))}
                        {variantOptions.length > 3 && (
                          <span className="text-[10px] text-[#555]">
                            +{variantOptions.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                      <p
                        className={`text-[18px] font-bold tracking-wide ${startingPrice.amount ? "text-[#c4956a]" : "text-[#555]"}`}
                      >
                        {formatPrice(
                          startingPrice.amount,
                          startingPrice.currency,
                        )}
                      </p>
                      {startingPrice.amount && (
                        <span className="text-[11px] text-[#555] uppercase tracking-wider">
                          {startingPrice.currency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-[#555] text-center mt-4 leading-relaxed font-medium">
                  This is how your product will appear in the store
                </p>
              </div>

              {/* Tips Card */}
              <div className="bg-[#141414] rounded-xl border border-[#1a1a1a] p-5 fade-up fade-up-4 shadow-sm">
                <h3 className="font-['Playfair_Display'] text-[15px] text-[#f0ede8] mb-4 font-semibold">
                  Editing Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    "You can skip any field — only changed values will be updated",
                    "Variant options affect how customers filter your product",
                    "Starting price is locked and auto-updated by variant prices",
                    "Upload a new thumbnail only if you want to replace the current one",
                    "Existing variants remain unchanged unless you edit them below",
                    "Tags help customers discover your product in search",
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

        {/* --- Variants Section (Bottom) --- */}
        <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-['Playfair_Display'] text-[22px] text-[#f0ede8] font-semibold">
                Product Variants
              </h2>
              <p className="text-[13px] text-[#888] mt-1">
                Manage individual variant details — click any card to edit
                stock, price, or images
              </p>
            </div>
            <span className="px-3 py-1.5 bg-[#141414] text-[#c4956a] rounded-full text-[12px] font-bold border border-[#c4956a]/20">
              {productVariants.length} variants
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productVariants.map((variant) => (
              <VariantCard key={variant._id} variant={variant} product={product} />
            ))}
          </div>

          {productVariants.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a] rounded-xl">
              <Layers className="w-8 h-8 text-[#333] mx-auto mb-3" />
              <p className="text-[13px] text-[#555] font-medium">
                No variants found for this product
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}