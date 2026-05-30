import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Search, Image as ImageIcon, ArrowLeft, Package, ChevronDown,
  LayoutGrid, List, TrendingUp, DollarSign, Eye, Plus, Filter,
  Bell, X, AlertTriangle, Trash2, SearchX, Clock, SlidersHorizontal,
  RotateCw, ExternalLink, Copy, Settings,
} from "lucide-react";
import useProduct from "../hooks/useProduct";
import Footer from "../components/Footer";

// ─── Animations ───────────────────────────────────────────────────
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
    @keyframes context-in {
      from { opacity: 0; transform: scale(0.96); }
      to   { opacity: 1; transform: scale(1); }
    }
    .animate-shimmer { animation: shimmer 1.5s infinite; }
    .animate-masonry-in { animation: masonry-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
    .animate-modal-in { animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-up { animation: slide-up 0.4s ease-out; }
    .animate-context-in { animation: context-in 0.15s cubic-bezier(0.16, 1, 0.3, 1); }
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

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const handleConfirm = () => {
    if (confirmText.trim() !== product.title) { setError("Product name does not match"); return; }
    onConfirm();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCancel();
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in-fast" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] w-full max-w-[420px] overflow-hidden animate-modal-in">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fff5f5] border border-[#ffd1d1] flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-[#d14343]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['Playfair_Display'] text-[20px] text-[#1a1a1a] leading-tight">Delete Product</h3>
              <p className="text-[13px] text-[#888880] mt-1 leading-relaxed">
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-medium text-[#1a1a1a]">"{product.title}"</span> and remove all associated data.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-6 p-3 bg-[#f5f0ea] rounded-xl flex items-center gap-3 border border-[#e8e6e0]">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#e8e6e0] flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#b5b2a8]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#1a1a1a] font-medium truncate">{product.title}</p>
            <p className="text-[11px] text-[#888880]">
              {product.price.currency} {parseInt(product.price.amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <label className="block text-[12px] text-[#888880] mb-2">
            To confirm, type <span className="font-semibold text-[#1a1a1a]">"{product.title}"</span> below:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={confirmText}
            onChange={(e) => { setConfirmText(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder={`Type "${product.title}" to confirm`}
            className={`w-full px-4 py-3 bg-white border rounded-xl text-[14px] text-[#1a1a1a]
                       placeholder:text-[#b5b2a8] placeholder:text-[12px]
                       focus:outline-none focus:ring-2 focus:ring-[#d14343]/20 focus:border-[#d14343]
                       transition-all duration-200
                       ${error ? "border-[#d14343] bg-[#fff5f5]" : "border-[#e8e6e0]"}`}
          />
          {error && (
            <p className="text-[12px] text-[#d14343] mt-2 flex items-center gap-1.5 animate-fade-in-fast">
              <AlertTriangle className="w-3.5 h-3.5" />{error}
            </p>
          )}
        </div>

        <div className="px-6 py-5 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 border border-[#e8e6e0] text-[#1a1a1a] text-[13px] font-medium rounded-xl
                      transition-all duration-200 hover:bg-[#f5f0ea] hover:border-[#d6d1c8]
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting || confirmText.trim() !== product.title}
            className={`flex-1 py-2.5 text-white text-[13px] font-medium rounded-xl
                       transition-all duration-200 flex items-center justify-center gap-2
                       ${confirmText.trim() === product.title && !isDeleting
                         ? "bg-[#d14343] hover:bg-[#b93636] shadow-lg shadow-[#d14343]/25"
                         : "bg-[#e8e6e0] text-[#b5b2a8] cursor-not-allowed"}`}
          >
            {isDeleting ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</>
            ) : (
              <><Trash2 className="w-4 h-4" />Delete Product</>
            )}
          </button>
        </div>

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                    text-[#b5b2a8] hover:text-[#1a1a1a] hover:bg-[#f5f0ea] transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Context Menu ─────────────────────────────────────────────────
const ContextMenu = ({ x, y, onClose, items }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  return (
    <div
      ref={menuRef}
      className="fixed z-[90] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#e8e6e0]
                 overflow-hidden animate-context-in min-w-[200px]"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="py-1.5">
        {items.map((item) => (
          <React.Fragment key={item.label}>
            {item.divider && <div className="my-1.5 border-t border-[#f0ede8]" />}
            <button
              onClick={() => { item.onClick(); onClose(); }}
              disabled={item.disabled}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-[13px] transition-colors
                         ${item.danger ? "text-[#d14343] hover:bg-[#fff5f5]"
                           : item.disabled ? "text-[#b5b2a8] cursor-not-allowed"
                           : "text-[#1a1a1a] hover:bg-[#f5f0ea]"}`}
            >
              {item.icon && <item.icon className={`w-4 h-4 ${item.danger ? "text-[#d14343]" : "text-[#888880]"}`} />}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="text-[10px] text-[#b5b2a8] bg-[#f5f0ea] px-1.5 py-0.5 rounded">{item.shortcut}</span>
              )}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────
const ProductCard = ({ product, index, onEdit, onDelete, viewMode, onContextMenu }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = product.images && product.images.length > 0;
  const isGrid = viewMode === "grid";

  const aspectRatio = useMemo(() => {
    if (product.images?.[0]?.height && product.images?.[0]?.width)
      return product.images[0].height / product.images[0].width;
    const ratios = [1.2, 0.8, 1.5, 1.0, 1.3, 0.9, 1.4, 1.1];
    return ratios[index % ratios.length] || 1.2;
  }, [product.images, index]);

  return (
    <div
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, product); }}
      className={`group bg-white border border-[#e8e6e0] rounded-xl overflow-hidden
                 transition-all duration-300 ease-out cursor-context-menu
                 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-[#d6d1c8] hover:translate-y-[-4px]
                 opacity-0 animate-masonry-in
                 ${isGrid ? "flex flex-row" : "break-inside-avoid mb-5"}`}
      style={{ animationDelay: `${Math.min(index * 0.06, 1.0)}s`, animationFillMode: "forwards" }}
    >
      <div
        className={`relative overflow-hidden bg-[#f0ede8] flex-shrink-0
                   ${isGrid ? "w-[140px] sm:w-[180px] aspect-square" : ""}`}
        style={!isGrid ? { aspectRatio: `${1 / aspectRatio}`, minHeight: "180px" } : {}}
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
              <div className="absolute inset-0 flex items-center justify-center bg-[#f0ede8]">
                <ImageIcon className="w-8 h-8 text-[#d6d1c8] animate-pulse" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#f0ede8]">
            <ImageIcon className="w-10 h-10 text-[#d6d1c8]" />
          </div>
        )}

        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300
                       flex items-end justify-between p-4
                       ${isGrid ? "hidden sm:flex" : ""}`}>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center
                        text-[#1a1a1a] hover:bg-white transition-all duration-150 hover:scale-110"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(product); }}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center
                        text-[#d14343] hover:bg-white transition-all duration-150 hover:scale-110"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-white text-[11px] font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
            {product.price.currency} {parseInt(product.price.amount).toLocaleString()}
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-medium
                           ${product.isDraft
                             ? "bg-[#f5f0ea] text-[#8B6F5A] border border-[#e8e6e0]"
                             : "bg-[#1a1a1a] text-white"}`}>
            {product.isDraft ? "Draft" : "Live"}
          </span>
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${isGrid ? "p-4 justify-between" : "px-4 pt-3.5 pb-3"}`}>
        <div>
          <h3 className="font-['Playfair_Display'] text-[15px] text-[#1a1a1a] leading-snug line-clamp-2">
            {product.title}
          </h3>
          <p className={`mt-2 text-[12px] text-[#888880] leading-[1.6] line-clamp-2 ${isGrid ? "hidden sm:block" : ""}`}>
            {product.description}
          </p>
        </div>

        <div className={`mt-3 pt-3 border-t border-[#f0ede8]
                       ${isGrid ? "flex flex-col sm:flex-row sm:items-center justify-between gap-2" : "flex items-center gap-3"}`}>
          {!isGrid && (
            <>
              <div className="flex items-center gap-1 text-[11px] text-[#b5b2a8]">
                <Eye className="w-3.5 h-3.5" />
                <span>{Math.floor(Math.random() * 500) + 50}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#b5b2a8]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{Math.floor(Math.random() * 20) + 1} sales</span>
              </div>
            </>
          )}
          <div className={`text-[13px] text-[#c4956a] font-semibold ${isGrid ? "sm:ml-auto" : "ml-auto"}`}>
            {product.price.currency} {parseInt(product.price.amount).toLocaleString()}
          </div>
        </div>

        {isGrid && (
          <div className="flex gap-2 mt-3 sm:hidden">
            <button onClick={() => onEdit(product)}
              className="flex-1 py-2 border border-[#e8e6e0] text-[#1a1a1a] text-[11px] uppercase tracking-[0.1em]
                        rounded-lg transition-all duration-150 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]
                        font-medium flex items-center justify-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />Edit
            </button>
            <button onClick={() => onDelete(product)}
              className="flex-1 py-2 border border-[#e8e6e0] text-[#888880] text-[11px] uppercase tracking-[0.1em]
                        rounded-lg transition-all duration-150 hover:bg-[#d14343] hover:text-white hover:border-[#d14343]
                        font-medium flex items-center justify-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />Delete
            </button>
          </div>
        )}
      </div>

      {!isGrid && (
        <div className="px-4 pb-4 flex gap-2">
          <button onClick={() => onEdit(product)}
            className="flex-1 py-2.5 border border-[#e8e6e0] text-[#1a1a1a] text-[11px] uppercase tracking-[0.1em]
                      rounded-lg transition-all duration-150 hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]
                      font-medium flex items-center justify-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />Edit
          </button>
          <button onClick={() => onDelete(product)}
            className="flex-1 py-2.5 border border-[#e8e6e0] text-[#888880] text-[11px] uppercase tracking-[0.1em]
                      rounded-lg transition-all duration-150 hover:bg-[#d14343] hover:text-white hover:border-[#d14343]
                      font-medium flex items-center justify-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Skeletons ────────────────────────────────────────────────────
const shimmerStyle = { background: "linear-gradient(90deg, #e8e4de 0%, #f5f0ea 50%, #e8e4de 100%)", backgroundSize: "200% 100%" };

const SkeletonMasonryCard = ({ index }) => (
  <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden mb-5 break-inside-avoid opacity-0 animate-masonry-in"
    style={{ animationDelay: `${Math.min(index * 0.06, 1.0)}s`, animationFillMode: "forwards" }}>
    <div className="bg-[#e8e4de] relative overflow-hidden" style={{ height: `${200 + (index % 3) * 60}px` }}>
      <div className="absolute inset-0 animate-shimmer" style={shimmerStyle} />
    </div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-[#e8e4de] rounded w-3/4 animate-shimmer" style={shimmerStyle} />
      <div className="h-3 bg-[#e8e4de] rounded w-1/2 animate-shimmer" style={shimmerStyle} />
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-[#e8e4de] rounded-lg flex-1 animate-shimmer" style={shimmerStyle} />
        <div className="h-9 bg-[#e8e4de] rounded-lg flex-1 animate-shimmer" style={shimmerStyle} />
      </div>
    </div>
  </div>
);

const SkeletonGridCard = ({ index }) => (
  <div className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden flex flex-row opacity-0 animate-masonry-in"
    style={{ animationDelay: `${Math.min(index * 0.06, 1.0)}s`, animationFillMode: "forwards" }}>
    <div className="w-[140px] sm:w-[180px] aspect-square bg-[#e8e4de] relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0 animate-shimmer" style={shimmerStyle} />
    </div>
    <div className="flex-1 p-4 space-y-3 flex flex-col justify-center">
      <div className="h-4 bg-[#e8e4de] rounded w-3/4 animate-shimmer" style={shimmerStyle} />
      <div className="h-3 bg-[#e8e4de] rounded w-1/2 animate-shimmer" style={shimmerStyle} />
      <div className="h-3 bg-[#e8e4de] rounded w-1/3 animate-shimmer" style={shimmerStyle} />
    </div>
  </div>
);

// ─── Search with Recent ───────────────────────────────────────────
const SearchWithRecent = ({ value, onChange, onKeyDown, recentSearches, onRecentClick, onClearRecent, onRemoveRecent }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setShowRecent(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full sm:w-[320px]">
      <div className={`relative group transition-all duration-200 ${isFocused ? "scale-[1.02]" : ""}`}>
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b5b2a8] group-focus-within:text-[#1a1a1a] transition-colors duration-200">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => { setIsFocused(true); setShowRecent(true); }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full bg-white border border-[#e8e6e0] rounded-xl pl-10 pr-10 py-2.5 text-[13px] text-[#1a1a1a]
                     placeholder:text-[#b5b2a8] placeholder:text-[12px]
                     focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5 focus:border-[#1a1a1a]
                     hover:border-[#d6d1c8] transition-all duration-200"
        />
        {value ? (
          <button onClick={() => onChange({ target: { value: "" } })}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#e8e6e0]
                       flex items-center justify-center text-[#888880] hover:bg-[#1a1a1a] hover:text-white transition-all duration-150">
            <X className="w-3 h-3" />
          </button>
        ) : (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#b5b2a8]" />
          </div>
        )}
      </div>

      {showRecent && recentSearches.length > 0 && !value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e8e6e0] rounded-xl
                       shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-40 overflow-hidden animate-fade-in-fast">
          <div className="px-4 py-2.5 border-b border-[#f0ede8] flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#b5b2a8] font-medium">Recent Searches</span>
            <button onClick={onClearRecent} className="text-[11px] text-[#d14343] hover:underline">Clear All</button>
          </div>
          {recentSearches.map((term, i) => (
            <div key={i} className="group/item flex items-center hover:bg-[#f5f0ea] transition-colors">
              <button onClick={() => { onRecentClick(term); setShowRecent(false); }}
                className="flex-1 text-left px-4 py-2.5 text-[13px] text-[#888880] hover:text-[#1a1a1a] transition-colors flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-[#b5b2a8]" />{term}
              </button>
              <button onClick={(e) => { e.stopPropagation(); onRemoveRecent(term); }}
                className="px-3 py-2.5 text-[#b5b2a8] hover:text-[#d14343] transition-colors opacity-0 group-hover/item:opacity-100">
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem("snitch_view_mode") || "masonry"; } catch { return "masonry"; }
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem("snitch_recent_searches") || "[]"); } catch { return []; }
  });
  const [contextMenu, setContextMenu] = useState(null);

  const hasFetched = useRef(false);
  const isFetching = useRef(false);

  useEffect(() => { localStorage.setItem("snitch_view_mode", viewMode); }, [viewMode]);

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
    if (hasFetched.current || isFetching.current) return;
    const loadProducts = async () => {
      isFetching.current = true;
      setLoading(true);
      setError(null);
      try {
        const data = await handleGetSellerProducts();
        if (data && Array.isArray(data)) { setProducts(data); hasFetched.current = true; }
        else { setError(data?.message || "Failed to load products"); hasFetched.current = true; }
      } catch (err) {
        setError(err?.message || "Something went wrong. Please try again.");
        hasFetched.current = true;
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProducts = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await handleGetSellerProducts();
      if (data && Array.isArray(data)) setProducts(data);
      else setError(data?.message || "Failed to load products");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [handleGetSellerProducts]);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === "Enter" && e.target.value.trim()) addRecentSearch(e.target.value.trim());
  }, [addRecentSearch]);

  const handleContextMenu = useCallback((e, product = null) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, product });
  }, []);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const getContextMenuItems = useCallback(() => {
    const baseItems = [
      { label: "Refresh Products", icon: RotateCw, onClick: refreshProducts, shortcut: "R" },
      { label: "Add New Product",  icon: Plus,     onClick: () => navigate("/seller/dashboard/create-product"), shortcut: "N" },
      { label: "Toggle View Mode", icon: viewMode === "masonry" ? List : LayoutGrid,
        onClick: () => setViewMode(viewMode === "masonry" ? "grid" : "masonry"), shortcut: "V" },
    ];
    if (contextMenu?.product) {
      const p = contextMenu.product;
      return [
        ...baseItems,
        { divider: true },
        { label: "Edit Product",    icon: Settings,     onClick: () => navigate(`/seller/dashboard/edit-product/${p._id}`, { state: { product: p } }), shortcut: "E" },
        { label: "Copy Product ID", icon: Copy,         onClick: () => navigator.clipboard.writeText(p._id), shortcut: "C" },
        { label: "View in Store",   icon: ExternalLink, onClick: () => window.open(`/product/${p._id}`, "_blank") },
        { divider: true },
        { label: "Delete Product",  icon: Trash2, danger: true, onClick: () => setDeleteModal({ product: p }), shortcut: "Del" },
      ];
    }
    return baseItems;
  }, [contextMenu, viewMode, refreshProducts, navigate]);

  const stats = useMemo(() => {
    const total = products.length;
    const published = products.filter((p) => !p.isDraft).length || total;
    const drafts = products.filter((p) => p.isDraft).length || 0;
    const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price?.amount || 0), 0);
    return { total, published, drafts, totalValue };
  }, [products]);

  const displayed = useMemo(() => {
    return products
      .filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sort === "newest")     return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sort === "oldest")     return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sort === "price-asc")  return parseFloat(a.price?.amount || 0) - parseFloat(b.price?.amount || 0);
        if (sort === "price-desc") return parseFloat(b.price?.amount || 0) - parseFloat(a.price?.amount || 0);
        if (sort === "az")         return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
  }, [products, search, sort]);

  const handleEdit = useCallback((product) => {
    navigate(`/seller/dashboard/edit-product/${product._id}`, { state: { product } });
  }, [navigate]);

  const handleDeleteClick = useCallback((product) => setDeleteModal({ product }), []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteModal?.product?._id) return;
    setIsDeleting(true);
    try {
      const result = await handleDeleteProduct(deleteModal.product._id);
      if (result?.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteModal.product._id));
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
    { value: "newest",     label: "Newest First" },
    { value: "oldest",     label: "Oldest First" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "price-asc",  label: "Price: Low to High" },
    { value: "az",         label: "A → Z" },
  ];
  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label;

  return (
    // ↓ Keep onContextMenu here for right-click on empty space. NO Sidebar/MobileHeader/ml wrapper.
    <div onContextMenu={handleContextMenu} className="flex flex-col flex-1">
      <PageStyles />

      {/* Portals — rendered at body level via fixed positioning */}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={closeContextMenu} items={getContextMenuItems()} />
      )}
      {deleteModal && (
        <DeleteConfirmModal
          product={deleteModal.product}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#F5EFE6]/90 backdrop-blur-md border-b border-[#e8e6e0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/store")}
              className="text-[12px] text-[#888880] hover:text-[#1a1a1a] transition-colors flex items-center gap-1.5
                       bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg border border-[#e8e6e0]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>
            <div className="h-6 w-px bg-[#e8e6e0] hidden sm:block" />
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F5A] font-medium block">Seller Studio</span>
              <h1 className="font-['Playfair_Display'] text-[24px] lg:text-[28px] text-[#1a1a1a] leading-tight hidden sm:block">
                Your Products
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={refreshProducts} disabled={isFetching.current}
              className="w-10 h-10 rounded-full bg-white border border-[#e8e6e0] flex items-center justify-center
                       text-[#888880] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-200 hidden lg:flex
                       disabled:opacity-50 disabled:cursor-not-allowed">
              <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-[#e8e6e0] flex items-center justify-center
                             text-[#888880] hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-200 hidden lg:flex">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/seller/dashboard/create-product")}
              className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-[0.12em] px-5 py-2.5
                        rounded-lg transition-all duration-200 hover:bg-[#333] hover:shadow-lg
                        flex items-center gap-2 font-medium"
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
            { label: "Total Products", value: stats.total,     icon: Package,    color: "bg-[#1a1a1a] text-white",          trend: "all items"  },
            { label: "Published",      value: stats.published, icon: Eye,        color: "bg-white border border-[#e8e6e0]", trend: "live now"   },
            { label: "Drafts",         value: stats.drafts,    icon: LayoutGrid, color: "bg-white border border-[#e8e6e0]", trend: "pending"    },
            { label: "Total Value",    value: `₹${(stats.totalValue / 100000).toFixed(1)}L`, icon: DollarSign, color: "bg-white border border-[#e8e6e0]", trend: "inventory" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`${stat.color} rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color.includes("bg-[#1a1a1a]") ? "bg-white/20" : "bg-[#f5f0ea]"}`}>
                    <Icon className={`w-5 h-5 ${stat.color.includes("bg-[#1a1a1a]") ? "text-white" : "text-[#8B6F5A]"}`} />
                  </div>
                  <span className={`text-[10px] ${stat.color.includes("bg-[#1a1a1a]") ? "text-white/60" : "text-[#b5b2a8]"}`}>{stat.trend}</span>
                </div>
                <div className={`font-['Playfair_Display'] text-[28px] leading-none mb-1 ${stat.color.includes("bg-[#1a1a1a]") ? "text-white" : "text-[#1a1a1a]"}`}>
                  {typeof stat.value === "number" ? String(stat.value).padStart(2, "0") : stat.value}
                </div>
                <div className={`text-[11px] uppercase tracking-[0.1em] ${stat.color.includes("bg-[#1a1a1a]") ? "text-white/50" : "text-[#b5b2a8]"}`}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
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
            <div className="flex items-center bg-white border border-[#e8e6e0] rounded-lg p-1 shadow-sm">
              <button onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-md transition-all duration-200 flex items-center gap-1.5 text-[11px] font-medium
                           ${viewMode === "masonry" ? "bg-[#1a1a1a] text-white shadow-sm" : "text-[#888880] hover:text-[#1a1a1a]"}`}>
                <LayoutGrid className="w-3.5 h-3.5" /><span className="hidden sm:inline">Masonry</span>
              </button>
              <button onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 flex items-center gap-1.5 text-[11px] font-medium
                           ${viewMode === "grid" ? "bg-[#1a1a1a] text-white shadow-sm" : "text-[#888880] hover:text-[#1a1a1a]"}`}>
                <List className="w-3.5 h-3.5" /><span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 lg:flex-none">
            <button onClick={() => setSortOpen(!sortOpen)}
              className="w-full lg:w-auto flex items-center justify-between gap-2 bg-white border border-[#e8e6e0]
                        rounded-lg px-4 py-2.5 text-[13px] text-[#1a1a1a] hover:border-[#1a1a1a]
                        transition-all duration-200 min-w-[180px] shadow-sm">
              <span className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#888880]" />{currentSortLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#888880] transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                <div className="absolute top-full right-0 mt-2 bg-white border border-[#e8e6e0] rounded-xl
                              shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-40 overflow-hidden animate-fade-in-fast min-w-[200px]">
                  {sortOptions.map((option) => (
                    <button key={option.value} onClick={() => { setSort(option.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-[13px] transition-colors flex items-center gap-3
                                ${sort === option.value ? "bg-[#f5f0ea] text-[#1a1a1a] font-medium" : "text-[#888880] hover:bg-[#f5f0ea]"}`}>
                      {sort === option.value && <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />}
                      <span className={sort === option.value ? "ml-0" : "ml-3.5"}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-4 animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#b5b2a8]">
              {displayed.length} {displayed.length === 1 ? "product" : "products"}
            </span>
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white text-[11px] px-2.5 py-1 rounded-md">
                <Search className="w-3 h-3" />"{search}"
                <button onClick={() => setSearch("")} className="ml-1 hover:text-[#d14343] transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <button onClick={refreshProducts} disabled={isFetching.current}
            className="flex items-center gap-1.5 text-[12px] text-[#888880] hover:text-[#1a1a1a] transition-colors
                     bg-white border border-[#e8e6e0] px-3 py-1.5 rounded-lg hover:border-[#1a1a1a]
                     disabled:opacity-50 disabled:cursor-not-allowed">
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
          </button>
        </div>

        {/* Product Display */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {loading ? (
            viewMode === "masonry" ? (
              <div className="masonry-grid">
                {[...Array(6)].map((_, i) => <SkeletonMasonryCard key={i} index={i} />)}
              </div>
            ) : (
              <div className="standard-grid">
                {[...Array(6)].map((_, i) => <SkeletonGridCard key={i} index={i} />)}
              </div>
            )
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in-fast">
              <div className="w-16 h-16 rounded-full bg-[#fff5f5] flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-[#d14343]" />
              </div>
              <h3 className="font-['Playfair_Display'] text-[20px] text-[#1a1a1a] mb-2">Unable to load products</h3>
              <p className="text-[13px] text-[#d14343] mb-6">{error}</p>
              <button onClick={refreshProducts}
                className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[12px] uppercase tracking-wider rounded-lg hover:bg-[#333] font-medium">
                Retry Loading
              </button>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in-fast">
              <div className="w-20 h-20 rounded-full bg-[#f5f0ea] flex items-center justify-center mb-6">
                {search ? <SearchX className="w-10 h-10 text-[#d6d1c8]" /> : <Package className="w-10 h-10 text-[#d6d1c8]" />}
              </div>
              <h3 className="font-['Playfair_Display'] text-[24px] text-[#1a1a1a] mb-3">
                {search ? "No matches found" : "No products yet"}
              </h3>
              <p className="text-[14px] text-[#888880] mb-8 text-center max-w-[360px] leading-relaxed">
                {search
                  ? `No products match "${search}". Try a different search term or clear filters.`
                  : "Your store is empty. Start building your catalog by adding your first product."}
              </p>
              {search ? (
                <button onClick={() => setSearch("")}
                  className="bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[0.12em] px-8 py-3.5
                            rounded-xl hover:bg-[#333] hover:shadow-lg flex items-center gap-2 font-medium">
                  <X className="w-4 h-4" />Clear Search
                </button>
              ) : (
                <button onClick={() => navigate("/seller/dashboard/create-product")}
                  className="bg-[#1a1a1a] text-white text-[12px] uppercase tracking-[0.12em] px-8 py-3.5
                            rounded-xl hover:bg-[#333] hover:shadow-lg flex items-center gap-2 font-medium">
                  <Plus className="w-4 h-4" />Add Your First Product
                </button>
              )}
            </div>
          ) : viewMode === "masonry" ? (
            <div className="masonry-grid">
              {displayed.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index}
                  onEdit={handleEdit} onDelete={handleDeleteClick}
                  viewMode={viewMode} onContextMenu={handleContextMenu} />
              ))}
            </div>
          ) : (
            <div className="standard-grid">
              {displayed.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index}
                  onEdit={handleEdit} onDelete={handleDeleteClick}
                  viewMode={viewMode} onContextMenu={handleContextMenu} />
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