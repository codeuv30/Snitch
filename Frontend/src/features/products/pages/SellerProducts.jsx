import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Image as ImageIcon,
  Package,
  ChevronDown,
  LayoutGrid,
  List,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Filter,
  Bell,
  X,
  AlertTriangle,
  Trash2,
  SearchX,
  Clock,
  SlidersHorizontal,
  RotateCw,
  ExternalLink,
  Copy,
  Settings,
  Tag,
} from "lucide-react";
import useProduct from "../hooks/useProduct";
import Footer from "../components/Footer";
import { useContextMenu } from "../context/ContextMenuContext";
import Toast from "@/components/ui/Toast";

const PageStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes masonry-in {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modal-in {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-shimmer {
      background: linear-gradient(90deg, #1a1a1a 0%, #252525 50%, #1a1a1a 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .card-enter { opacity: 0; animation: masonry-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .card-visible { opacity: 1; }
    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
    .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-up { animation: slide-up 0.4s ease-out; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .masonry-grid { column-count: 1; column-gap: 20px; }
    @media (min-width: 640px)  { .masonry-grid { column-count: 2; } }
    @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
    @media (min-width: 1280px) { .masonry-grid { column-count: 4; } }
    .masonry-grid > * { break-inside: avoid; page-break-inside: avoid; }
    .standard-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    @media (min-width: 768px)  { .standard-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1280px) { .standard-grid { grid-template-columns: repeat(3, 1fr); } }
  `}</style>
);

// ─── Delete Confirm Modal ─────────────────────────────────────────
const DeleteConfirmModal = ({ product, onConfirm, onCancel, isDeleting }) => {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleConfirm = () => {
    if (confirmText.trim() !== product.title) {
      setError("Product name does not match");
      return;
    }
    onConfirm();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCancel();
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-fast"
        onClick={onCancel}
      />
      <div className="relative bg-[#0f0f0f] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.4)] w-full max-w-[420px] overflow-hidden animate-modal-in border border-[#1a1a1a]">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#200f0f] border border-[#3a1a1a] flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-[#f87171]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['Playfair_Display'] text-[20px] text-[#f0ede8] leading-tight font-semibold">
                Delete Product
              </h3>
              <p className="text-[13px] text-[#888] mt-1.5 leading-relaxed">
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-semibold text-[#f0ede8]">
                  "{product.title}"
                </span>{" "}
                and remove all associated data.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-6 p-3 bg-[#141414] rounded-xl flex items-center gap-3 border border-[#1a1a1a]">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt=""
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#555]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#f0ede8] font-semibold truncate">
              {product.title}
            </p>
            <p className="text-[12px] text-[#888]">
              {product.price.currency}{" "}
              {parseInt(product.price.amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <label className="block text-[13px] text-[#888] mb-2 font-medium">
            To confirm, type{" "}
            <span className="font-bold text-[#f0ede8]">"{product.title}"</span>{" "}
            below:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Type "${product.title}" to confirm`}
            className={`w-full px-4 py-3 bg-[#0a0a0a] border-2 rounded-xl text-[14px] text-[#f0ede8]
                       placeholder:text-[#555] placeholder:text-[13px]
                       focus:outline-none focus:ring-2 focus:ring-[#f87171]/20 focus:border-[#f87171]
                       transition-all duration-200
                       ${error ? "border-[#f87171] bg-[#200f0f]" : "border-[#1a1a1a]"}`}
          />
          {error && (
            <p className="text-[13px] text-[#f87171] mt-2 flex items-center gap-1.5 animate-fade-in-fast font-medium">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        <div className="px-6 py-5 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 border-2 border-[#1a1a1a] text-[#f0ede8] text-[13px] font-semibold rounded-xl
                      transition-all duration-200 hover:bg-[#1a1a1a] hover:border-[#2a2a2a]
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting || confirmText.trim() !== product.title}
            className={`flex-1 py-2.5 text-white text-[13px] font-semibold rounded-xl
                       transition-all duration-200 flex items-center justify-center gap-2
                       ${
                         confirmText.trim() === product.title && !isDeleting
                           ? "bg-[#f87171] hover:bg-[#dc2626] shadow-lg shadow-[#f87171]/25"
                           : "bg-[#1a1a1a] text-[#555] cursor-not-allowed"
                       }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Product
              </>
            )}
          </button>
        </div>

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                    text-[#555] hover:text-[#f0ede8] hover:bg-[#1a1a1a] transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────
// animatedIds tracks which product IDs have already played their entry animation.
// It lives OUTSIDE the component so it persists across re-renders and filter changes.
const animatedIds = new Set();

const ProductCard = ({
  product,
  index,
  onEdit,
  onDelete,
  viewMode,
  onContextMenu,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  // Only play entry animation if this card hasn't been seen before this session
  const shouldAnimate = !animatedIds.has(product._id);

  useEffect(() => {
    if (shouldAnimate) {
      // Mark as animated after the animation duration so future renders skip it
      const t = setTimeout(
        () => {
          animatedIds.add(product._id);
        },
        500 + Math.min(index * 60, 600),
      );
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasImage = product.images && product.images.length > 0;
  const isGrid = viewMode === "grid";
  const isNew = product.isNew;
  const isBestseller = product.isBestseller || product.autoIsBestseller;

  const aspectRatio = useMemo(() => {
    const ratios = [1.2, 0.8, 1.5, 1.0, 1.3, 0.9, 1.4, 1.1];
    return ratios[index % ratios.length] || 1.2;
  }, [index]);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, product);
      }}
      className={`group bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden
                 transition-all duration-300 ease-out cursor-context-menu
                 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-[#2a2a2a] hover:translate-y-[-4px]
                 ${shouldAnimate ? "card-enter" : "card-visible"}
                 ${isGrid ? "flex flex-row" : "break-inside-avoid mb-5"}`}
      style={
        shouldAnimate
          ? {
              animationDelay: `${Math.min(index * 0.06, 0.6)}s`,
            }
          : {}
      }
    >
      {/* Image area */}
      <div
        className={`relative overflow-hidden bg-[#141414] flex-shrink-0
                   ${isGrid ? "w-[140px] sm:w-[180px] aspect-square" : ""}`}
        style={
          !isGrid
            ? { aspectRatio: `${1 / aspectRatio}`, minHeight: "180px" }
            : {}
        }
      >
        {hasImage ? (
          <>
            <img
              src={product.images[0].url}
              alt={product.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ease-out
                         group-hover:scale-[1.05] ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
                <ImageIcon className="w-8 h-8 text-[#333] animate-pulse" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#141414]">
            <ImageIcon className="w-10 h-10 text-[#333]" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       flex items-end justify-between p-4
                       ${isGrid ? "hidden sm:flex" : ""}`}
        >
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center
                        text-[#f0ede8] hover:bg-white/20 transition-all duration-150 hover:scale-110 border border-white/10"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center
                        text-[#f87171] hover:bg-white/20 transition-all duration-150 hover:scale-110 border border-white/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-white text-[11px] font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
            {product.price.currency}{" "}
            {parseInt(product.price.amount).toLocaleString()}
          </div>
        </div>

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isNew && (
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold bg-[#f0ede8] text-[#0a0a0a] shadow-md">
              New
            </span>
          )}
          {isBestseller && (
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-bold bg-[#c4956a] text-white shadow-md">
              Hot
            </span>
          )}
        </div>
      </div>

      {/* Text content */}
      <div
        className={`flex-1 flex flex-col ${isGrid ? "p-4 justify-between" : "px-4 pt-3.5 pb-3"}`}
      >
        <div>
          <h3 className="font-['Playfair_Display'] text-[15px] text-[#f0ede8] leading-snug line-clamp-2 font-semibold">
            {product.title}
          </h3>
          <p
            className={`mt-1.5 text-[13px] text-[#888] leading-[1.6] line-clamp-2 font-medium ${isGrid ? "hidden sm:block" : ""}`}
          >
            {product.description}
          </p>

          {product.tags?.length > 0 && (
            <div
              className={`flex flex-wrap gap-1.5 mt-2 ${isGrid ? "hidden sm:flex" : ""}`}
            >
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] tracking-[0.05em] text-[#c4956a] bg-[#1a1108] px-2 py-0.5 rounded-md capitalize font-semibold border border-[#2a1f0a]"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-[11px] text-[#555] font-semibold">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div
          className={`mt-3 pt-3 border-t border-[#1a1a1a]
                       ${isGrid ? "flex flex-col sm:flex-row sm:items-center justify-between gap-2" : "flex items-center gap-3"}`}
        >
          {!isGrid && (
            <>
              <div className="flex items-center gap-1.5 text-[12px] text-[#555] font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>{product.views ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#555] font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{product.sales ?? 0} sales</span>
              </div>
            </>
          )}
          <div
            className={`text-[14px] text-[#c4956a] font-bold ${isGrid ? "sm:ml-auto" : "ml-auto"}`}
          >
            {product.price.currency}{" "}
            {parseInt(product.price.amount).toLocaleString()}
          </div>
        </div>

        {isGrid && (
          <div className="flex gap-2 mt-3 sm:hidden">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 py-2 border border-[#1a1a1a] text-[#f0ede8] text-[11px] uppercase tracking-[0.1em]
                        rounded-lg transition-all duration-150 hover:bg-[#f0ede8] hover:text-[#0a0a0a] hover:border-[#f0ede8]
                        font-semibold flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="flex-1 py-2 border border-[#1a1a1a] text-[#888] text-[11px] uppercase tracking-[0.1em]
                        rounded-lg transition-all duration-150 hover:bg-[#f87171] hover:text-white hover:border-[#f87171]
                        font-semibold flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {!isGrid && (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2.5 border border-[#1a1a1a] text-[#f0ede8] text-[11px] uppercase tracking-[0.1em]
                      rounded-lg transition-all duration-150 hover:bg-[#f0ede8] hover:text-[#0a0a0a] hover:border-[#f0ede8]
                      font-semibold flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 py-2.5 border border-[#1a1a1a] text-[#888] text-[11px] uppercase tracking-[0.1em]
                      rounded-lg transition-all duration-150 hover:bg-[#f87171] hover:text-white hover:border-[#f87171]
                      font-semibold flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Skeletons ────────────────────────────────────────────────────
const SkeletonMasonryCard = ({ index }) => (
  <div
    className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden mb-5 break-inside-avoid card-enter"
    style={{ animationDelay: `${Math.min(index * 0.06, 1.0)}s` }}
  >
    <div
      className="bg-[#141414] relative overflow-hidden"
      style={{ height: `${200 + (index % 3) * 60}px` }}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-[#1a1a1a] rounded w-3/4 animate-shimmer" />
      <div className="h-3 bg-[#1a1a1a] rounded w-1/2 animate-shimmer" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-[#1a1a1a] rounded-lg flex-1 animate-shimmer" />
        <div className="h-9 bg-[#1a1a1a] rounded-lg flex-1 animate-shimmer" />
      </div>
    </div>
  </div>
);

const SkeletonGridCard = ({ index }) => (
  <div
    className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-row card-enter"
    style={{ animationDelay: `${Math.min(index * 0.06, 1.0)}s` }}
  >
    <div className="w-[140px] sm:w-[180px] aspect-square bg-[#141414] relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 animate-shimmer" />
    </div>
    <div className="flex-1 p-4 space-y-3 flex flex-col justify-center">
      <div className="h-4 bg-[#1a1a1a] rounded w-3/4 animate-shimmer" />
      <div className="h-3 bg-[#1a1a1a] rounded w-1/2 animate-shimmer" />
      <div className="h-3 bg-[#1a1a1a] rounded w-1/3 animate-shimmer" />
    </div>
  </div>
);

// ─── Search with Recent ───────────────────────────────────────────
const SearchWithRecent = ({
  value,
  onChange,
  onKeyDown,
  recentSearches,
  onRecentClick,
  onClearRecent,
  onRemoveRecent,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setShowRecent(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full sm:w-[320px]">
      <div
        className={`relative group transition-all duration-200 ${isFocused ? "scale-[1.02]" : ""}`}
      >
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] group-focus-within:text-[#f0ede8] transition-colors duration-200">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setShowRecent(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full bg-[#0f0f0f] border-2 border-[#1a1a1a] rounded-xl pl-10 pr-10 py-2.5 text-[13px] text-[#f0ede8]
                     placeholder:text-[#555] placeholder:text-[13px] placeholder:font-medium
                     focus:outline-none focus:ring-2 focus:ring-[#c4956a]/10 focus:border-[#c4956a]
                     hover:border-[#2a2a2a] transition-all duration-200"
        />
        {value ? (
          <button
            onClick={() => onChange({ target: { value: "" } })}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1a1a1a]
                       flex items-center justify-center text-[#555] hover:bg-[#f87171] hover:text-white transition-all duration-150"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#555]" />
          </div>
        )}
      </div>

      {showRecent && recentSearches.length > 0 && !value && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border-2 border-[#1a1a1a] rounded-xl
                       shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-40 overflow-hidden animate-fade-in-fast"
        >
          <div className="px-4 py-2.5 border-b-2 border-[#1a1a1a] flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.1em] text-[#555] font-bold">
              Recent Searches
            </span>
            <button
              onClick={onClearRecent}
              className="text-[12px] text-[#f87171] hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>
          {recentSearches.map((term, i) => (
            <div
              key={i}
              className="group/item flex items-center hover:bg-[#141414] transition-colors"
            >
              <button
                onClick={() => {
                  onRecentClick(term);
                  setShowRecent(false);
                }}
                className="flex-1 text-left px-4 py-2.5 text-[13px] text-[#888] hover:text-[#f0ede8] transition-colors flex items-center gap-3 font-medium"
              >
                <Clock className="w-3.5 h-3.5 text-[#555]" />
                {term}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveRecent(term);
                }}
                className="px-3 py-2.5 text-[#555] hover:text-[#f87171] transition-colors opacity-0 group-hover/item:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SELLER PRODUCTS PAGE
// ═══════════════════════════════════════════════════════════════════
const SellerProducts = () => {
  const navigate = useNavigate();
  const { handleGetSellerProducts, handleDeleteProduct } = useProduct();
  const { openContextMenu, registerShortcuts } = useContextMenu();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("snitch_view_mode") || "masonry";
    } catch {
      return "masonry";
    }
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("snitch_recent_searches") || "[]");
    } catch {
      return [];
    }
  });

  const hasFetched = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("snitch_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    registerShortcuts([
      { key: "r", callback: refreshProducts },
      {
        key: "n",
        callback: () => navigate("/seller/dashboard/create-product"),
      },
      {
        key: "v",
        callback: () =>
          setViewMode((prev) => (prev === "masonry" ? "grid" : "masonry")),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerShortcuts, navigate]);

  const addRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((t) => t !== term)].slice(0, 5);
      localStorage.setItem("snitch_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem("snitch_recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("snitch_recent_searches");
  }, []);

  useEffect(() => {
    if (hasFetched.current || isFetchingRef.current) return;
    const loadProducts = async () => {
      isFetchingRef.current = true;
      setIsFetching(true);
      setLoading(true);
      setError(null);
      try {
        const data = await handleGetSellerProducts();
        if (data && Array.isArray(data)) {
          setProducts(data);
          hasFetched.current = true;
        } else {
          setError(data?.message || "Failed to load products");
          hasFetched.current = true;
        }
      } catch (err) {
        setError(err?.message || "Something went wrong. Please try again.");
        hasFetched.current = true;
      } finally {
        setLoading(false);
        setIsFetching(false);
        isFetchingRef.current = false;
      }
    };
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProducts = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsFetching(true);
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await handleGetSellerProducts();
      if (data && Array.isArray(data)) setProducts(data);
      else setError(data?.message || "Failed to load products");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsRefreshing(false);
      setIsFetching(false);
      isFetchingRef.current = false;
    }
  }, [handleGetSellerProducts]);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);
  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && e.target.value.trim())
        addRecentSearch(e.target.value.trim());
    },
    [addRecentSearch],
  );

  const handleContextMenu = useCallback(
    (e, product = null) => {
      e.preventDefault();
      e.stopPropagation();
      const baseItems = [
        {
          label: "Refresh Products",
          icon: RotateCw,
          shortcut: "R",
          onClick: refreshProducts,
        },
        {
          label: "Add New Product",
          icon: Plus,
          shortcut: "N",
          onClick: () => navigate("/seller/dashboard/create-product"),
        },
        {
          label: "Toggle View",
          icon: viewMode === "masonry" ? List : LayoutGrid,
          shortcut: "V",
          onClick: () =>
            setViewMode((v) => (v === "masonry" ? "grid" : "masonry")),
        },
      ];
      if (product) {
        openContextMenu(e.clientX, e.clientY, [
          ...baseItems,
          { divider: true },
          {
            label: "Edit Product",
            icon: Settings,
            shortcut: "E",
            onClick: () =>
              navigate(`/seller/dashboard/edit-product/${product._id}`, {
                state: { product },
              }),
          },
          {
            label: "Copy Product ID",
            icon: Copy,
            shortcut: "C",
            onClick: () => {
              navigator.clipboard.writeText(product._id);
              Toast.success("Copied Product ID");
            },
          },
          {
            label: "View in Store",
            icon: ExternalLink,
            onClick: () => window.open(`/product/${product._id}`, "_blank"),
          },
          { divider: true },
          {
            label: "Delete Product",
            icon: Trash2,
            danger: true,
            onClick: () => setDeleteModal({ product }),
          },
        ]);
      } else {
        openContextMenu(e.clientX, e.clientY, baseItems);
      }
    },
    [openContextMenu, navigate, refreshProducts, viewMode],
  );

  const stats = useMemo(() => {
    const total = products.length;
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalValue = products.reduce(
      (sum, p) => sum + parseFloat(p.price?.amount || 0),
      0,
    );
    return { total, totalViews, totalSales, totalValue };
  }, [products]);

  const displayed = useMemo(() => {
    return products
      .filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "newest")
          return (
            new Date(b.publishedAt || b.createdAt || 0) -
            new Date(a.publishedAt || a.createdAt || 0)
          );
        if (sort === "oldest")
          return (
            new Date(a.publishedAt || a.createdAt || 0) -
            new Date(b.publishedAt || b.createdAt || 0)
          );
        if (sort === "price-asc")
          return (
            parseFloat(a.price?.amount || 0) - parseFloat(b.price?.amount || 0)
          );
        if (sort === "price-desc")
          return (
            parseFloat(b.price?.amount || 0) - parseFloat(a.price?.amount || 0)
          );
        if (sort === "az") return (a.title || "").localeCompare(b.title || "");
        if (sort === "sales") return (b.sales || 0) - (a.sales || 0);
        if (sort === "views") return (b.views || 0) - (a.views || 0);
        return 0;
      });
  }, [products, search, sort]);

  const handleEdit = useCallback(
    (product) => {
      navigate(`/seller/dashboard/edit-product/${product._id}`, {
        state: { product },
      });
    },
    [navigate],
  );

  const handleDeleteClick = useCallback(
    (product) => setDeleteModal({ product }),
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteModal?.product?._id) return;
    setIsDeleting(true);
    try {
      const result = await handleDeleteProduct(deleteModal.product._id);
      if (result?.success) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== deleteModal.product._id),
        );
        setDeleteModal(null);
      } else {
        setError(result?.message || "Failed to delete product");
      }
    } catch (err) {
      setError(err?.message || "Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal, handleDeleteProduct]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "sales", label: "Most Sales" },
    { value: "views", label: "Most Views" },
    { value: "az", label: "A → Z" },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label;

  return (
    <div
      onContextMenu={(e) => handleContextMenu(e, null)}
      className="flex flex-col flex-1 bg-[#0a0a0a]"
    >
      <PageStyles />

      {deleteModal && (
        <DeleteConfirmModal
          product={deleteModal.product}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/store")}
              className="text-[13px] text-[#888] hover:text-[#f0ede8] transition-colors flex items-center gap-1.5
                       bg-[#0f0f0f] hover:bg-[#141414] px-3 py-1.5 rounded-lg border border-[#1a1a1a] font-medium"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>
            <div className="h-6 w-px bg-[#1a1a1a] hidden sm:block" />
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#c4956a] font-bold block">
                Seller Studio
              </span>
              <h1 className="font-['Playfair_Display'] text-[24px] lg:text-[28px] text-[#f0ede8] leading-tight hidden sm:block font-semibold">
                Your Products
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshProducts}
              disabled={isFetching}
              className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center
                       text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 hidden lg:flex
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center
                             text-[#555] hover:text-[#f0ede8] hover:border-[#2a2a2a] transition-all duration-200 hidden lg:flex"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/seller/dashboard/create-product")}
              className="bg-[#c4956a] text-[#0a0a0a] text-[11px] uppercase tracking-[0.12em] px-5 py-2.5
                        rounded-lg transition-all duration-200 hover:bg-[#d4a57a] hover:shadow-lg
                        flex items-center gap-2 font-bold shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {[
            {
              label: "Total Products",
              value: stats.total,
              icon: Package,
              color: "bg-[#c4956a] text-[#0a0a0a]",
              trend: "all items",
            },
            {
              label: "Total Views",
              value: stats.totalViews,
              icon: Eye,
              color: "bg-[#0f0f0f] border border-[#1a1a1a]",
              trend: "all time",
            },
            {
              label: "Total Sales",
              value: stats.totalSales,
              icon: TrendingUp,
              color: "bg-[#0f0f0f] border border-[#1a1a1a]",
              trend: "units sold",
            },
            {
              label: "Inventory Value",
              value: `₹${(stats.totalValue / 100000).toFixed(1)}L`,
              icon: DollarSign,
              color: "bg-[#0f0f0f] border border-[#1a1a1a]",
              trend: "total",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            const isAccent = stat.color.includes("bg-[#c4956a]");
            return (
              <div
                key={stat.label}
                className={`${stat.color} rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] shadow-sm`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${isAccent ? "bg-[#0a0a0a]/20" : "bg-[#141414] border border-[#1a1a1a]"}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isAccent ? "text-[#0a0a0a]" : "text-[#c4956a]"}`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${isAccent ? "text-[#0a0a0a]/60" : "text-[#555]"}`}
                  >
                    {stat.trend}
                  </span>
                </div>
                <div
                  className={`font-['Playfair_Display'] text-[28px] leading-none mb-1 font-bold ${isAccent ? "text-[#0a0a0a]" : "text-[#f0ede8]"}`}
                >
                  {typeof stat.value === "number"
                    ? String(stat.value).padStart(2, "0")
                    : stat.value}
                </div>
                <div
                  className={`text-[12px] uppercase tracking-[0.1em] font-semibold ${isAccent ? "text-[#0a0a0a]/50" : "text-[#555]"}`}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <SearchWithRecent
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              recentSearches={recentSearches}
              onRecentClick={setSearch}
              onClearRecent={clearRecentSearches}
              onRemoveRecent={removeRecentSearch}
            />
            <div className="flex items-center bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-md transition-all duration-200 flex items-center gap-1.5 text-[11px] font-bold
                           ${viewMode === "masonry" ? "bg-[#c4956a] text-[#0a0a0a] shadow-sm" : "text-[#555] hover:text-[#f0ede8]"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Masonry</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 flex items-center gap-1.5 text-[11px] font-bold
                           ${viewMode === "grid" ? "bg-[#c4956a] text-[#0a0a0a] shadow-sm" : "text-[#555] hover:text-[#f0ede8]"}`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 lg:flex-none">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full lg:w-auto flex items-center justify-between gap-2 bg-[#0f0f0f] border border-[#1a1a1a]
                        rounded-lg px-4 py-2.5 text-[13px] text-[#f0ede8] hover:border-[#2a2a2a]
                        transition-all duration-200 min-w-[180px] shadow-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#555]" />
                {currentSortLabel}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#555] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setSortOpen(false)}
                />
                <div
                  className="absolute top-full right-0 mt-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl
                              shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-40 overflow-hidden animate-fade-in-fast min-w-[200px]"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[13px] transition-colors flex items-center gap-3 font-medium
                                ${sort === option.value ? "bg-[#1a1108] text-[#c4956a] font-bold" : "text-[#888] hover:bg-[#141414]"}`}
                    >
                      {sort === option.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c4956a]" />
                      )}
                      <span
                        className={sort === option.value ? "ml-0" : "ml-3.5"}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results bar */}
        <div
          className="flex items-center justify-between mb-4 animate-slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#555] font-semibold">
              {displayed.length}{" "}
              {displayed.length === 1 ? "product" : "products"}
            </span>
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-[#c4956a] text-[#0a0a0a] text-[12px] px-2.5 py-1 rounded-md font-bold">
                <Search className="w-3 h-3" />"{search}"
                <button
                  onClick={() => setSearch("")}
                  className="ml-1 hover:text-[#f87171] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={refreshProducts}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-[13px] text-[#555] hover:text-[#f0ede8] transition-colors
                     bg-[#0f0f0f] border border-[#1a1a1a] px-3 py-1.5 rounded-lg hover:border-[#2a2a2a]
                     disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Product Display */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {loading ? (
            <div
              className={
                viewMode === "masonry" ? "masonry-grid" : "standard-grid"
              }
            >
              {[...Array(6)].map((_, i) =>
                viewMode === "masonry" ? (
                  <SkeletonMasonryCard key={i} index={i} />
                ) : (
                  <SkeletonGridCard key={i} index={i} />
                ),
              )}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in-fast">
              <div className="w-16 h-16 rounded-full bg-[#200f0f] flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-[#f87171]" />
              </div>
              <h3 className="font-['Playfair_Display'] text-[20px] text-[#f0ede8] mb-2 font-semibold">
                Unable to load products
              </h3>
              <p className="text-[14px] text-[#f87171] mb-6 font-medium">
                {error}
              </p>
              <button
                onClick={refreshProducts}
                className="px-6 py-2.5 bg-[#c4956a] text-[#0a0a0a] text-[13px] uppercase tracking-wider rounded-lg hover:bg-[#d4a57a] font-bold"
              >
                Retry Loading
              </button>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in-fast">
              <div className="w-20 h-20 rounded-full bg-[#141414] flex items-center justify-center mb-6">
                {search ? (
                  <SearchX className="w-10 h-10 text-[#333]" />
                ) : (
                  <Package className="w-10 h-10 text-[#333]" />
                )}
              </div>
              <h3 className="font-['Playfair_Display'] text-[24px] text-[#f0ede8] mb-3 font-semibold">
                {search ? "No matches found" : "No products yet"}
              </h3>
              <p className="text-[15px] text-[#888] mb-8 text-center max-w-[360px] leading-relaxed font-medium">
                {search
                  ? `No products match "${search}". Try a different search term or clear filters.`
                  : "Your store is empty. Start building your catalog by adding your first product."}
              </p>
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="bg-[#c4956a] text-[#0a0a0a] text-[13px] uppercase tracking-[0.12em] px-8 py-3.5
                            rounded-xl hover:bg-[#d4a57a] hover:shadow-lg flex items-center gap-2 font-bold shadow-md"
                >
                  <X className="w-4 h-4" />
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={() => navigate("/seller/dashboard/create-product")}
                  className="bg-[#c4956a] text-[#0a0a0a] text-[13px] uppercase tracking-[0.12em] px-8 py-3.5
                            rounded-xl hover:bg-[#d4a57a] hover:shadow-lg flex items-center gap-2 font-bold shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            // ✅ Single grid div — no unmount on viewMode change
            <div
              className={
                viewMode === "masonry" ? "masonry-grid" : "standard-grid"
              }
            >
              {displayed.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  viewMode={viewMode}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerProducts;
