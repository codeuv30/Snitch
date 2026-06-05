// ProductDetails.jsx
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router";
import useProduct from "../hooks/useProduct";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  Star,
  Tag,
  Eye,
  X,
  Search,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  Minus,
  Plus,
  Copy,
  Check,
  Link2,
  Layers,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Package,
  ImageIcon,
} from "lucide-react";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { useCartUI } from "../../cart/context/CartContext";
import { CartButton, CartSidebar } from "../../cart/components/Cart";
import { useWishlistUI } from "../../wishlist/context/WishlistContext";
import {
  WishlistButton,
  WishlistSidebar,
} from "../../wishlist/components/Wishlist";

const PageStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-fade-in {
      animation: fade-in 0.4s ease-out forwards;
    }
    .animate-scale-in {
      animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slide-up {
      animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .carousel-slide {
      position: absolute;
      inset: 0;
      transition: opacity 0.3s ease;
    }
    .carousel-slide.active { opacity: 1; z-index: 10; }
    .carousel-slide.inactive { opacity: 0; z-index: 1; }
    .magnifier-container { position: relative; overflow: hidden; cursor: none; }
    .magnifier-lens {
      position: absolute;
      border: 2px solid #d4a76a;
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.2);
      display: none;
      z-index: 50;
      background-repeat: no-repeat;
    }
    .magnifier-container:hover .magnifier-lens { display: block; }
    .zoom-control-panel {
      position: absolute;
      top: 80px;
      right: 20px;
      z-index: 40;
      background: rgba(26, 26, 26, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
  `}</style>
);

const InstagramIcon = ({ size = 40, round = true }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={round ? "rounded-full" : "rounded-lg"}
  >
    <rect width="64" height="64" rx={round ? "32" : "8"} fill="#E4405F" />
    <path
      d="M32 16c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16zm0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm13.5-6.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5z"
      fill="white"
    />
  </svg>
);

const SharePopup = ({
  isOpen,
  onClose,
  productUrl,
  productTitle,
  productImage,
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareTitle = `Check out ${productTitle} on Snitch!`;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md animate-slide-up sm:animate-scale-in">
        <div className="bg-[#0a0a0a] sm:rounded-2xl rounded-t-2xl border border-[#1a1a1a] sm:border-[#222222] overflow-hidden">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#1a1a1a]">
            <h3 className="text-[#f0f0f0] font-semibold text-base sm:text-lg">
              Share Product
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#777777] hover:text-[#f0f0f0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3 sm:p-4 border-b border-[#1a1a1a]">
            <label className="text-xs text-[#777777] uppercase tracking-wider font-medium mb-2 sm:mb-3 block">
              Page Link
            </label>
            <div className="flex items-center gap-2 bg-[#111111] border border-[#1a1a1a] rounded-xl p-2 sm:p-3">
              <Link2 className="w-4 h-4 text-[#555555] flex-shrink-0" />
              <input
                type="text"
                value={productUrl}
                readOnly
                className="flex-1 bg-transparent text-[#aaaaaa] text-xs sm:text-sm outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a1a] text-[#f0f0f0] hover:bg-[#222222] border border-[#222222]"}`}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <label className="text-xs text-[#777777] uppercase tracking-wider font-medium mb-3 sm:mb-4 block">
              Share on Social
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              <WhatsappShareButton
                url={productUrl}
                title={shareTitle}
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <WhatsappIcon
                  size={48}
                  round
                  className="sm:w-10 sm:h-10 w-8 h-8"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  WhatsApp
                </span>
              </WhatsappShareButton>
              <FacebookShareButton
                url={productUrl}
                quote={shareTitle}
                hashtag="#Snitch"
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <FacebookIcon
                  size={48}
                  round
                  className="sm:w-10 sm:h-10 w-8 h-8"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  Facebook
                </span>
              </FacebookShareButton>
              <TwitterShareButton
                url={productUrl}
                title={shareTitle}
                hashtags={["Snitch", "Fashion", "Shopping"]}
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <TwitterIcon
                  size={48}
                  round
                  className="sm:w-10 sm:h-10 w-8 h-8"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  X
                </span>
              </TwitterShareButton>
              <LinkedinShareButton
                url={productUrl}
                title={shareTitle}
                summary={shareTitle}
                source="Snitch"
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <LinkedinIcon
                  size={48}
                  round
                  className="sm:w-10 sm:h-10 w-8 h-8"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  LinkedIn
                </span>
              </LinkedinShareButton>
              <button
                onClick={() =>
                  window.open("https://www.instagram.com/", "_blank")
                }
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <InstagramIcon size={40} round />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  Instagram
                </span>
              </button>
            </div>
          </div>
          {typeof navigator !== "undefined" && navigator.share && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
              <button
                onClick={() => {
                  navigator
                    .share({
                      title: productTitle,
                      text: shareTitle,
                      url: productUrl,
                    })
                    .catch(() => {});
                }}
                className="w-full py-3 bg-[#d4a76a] text-[#0a0a0a] rounded-xl font-semibold text-sm hover:bg-[#c4956a] transition-colors"
              >
                Share via Device
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageLightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  goToSlide,
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const magnifierSize = 150;
  const minZoom = 1.5,
    maxZoom = 5,
    zoomStep = 0.5;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) setZoomLevel(2.5);
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setZoomLevel(2.5);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Prevents browser zoom
        e.stopPropagation(); // Stops bubbling

        if (e.deltaY < 0) {
          setZoomLevel((prev) => Math.min(prev + zoomStep, maxZoom));
        } else {
          setZoomLevel((prev) => Math.max(prev - zoomStep, minZoom));
        }
      }
    };

    // Must use native addEventListener with passive: false
    container.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [isOpen]);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imgX = e.clientX - imgRect.left;
    const imgY = e.clientY - imgRect.top;
    setMagnifierPosition({
      x: x - magnifierSize / 2,
      y: y - magnifierSize / 2,
      bgX: (imgX / imgRect.width) * 100,
      bgY: (imgY / imgRect.height) * 100,
    });
  };

  if (!isOpen || !images.length) return null;
  const imageUrl = images[currentIndex]?.url || images[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in bg-black/95">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-2 sm:p-2.5 lg:p-3">
        <span className="text-[#aaaaaa] text-xs sm:text-sm font-medium bg-[#1a1a1a]/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#333333]">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[#777777] text-[10px] sm:text-xs bg-[#1a1a1a]/60 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-[#333333] hidden sm:flex items-center gap-1">
            <Search className="w-3 h-3" />
            Hover to magnify · Ctrl+Scroll to zoom
          </span>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-[#1a1a1a]/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-[#333333] text-[#f0f0f0] hover:bg-[#ff5555]/20 hover:border-[#ff5555]/50 hover:text-[#ff5555] transition-all"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
      <div className="zoom-control-panel">
        <button
          onClick={() => setZoomLevel((p) => Math.min(p + zoomStep, maxZoom))}
          disabled={zoomLevel >= maxZoom}
          className={`p-1 sm:p-1.5 rounded-lg transition-all ${zoomLevel < maxZoom ? "text-[#d4a76a] hover:bg-[#333333]" : "text-[#555555] cursor-not-allowed"}`}
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span className="text-[#f0f0f0] text-xs sm:text-sm font-bold min-w-[2rem] sm:min-w-[2.5rem] text-center">
          {zoomLevel.toFixed(1)}x
        </span>
        <button
          onClick={() => setZoomLevel((p) => Math.max(p - zoomStep, minZoom))}
          disabled={zoomLevel <= minZoom}
          className={`p-1 sm:p-1.5 rounded-lg transition-all ${zoomLevel > minZoom ? "text-[#d4a76a] hover:bg-[#333333]" : "text-[#555555] cursor-not-allowed"}`}
        >
          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div className="h-full w-full flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 lg:p-3 bg-[#1a1a1a]/60 backdrop-blur-sm rounded-full border border-[#333333] text-[#f0f0f0] hover:bg-[#222222] hover:border-[#d4a76a]/30 transition-all z-20"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div
          ref={containerRef}
          className="relative magnifier-container max-w-[90vw] sm:max-w-[80vw] max-h-[70vh] sm:max-h-[75vh] w-auto h-auto"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={`Preview ${currentIndex + 1}`}
            className="max-w-full max-h-[70vh] sm:max-h-[75vh] w-auto h-auto object-contain rounded-lg animate-scale-in select-none"
            draggable={false}
          />
          {showMagnifier && (
            <div
              className="magnifier-lens"
              style={{
                width: `${magnifierSize}px`,
                height: `${magnifierSize}px`,
                left: `${magnifierPosition.x}px`,
                top: `${magnifierPosition.y}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundPosition: `${magnifierPosition.bgX}% ${magnifierPosition.bgY}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 lg:p-3 bg-[#1a1a1a]/60 backdrop-blur-sm rounded-full border border-[#333333] text-[#f0f0f0] hover:bg-[#222222] hover:border-[#d4a76a]/30 transition-all z-20"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-30 p-2 sm:p-2.5 lg:p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide max-w-full">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              className={`flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex ? "border-[#d4a76a] scale-105" : "border-[#333333] hover:border-[#555555] opacity-60 hover:opacity-100"}`}
            >
              <img
                src={img?.url || img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// All Variants List Component
const VariantsList = ({
  variants,
  selectedVariant,
  onSelectVariant,
  formatPrice,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-[#c4956a]" />
        <span className="text-xs text-[#888] font-medium uppercase tracking-wider">
          All Variants ({variants.length})
        </span>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-hide pr-1">
        {variants.map((variant) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isAvailable = variant.isAvailable && variant.stock > 0;
          const attributeEntries = Object.entries(variant.attributes || {});

          return (
            <button
              key={variant._id}
              onClick={() => onSelectVariant(variant)}
              className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? "bg-[#c4956a]/10 border-[#c4956a]/40 shadow-sm shadow-[#c4956a]/10"
                  : "bg-[#111] border-[#1a1a1a] hover:border-[#333] hover:bg-[#141414]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-[#1a1a1a] flex-shrink-0 bg-[#0a0a0a]">
                  {variant.images?.[0]?.url ? (
                    <img
                      src={variant.images[0].url}
                      alt={variant.variantKey}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-[#333]" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#c4956a]/20 flex items-center justify-center">
                      <Check
                        className="w-4 h-4 text-[#c4956a]"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] sm:text-xs font-medium text-[#f0f0f0] truncate">
                      {variant.variantKey}
                    </span>
                    <span className="text-[12px] sm:text-sm font-bold text-[#d4a76a] flex-shrink-0">
                      {formatPrice(
                        variant.price?.amount,
                        variant.price?.currency,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isAvailable
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20"
                      }`}
                    >
                      {isAvailable
                        ? `${variant.stock} in stock`
                        : "Out of stock"}
                    </span>
                    <span className="text-[10px] text-[#555] font-mono">
                      SKU: {variant.sku}
                    </span>
                  </div>

                  {attributeEntries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {attributeEntries.map(([key, value]) => (
                        <span
                          key={key}
                          className="text-[10px] text-[#777] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#222]"
                        >
                          {key}: <span className="text-[#aaa]">{value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const VariantSelector = ({
  variantOptions,
  variants,
  selectedAttributes,
  onAttributeChange,
}) => {
  if (!variantOptions || variantOptions.length === 0) return null;

  const findMatchingVariant = (attrs) => {
    return variants.find((v) => {
      return Object.entries(attrs).every(
        ([key, val]) => v.attributes[key] === val,
      );
    });
  };

  const matchedVariant = findMatchingVariant(selectedAttributes);

  return (
    <div className="space-y-4">
      {variantOptions.map((option) => {
        const selectedValue = selectedAttributes[option.name];
        return (
          <div key={option.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#888] font-medium capitalize flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#c4956a]" />
                {option.name}
              </label>
              {selectedValue && (
                <span className="text-[11px] text-[#c4956a] bg-[#c4956a]/10 px-2 py-0.5 rounded border border-[#c4956a]/20 font-medium">
                  Selected: {selectedValue}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedValue === value;
                const testAttrs = {
                  ...selectedAttributes,
                  [option.name]: value,
                };
                const testVariant = findMatchingVariant(testAttrs);
                const isAvailable =
                  !!testVariant &&
                  testVariant.isAvailable &&
                  testVariant.stock > 0;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      onAttributeChange(option.name, isSelected ? null : value)
                    }
                    disabled={!isAvailable && !isSelected}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all duration-200 ${
                      isSelected
                        ? "bg-[#c4956a] text-[#0a0a0a] border-[#c4956a] shadow-sm shadow-[#c4956a]/20"
                        : isAvailable
                          ? "bg-[#141414] text-[#888] border-[#1a1a1a] hover:border-[#c4956a]/50 hover:text-[#f0ede8]"
                          : "bg-[#0a0a0a] text-[#333] border-[#1a1a1a] cursor-not-allowed opacity-50"
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className="w-3 h-3 inline mr-1 -mt-0.5"
                        strokeWidth={3}
                      />
                    )}
                    {value}
                    {!isAvailable && !isSelected && (
                      <span className="ml-1 text-[10px]">(OOS)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.keys(selectedAttributes).length > 0 && (
        <div
          className={`p-2.5 rounded-lg border ${
            matchedVariant?.isAvailable && matchedVariant?.stock > 0
              ? "bg-[#c4956a]/5 border-[#c4956a]/20"
              : matchedVariant
                ? "bg-[#f87171]/5 border-[#f87171]/20"
                : "bg-[#1a1a1a] border-[#2a2a2a]"
          }`}
        >
          {matchedVariant?.isAvailable && matchedVariant?.stock > 0 ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c4956a]" />
              <span className="text-[12px] text-[#c4956a] font-medium">
                In Stock — {matchedVariant.stock} units available
              </span>
            </div>
          ) : matchedVariant ? (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#f87171]" />
              <span className="text-[12px] text-[#f87171] font-medium">
                Out of Stock — SKU: {matchedVariant.sku}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#555]" />
              <span className="text-[12px] text-[#555] font-medium">
                Select all options to see availability
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
    <PageStyles />
    <div className="border-b border-[#1a1a1a]">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="h-4 w-28 bg-[#111111] rounded animate-pulse" />
      </div>
    </div>
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
          <div className="hidden lg:flex flex-col gap-2 lg:gap-3 overflow-y-auto scrollbar-hide max-h-[320px] lg:max-h-[600px] flex-shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#111111] animate-pulse flex-shrink-0"
              />
            ))}
          </div>
          <div className="relative flex-1 aspect-[4/5] bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden border border-[#1a1a1a]">
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 bg-[#050505]/60 backdrop-blur-sm rounded-md sm:rounded-lg border border-[#1a1a1a] z-20">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#222222] rounded-sm animate-pulse" />
            </div>
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-20">
              <div className="h-4 sm:h-5 w-10 bg-[#050505] rounded border border-[#1a1a1a] animate-pulse" />
              <div className="h-4 sm:h-5 w-12 bg-[#1a1a1a] rounded border border-[#222222] animate-pulse" />
            </div>
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#050505]/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-[#1a1a1a] z-20 flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-[#222222] rounded-full animate-pulse" />
              <div className="h-3 w-8 bg-[#222222] rounded animate-pulse" />
            </div>
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#050505]/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-[#1a1a1a] z-20">
              <div className="h-3 w-10 bg-[#222222] rounded animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] animate-pulse" />
            </div>
          </div>
          <div className="flex lg:hidden gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border-2 border-[#1a1a1a] bg-[#111111] animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col max-w-xl">
          <div className="mb-3 sm:mb-4">
            <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                <div className="h-3 sm:h-3.5 w-20 bg-[#1a1a1a] rounded animate-pulse" />
                <div className="h-5 sm:h-6 lg:h-7 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
                <div className="h-5 sm:h-6 lg:h-7 w-1/2 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
              <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#111111] rounded-lg sm:rounded-xl border border-[#1a1a1a] animate-pulse" />
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#111111] rounded-lg sm:rounded-xl border border-[#1a1a1a] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-5 sm:h-6 w-16 bg-[#111111] rounded border border-[#1a1a1a] animate-pulse flex items-center gap-1 px-2"
                >
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#222222] rounded-sm" />
                </div>
              ))}
            </div>
            <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="h-6 sm:h-8 lg:h-10 w-28 sm:w-32 bg-[#1a1a1a] rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#111111] border border-[#1a1a1a] rounded-md sm:rounded-lg px-1.5 py-0.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#222222] rounded-sm animate-pulse" />
                <div className="h-3 w-12 bg-[#222222] rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#1a1a1a]/50 border border-[#222222]/50 rounded-md sm:rounded-lg px-1.5 py-0.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#222222] rounded-sm animate-pulse" />
                <div className="h-3 w-16 bg-[#222222] rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="mb-3 sm:mb-4 space-y-1 sm:space-y-1.5">
            <div className="h-4 w-full bg-[#111111] rounded animate-pulse" />
            <div className="h-4 w-[92%] bg-[#111111] rounded animate-pulse" />
            <div className="h-4 w-[78%] bg-[#111111] rounded animate-pulse" />
            <div className="h-4 w-[85%] bg-[#111111] rounded animate-pulse hidden sm:block" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-4 w-6 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="flex items-center border border-[#1a1a1a] rounded-lg sm:rounded-xl bg-[#111111] h-10 sm:h-11">
              <div className="px-2.5 sm:px-3 py-1.5 sm:py-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#222222] rounded-sm animate-pulse" />
              </div>
              <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 border-x border-[#1a1a1a]">
                <div className="h-4 w-4 bg-[#222222] rounded animate-pulse" />
              </div>
              <div className="px-2.5 sm:px-3 py-1.5 sm:py-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#222222] rounded-sm animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8">
            <div className="flex-1 h-10 sm:h-12 bg-[#222222] rounded-lg sm:rounded-xl animate-pulse flex items-center justify-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#333333] rounded-sm animate-pulse" />
              <div className="h-4 w-20 bg-[#333333] rounded animate-pulse" />
            </div>
            <div className="flex-1 h-10 sm:h-12 bg-[#1a1a1a] rounded-lg sm:rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2.5 sm:py-3 border-t border-[#1a1a1a]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-1 sm:gap-2"
              >
                <div className="p-1 sm:p-1.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                  <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 bg-[#222222] rounded-sm animate-pulse" />
                </div>
                <div className="h-3 w-14 sm:w-16 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="mt-auto pt-3 sm:pt-4 border-t border-[#1a1a1a] space-y-1 sm:space-y-1.5">
            {[
              { label: 12, value: 24 },
              { label: 14, value: 20 },
              { label: 16, value: 18 },
              { label: 14, value: 18 },
            ].map((row, i) => (
              <div
                key={i}
                className="flex justify-between py-1 border-b border-[#111111] last:border-b-0"
              >
                <div className="h-3 sm:h-3.5 w-10 bg-[#1a1a1a] rounded animate-pulse" />
                <div className="h-3 sm:h-3.5 w-20 sm:w-24 bg-[#111111] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductDetails, handleCreateView } = useProduct();

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const viewTracked = useRef(false);

  const { addToCart, setCartOpen, cartItemCount } = useCartUI();

  const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const productUrl = `${baseUrl}/store/product/${productId}`;

  // Fetch product details
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await handleGetProductDetails(productId);
        if (data?.success && data.product) {
          setProduct(data.product);
          setVariants(data.variants || []);
        } else {
          setError(data?.message || "Failed to load product");
        }
      } catch (err) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId, handleGetProductDetails]);

  // Track view
  useEffect(() => {
    if (productId && !viewTracked.current) {
      viewTracked.current = true;
      handleCreateView(productId).catch((err) => {
        console.log("View tracking failed:", err);
      });
    }
  }, [productId, handleCreateView]);

  useEffect(() => {
    if (product) {
      let thumbnail;

      if (product.thumbnail) {
        thumbnail = { url: product.thumbnail, type: "product" };
      }

      setThumbnail(thumbnail.url || null);
    }
  }, [product]);

  // Build image gallery from product thumbnail + variant images
  useEffect(() => {
    if (product) {
      const images = [];

      const activeVariant = selectedVariant;

      if (activeVariant?.images && Array.isArray(activeVariant.images)) {
        activeVariant.images.forEach((img, idx) => {
          if (img.url) {
            images.push({
              url: img.url,
              type: "variant",
              variantId: activeVariant._id,
            });
          }
        });

        setThumbnail(activeVariant.images[0].url);
      } else if (product.thumbnail) {
        setThumbnail(product.thumbnail);
      }

      setProductImages(images);
      setCurrentImage(0);
    }
  }, [product, selectedVariant]);

  // Find matching variant based on selected attributes
  const matchedVariant = useMemo(() => {
    if (Object.keys(selectedAttributes).length === 0) return null;
    return variants.find((v) =>
      Object.entries(selectedAttributes).every(([key, val]) => {
        const attrVal =
          v.attributes instanceof Map
            ? v.attributes.get(key)
            : v.attributes?.[key];
        return attrVal === val;
      }),
    );
  }, [selectedAttributes, variants]);

  const hasMultipleImages = productImages.length > 1;

  const goToSlide = useCallback(
    (index) => {
      if (!hasMultipleImages) return;
      let newIndex = index;
      if (newIndex < 0) newIndex = productImages.length - 1;
      if (newIndex >= productImages.length) newIndex = 0;
      setCurrentImage(newIndex);
    },
    [hasMultipleImages, productImages.length],
  );

  const nextImage = useCallback(
    () => goToSlide(currentImage + 1),
    [currentImage, goToSlide],
  );
  const prevImage = useCallback(
    () => goToSlide(currentImage - 1),
    [currentImage, goToSlide],
  );
  const openLightbox = () => {
    if (productImages.length > 0) setLightboxOpen(true);
  };

  const handleAttributeChange = useCallback(
    (optionName, value) => {
      setSelectedAttributes((prev) => {
        const next = { ...prev };
        if (value === null) {
          delete next[optionName];
        } else {
          next[optionName] = value;
        }

        // Find and set the matching variant RIGHT HERE, synchronously
        const matched = variants.find((v) =>
          Object.entries(next).every(([k, val]) => {
            const attrVal =
              v.attributes instanceof Map
                ? v.attributes.get(k)
                : v.attributes?.[k];
            return attrVal === val;
          }),
        );
        if (matched) setSelectedVariant(matched);

        return next;
      });
    },
    [variants],
  );

  const handleSelectVariant = useCallback((variant) => {
    setSelectedVariant(variant);
    if (variant?.attributes) {
      const attrs =
        variant.attributes instanceof Map
          ? Object.fromEntries(variant.attributes)
          : variant.attributes;
      setSelectedAttributes(attrs);
    }
  }, []);

  const formatPrice = (amount, currency) => {
    if (!amount || isNaN(Number(amount))) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const { toggleWishlist, isInWishlist, setWishlistOpen } = useWishlistUI();

  const productIsWishlisted = isInWishlist(product?._id, matchedVariant?._id);

  // Determine display price
  const displayPrice = matchedVariant?.price || product?.startingPrice;
  const isFullySelected =
    product?.variantOptions?.length > 0
      ? product.variantOptions.every((opt) => selectedAttributes[opt.name])
      : true;
  const canAddToCart =
    product?.variantOptions?.length > 0
      ? isFullySelected &&
        matchedVariant?.isAvailable &&
        matchedVariant?.stock > 0
      : true;

  // Show skeleton while loading
  if (loading) {
    return (
      <>
        <PageStyles />
        <ProductSkeleton />
      </>
    );
  }

  // Show error if product failed to load or not found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
        <PageStyles />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-full bg-[#200f0f] flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-[#f87171]" />
          </div>
          <h3 className="font-['Playfair_Display'] text-[20px] text-[#f0ede8] mb-2 font-semibold">
            {error ? "Unable to load product" : "Product not found"}
          </h3>
          <p className="text-[14px] text-[#f87171] mb-6 font-medium">
            {error ||
              "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/store")}
            className="px-6 py-2.5 bg-[#c4956a] text-[#0a0a0a] text-xs uppercase tracking-wider rounded-lg hover:bg-[#d4a57a] font-bold"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
        <PageStyles />

        <SharePopup
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          productUrl={productUrl}
          productTitle={product.title}
          productImage={product.thumbnail || ""}
        />
        <ImageLightbox
          images={productImages}
          currentIndex={currentImage}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
          goToSlide={goToSlide}
        />

        <div className="border-b border-[#1a1a1a]">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
            <div className="flex items-center justify-between">
              {/* Left: Back Button */}
              <button
                onClick={() => navigate("/store")}
                className="flex items-center gap-1.5 sm:gap-2 text-[#777777] hover:text-[#f0f0f0] transition-colors text-xs sm:text-sm font-medium group"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Store
              </button>

              <div className="flex gap-8">
                {/* Right: Cart Button */}
                <CartButton />

                <WishlistButton />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Images + Variant Image Gallery */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Main Image Gallery with thumbnails */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
                {hasMultipleImages && (
                  <div className="hidden lg:flex flex-col gap-2 lg:gap-3 overflow-y-auto scrollbar-hide max-h-[320px] lg:max-h-[600px] flex-shrink-0">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          goToSlide(idx);
                        }}
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl overflow-hidden border transition-all flex-shrink-0 ${currentImage === idx ? "border-[#d4a76a]" : "border-[#1a1a1a] hover:border-[#333333]"}`}
                      >
                        <img
                          src={img.url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        {currentImage === idx && (
                          <div className="absolute inset-0 bg-[#d4a76a]/10" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="relative flex-1 aspect-[4/5] bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
                  style={{ position: "relative" }}
                  onClick={openLightbox}
                >
                  {productImages.length > 0 ? (
                    <div className="carousel-slide active">
                      <img
                        src={productImages[currentImage]?.url}
                        alt={`${product.title}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ) : thumbnail ? (
                    <div className="carousel-slide active">
                      <img
                        src={thumbnail}
                        alt={`${product.title}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#333333] absolute inset-0">
                      <span className="text-sm sm:text-base font-['Playfair_Display']">
                        No Image Available
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 bg-[#050505]/60 backdrop-blur-sm rounded-md sm:rounded-lg border border-[#1a1a1a] text-[#777777] z-20 pointer-events-none">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>

                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-20">
                    {product.isNew && (
                      <span className="bg-[#050505] text-[#f0f0f0] text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] px-1.5 py-0.5 rounded font-medium border border-[#1a1a1a]">
                        NEW
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-[#c4956a] text-[#f0f0f0] text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 sm:gap-1">
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
                        HOT
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#050505]/80 backdrop-blur-sm text-[#f0f0f0] text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 sm:gap-1.5 border border-[#1a1a1a] z-20">
                    <Eye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#d4a76a]" />
                    {product.views}
                  </div>

                  {hasMultipleImages && (
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#050505]/80 backdrop-blur-sm text-[#f0f0f0] text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full border border-[#1a1a1a] z-20">
                      {currentImage + 1} / {productImages.length}
                    </div>
                  )}
                </div>

                {hasMultipleImages && (
                  <div className="flex lg:hidden gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {productImages.map((img, idx) => {
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            goToSlide(idx);
                          }}
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${currentImage === idx ? "border-[#d4a76a]" : "border-[#1a1a1a] hover:border-[#333333]"}`}
                        >
                          <img
                            src={img.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          {currentImage === idx && (
                            <div className="absolute inset-0 bg-[#d4a76a]/10" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="flex flex-col">
              <div
                className="mb-3 sm:mb-4 animate-fade-in-up"
                style={{
                  animationDelay: "0.1s",
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-xs font-medium text-[#d4a76a] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2 block">
                      {product.category}
                    </span>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#f0f0f0] leading-tight font-['Playfair_Display']">
                      {product.title}
                    </h1>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleWishlist(product, matchedVariant)}
                      className={`p-2 rounded-lg sm:rounded-xl border transition-all ${
                        productIsWishlisted
                          ? "bg-[#ff5555]/10 border-[#ff5555]/30 text-[#ff5555]"
                          : "bg-[#111111] border-[#1a1a1a] text-[#555555] hover:text-[#f0f0f0]"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${productIsWishlisted ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => setShareOpen(true)}
                      className="p-2 rounded-lg sm:rounded-xl border border-[#1a1a1a] bg-[#111111] text-[#555555] hover:text-[#f0f0f0] transition-all"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {product.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#111111] text-[#777777] text-[10px] sm:text-xs px-2 py-0.5 rounded border border-[#1a1a1a] flex items-center gap-0.5 sm:gap-1 capitalize"
                    >
                      <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#555555]" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f0f0f0]">
                    {formatPrice(displayPrice?.amount, displayPrice?.currency)}
                  </span>
                  {matchedVariant && (
                    <span className="text-xs text-[#555] font-medium">
                      SKU: {matchedVariant.sku}
                    </span>
                  )}
                </div>

                {product.sales > 0 && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-[#111111] border border-[#1a1a1a] rounded-md sm:rounded-lg px-1.5 py-0.5">
                      <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d4a76a]" />
                      <span className="text-xs text-[#aaaaaa] font-medium">
                        {product.sales} sold
                      </span>
                    </div>
                    {product.isBestseller && (
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-[#c4956a]/10 border border-[#c4956a]/20 rounded-md sm:rounded-lg px-1.5 py-0.5">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c4956a] fill-current" />
                        <span className="text-xs text-[#c4956a] font-medium">
                          Bestseller
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className="mb-3 sm:mb-4 animate-fade-in-up"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                <p className="text-[#aaaaaa] leading-relaxed text-sm sm:text-base">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Variant Selector */}
              {product.variantOptions?.length > 0 && variants.length > 0 && (
                <div
                  className="mb-3 sm:mb-4 animate-fade-in-up"
                  style={{
                    animationDelay: "0.25s",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-[#c4956a]" />
                    <span className="text-xs text-[#888] font-medium uppercase tracking-wider">
                      Select Options
                    </span>
                    {matchedVariant?.isAvailable &&
                      matchedVariant?.stock > 0 && (
                        <span className="text-[10px] text-[#c4956a] bg-[#c4956a]/10 px-2 py-0.5 rounded border border-[#c4956a]/20 font-medium ml-auto">
                          {matchedVariant.stock} in stock
                        </span>
                      )}
                  </div>
                  <VariantSelector
                    variantOptions={product.variantOptions}
                    variants={variants}
                    selectedAttributes={selectedAttributes}
                    onAttributeChange={handleAttributeChange}
                  />
                </div>
              )}

              {/* All Variants List - IN RIGHT COLUMN */}
              {variants.length > 0 && (
                <div
                  className="mb-3 sm:mb-4 animate-fade-in-up"
                  style={{
                    animationDelay: "0.3s",
                    animationFillMode: "forwards",
                  }}
                >
                  <VariantsList
                    variants={variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={handleSelectVariant}
                    formatPrice={formatPrice}
                  />
                </div>
              )}

              <div
                className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 animate-fade-in-up"
                style={{
                  animationDelay: "0.35s",
                  animationFillMode: "forwards",
                }}
              >
                <span className="text-xs sm:text-sm font-medium text-[#777777]">
                  Qty:
                </span>
                <div className="flex items-center border border-[#1a1a1a] rounded-lg sm:rounded-xl bg-[#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[#777777] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-l-lg sm:rounded-l-xl transition-colors text-base sm:text-lg"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[#f0f0f0] font-medium min-w-[2rem] sm:min-w-[3rem] text-center text-sm sm:text-base border-x border-[#1a1a1a]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[#777777] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-r-lg sm:rounded-r-xl transition-colors text-base sm:text-lg"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8 animate-fade-in-up"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "forwards",
                }}
              >
                <button
                  onClick={() =>
                    canAddToCart && addToCart(product, matchedVariant, quantity)
                  }
                  disabled={!canAddToCart}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg ${
                    canAddToCart
                      ? "bg-[#f0f0f0] text-[#0a0a0a] hover:bg-[#d4a76a] active:scale-[0.98] shadow-black/20"
                      : "bg-[#1a1a1a] text-[#555] cursor-not-allowed shadow-none"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  {canAddToCart
                    ? "Add to Cart"
                    : isFullySelected
                      ? "Out of Stock"
                      : "Select Options"}
                </button>
                <button
                  disabled={!canAddToCart}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg ${canAddToCart ? "bg-[#d4a76a] text-[#0a0a0a] hover:bg-[#c4956a] active:scale-[0.98] shadow-[#d4a76a]/20" : "bg-[#1a1a1a] text-[#555] cursor-not-allowed shadow-none"}`}
                >
                  Buy Now
                </button>
              </div>

              <div
                className="grid grid-cols-3 gap-2 sm:gap-4 py-2.5 sm:py-3 border-t border-[#1a1a1a] animate-fade-in-up"
                style={{
                  animationDelay: "0.5s",
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  <div className="p-1 sm:p-1.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                    <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#d4a76a]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#777777]">
                    Free Shipping
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  <div className="p-1 sm:p-1.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#777777]">
                    Secure
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                  <div className="p-1 sm:p-1.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                    <RotateCcw className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#ff5555]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#777777]">
                    Returns
                  </span>
                </div>
              </div>

              <div
                className="mt-auto pt-3 sm:pt-4 border-t border-[#1a1a1a] space-y-1 sm:space-y-1.5 animate-fade-in-up"
                style={{
                  animationDelay: "0.6s",
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex justify-between text-xs sm:text-sm py-1 border-b border-[#111111]">
                  <span className="text-[#555555]">ID</span>
                  <span className="text-[#777777] font-mono text-[10px] sm:text-xs">
                    {product._id}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm py-1 border-b border-[#111111]">
                  <span className="text-[#555555]">Seller</span>
                  <span className="text-[#777777] font-mono text-[10px] sm:text-xs">
                    {product.seller?.fullName || product.seller}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm py-1 border-b border-[#111111]">
                  <span className="text-[#555555]">Published</span>
                  <span className="text-[#aaaaaa] text-[10px] sm:text-xs">
                    {formatDate(product.publishedAt)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm py-1">
                  <span className="text-[#555555]">Updated</span>
                  <span className="text-[#aaaaaa] text-[10px] sm:text-xs">
                    {formatDate(product.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />
      <WishlistSidebar />
    </>
  );
};

export default ProductDetails;
