// ProductDetails.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import useProduct from "../hooks/useProduct";
import { useSelector } from "react-redux";
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
      transition: opacity 0.5s ease;
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

// ─── Instagram Icon (Custom since react-share doesn't have it) ───
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

// ─── Share Popup Component ───────────────────────────────────────
const SharePopup = ({
  isOpen,
  onClose,
  productUrl,
  productTitle,
  productImage,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
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
  const shareHashtags = ["Snitch", "Fashion", "Shopping"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="absolute bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md animate-slide-up sm:animate-scale-in">
        <div className="bg-[#0a0a0a] sm:rounded-2xl rounded-t-2xl border border-[#1a1a1a] sm:border-[#222222] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1a1a1a]">
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

          {/* Copy Link Section */}
          <div className="p-4 sm:p-5 border-b border-[#1a1a1a]">
            <label className="text-[11px] sm:text-xs text-[#777777] uppercase tracking-wider font-medium mb-2 sm:mb-3 block">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-[#1a1a1a] text-[#f0f0f0] hover:bg-[#222222] border border-[#222222]"}`}
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

          {/* Social Share Grid */}
          <div className="p-4 sm:p-5">
            <label className="text-[11px] sm:text-xs text-[#777777] uppercase tracking-wider font-medium mb-3 sm:mb-4 block">
              Share on Social
            </label>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {/* WhatsApp */}
              <WhatsappShareButton
                url={productUrl}
                title={shareTitle}
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <WhatsappIcon
                  size={48}
                  round
                  className="sm:w-12 sm:h-12 w-10 h-10"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  WhatsApp
                </span>
              </WhatsappShareButton>

              {/* Facebook */}
              <FacebookShareButton
                url={productUrl}
                quote={shareTitle}
                hashtag="#Snitch"
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <FacebookIcon
                  size={48}
                  round
                  className="sm:w-12 sm:h-12 w-10 h-10"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  Facebook
                </span>
              </FacebookShareButton>

              {/* X (Twitter) */}
              <TwitterShareButton
                url={productUrl}
                title={shareTitle}
                hashtags={shareHashtags}
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <TwitterIcon
                  size={48}
                  round
                  className="sm:w-12 sm:h-12 w-10 h-10"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  X
                </span>
              </TwitterShareButton>

              {/* LinkedIn */}
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
                  className="sm:w-12 sm:h-12 w-10 h-10"
                />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  LinkedIn
                </span>
              </LinkedinShareButton>

              {/* Instagram - Custom (opens app) */}
              <button
                onClick={() => {
                  window.open("https://www.instagram.com/", "_blank");
                }}
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
              >
                <InstagramIcon size={40} round />
                <span className="text-[10px] sm:text-xs text-[#aaaaaa] font-medium">
                  Instagram
                </span>
              </button>
            </div>
          </div>

          {/* Native Share Button (Mobile) */}
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

// ─── Lightbox Component ──────────────────────────────────────────
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
  const minZoom = 1.5;
  const maxZoom = 5;
  const zoomStep = 0.5;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setZoomLevel(2.5);
    } else {
      document.body.style.overflow = "";
    }
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
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0)
          setZoomLevel((prev) => Math.min(prev + zoomStep, maxZoom));
        else setZoomLevel((prev) => Math.max(prev - zoomStep, minZoom));
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isOpen]);

  const handleZoomIn = () =>
    setZoomLevel((prev) => Math.min(prev + zoomStep, maxZoom));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - zoomStep, minZoom));

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imgX = e.clientX - imgRect.left;
    const imgY = e.clientY - imgRect.top;
    const bgX = (imgX / imgRect.width) * 100;
    const bgY = (imgY / imgRect.height) * 100;
    setMagnifierPosition({
      x: x - magnifierSize / 2,
      y: y - magnifierSize / 2,
      bgX,
      bgY,
    });
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];
  const imageUrl = currentImage?.url || currentImage;
  const canZoomIn = zoomLevel < maxZoom;
  const canZoomOut = zoomLevel > minZoom;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in bg-black/95">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4 lg:p-6">
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
          onClick={handleZoomIn}
          disabled={!canZoomIn}
          className={`p-1.5 sm:p-2 rounded-lg transition-all ${canZoomIn ? "text-[#d4a76a] hover:bg-[#333333]" : "text-[#555555] cursor-not-allowed"}`}
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span className="text-[#f0f0f0] text-xs sm:text-sm font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center">
          {zoomLevel.toFixed(1)}x
        </span>
        <button
          onClick={handleZoomOut}
          disabled={!canZoomOut}
          className={`p-1.5 sm:p-2 rounded-lg transition-all ${canZoomOut ? "text-[#d4a76a] hover:bg-[#333333]" : "text-[#555555] cursor-not-allowed"}`}
        >
          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-full w-full flex items-center justify-center p-12 sm:p-16 lg:p-24">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 lg:p-4 bg-[#1a1a1a]/60 backdrop-blur-sm rounded-full border border-[#333333] text-[#f0f0f0] hover:bg-[#222222] hover:border-[#d4a76a]/30 transition-all z-20"
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
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 lg:p-4 bg-[#1a1a1a]/60 backdrop-blur-sm rounded-full border border-[#333333] text-[#f0f0f0] hover:bg-[#222222] hover:border-[#d4a76a]/30 transition-all z-20"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide max-w-full">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex ? "border-[#d4a76a] scale-105" : "border-[#333333] hover:border-[#555555] opacity-60 hover:opacity-100"}`}
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

const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
    <PageStyles />
    
    {/* Breadcrumb */}
    <div className="border-b border-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-3 sm:py-4">
        <div className="h-4 w-28 bg-[#111111] rounded animate-pulse" />
      </div>
    </div>

    <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        
        {/* LEFT COLUMN — Image Area (exactly matches real layout) */}
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4">
          
          {/* Desktop vertical thumbnails */}
          <div className="hidden lg:flex flex-col gap-2 lg:gap-3 overflow-y-auto scrollbar-hide max-h-[400px] lg:max-h-[600px] flex-shrink-0">
            {[1,2,3,4].map((i) => (
              <div 
                key={i} 
                className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl overflow-hidden border border-[#1a1a1a] bg-[#111111] animate-pulse flex-shrink-0"
              />
            ))}
          </div>

          {/* Main image container — matches aspect-square, rounded, badges overlay area */}
          <div className="relative flex-1 aspect-square bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden border border-[#1a1a1a]">
            {/* Expand icon placeholder (top-right) */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-[#050505]/60 backdrop-blur-sm rounded-md sm:rounded-lg border border-[#1a1a1a] z-20">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#222222] rounded-sm animate-pulse" />
            </div>

            {/* Badges area (top-left) */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-20">
              <div className="h-4 sm:h-5 w-10 bg-[#050505] rounded border border-[#1a1a1a] animate-pulse" />
              <div className="h-4 sm:h-5 w-12 bg-[#1a1a1a] rounded border border-[#222222] animate-pulse" />
            </div>

            {/* Views counter (bottom-right) */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#050505]/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#1a1a1a] z-20 flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-[#222222] rounded-full animate-pulse" />
              <div className="h-3 w-8 bg-[#222222] rounded animate-pulse" />
            </div>

            {/* Image counter (bottom-left) */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#050505]/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#1a1a1a] z-20">
              <div className="h-3 w-10 bg-[#222222] rounded animate-pulse" />
            </div>

            {/* Centered "image" placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] animate-pulse" />
            </div>
          </div>

          {/* Mobile horizontal thumbnails */}
          <div className="flex lg:hidden gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
            {[1,2,3,4].map((i) => (
              <div 
                key={i} 
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 border-[#1a1a1a] bg-[#111111] animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — Product Info (exactly matches real layout) */}
        <div className="flex flex-col">
          
          {/* Category + Title + Heart/Share buttons */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                {/* Category tag */}
                <div className="h-3 sm:h-3.5 w-20 bg-[#1a1a1a] rounded animate-pulse" />
                {/* Title — two lines */}
                <div className="h-6 sm:h-7 lg:h-8 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
                <div className="h-6 sm:h-7 lg:h-8 w-1/2 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
              {/* Heart + Share buttons */}
              <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#111111] rounded-lg sm:rounded-xl border border-[#1a1a1a] animate-pulse" />
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#111111] rounded-lg sm:rounded-xl border border-[#1a1a1a] animate-pulse" />
              </div>
            </div>
            
            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
              {[1,2,3].map((i) => (
                <div 
                  key={i} 
                  className="h-5 sm:h-6 w-16 bg-[#111111] rounded border border-[#1a1a1a] animate-pulse flex items-center gap-1 px-2"
                >
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#222222] rounded-sm" />
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="h-8 sm:h-10 lg:h-12 w-28 sm:w-32 bg-[#1a1a1a] rounded animate-pulse" />
            </div>

            {/* Sales + Bestseller badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#111111] border border-[#1a1a1a] rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#222222] rounded-sm animate-pulse" />
                <div className="h-3 w-12 bg-[#222222] rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 bg-[#1a1a1a]/50 border border-[#222222]/50 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#222222] rounded-sm animate-pulse" />
                <div className="h-3 w-16 bg-[#222222] rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <div className="h-4 w-full bg-[#111111] rounded animate-pulse" />
            <div className="h-4 w-[92%] bg-[#111111] rounded animate-pulse" />
            <div className="h-4 w-[78%] bg-[#111111] rounded animate-pulse" />
            <div className="h-4 w-[85%] bg-[#111111] rounded animate-pulse hidden sm:block" />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="h-4 w-6 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="flex items-center border border-[#1a1a1a] rounded-lg sm:rounded-xl bg-[#111111] h-10 sm:h-11">
              <div className="px-3 sm:px-4 py-2 sm:py-2.5">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#222222] rounded-sm animate-pulse" />
              </div>
              <div className="px-3 sm:px-6 py-2 sm:py-2.5 border-x border-[#1a1a1a]">
                <div className="h-4 w-4 bg-[#222222] rounded animate-pulse" />
              </div>
              <div className="px-3 sm:px-4 py-2 sm:py-2.5">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#222222] rounded-sm animate-pulse" />
              </div>
            </div>
          </div>

          {/* Buttons: Add to Cart + Buy Now */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8">
            <div className="flex-1 h-12 sm:h-14 bg-[#222222] rounded-lg sm:rounded-xl animate-pulse flex items-center justify-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#333333] rounded-sm animate-pulse" />
              <div className="h-4 w-20 bg-[#333333] rounded animate-pulse" />
            </div>
            <div className="flex-1 h-12 sm:h-14 bg-[#1a1a1a] rounded-lg sm:rounded-xl animate-pulse" />
          </div>

          {/* Trust badges: Free Shipping / Secure / Returns */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-t border-[#1a1a1a]">
            {[1,2,3].map((i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1 sm:gap-2">
                <div className="p-1.5 sm:p-2.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                  <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 bg-[#222222] rounded-sm animate-pulse" />
                </div>
                <div className="h-3 w-14 sm:w-16 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Meta rows: ID, Seller, Published, Updated */}
          <div className="mt-auto pt-4 sm:pt-6 border-t border-[#1a1a1a] space-y-1.5 sm:space-y-2">
            {[
              { label: 12, value: 24 },
              { label: 14, value: 20 },
              { label: 16, value: 18 },
              { label: 14, value: 18 },
            ].map((row, i) => (
              <div 
                key={i} 
                className="flex justify-between py-1 sm:py-1.5 border-b border-[#111111] last:border-b-0"
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const viewTracked = useRef(false);

  // Get base URL from env
  const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const productUrl = `${baseUrl}/store/product/${productId}`;

  useEffect(() => {
    async function load() {
      await handleGetProductDetails(productId);
    }
    load();
  }, [productId, handleGetProductDetails]);

  // Track view when product loads - only once per visit
  useEffect(() => {
    if (productId && !viewTracked.current) {
      viewTracked.current = true;
      handleCreateView(productId).catch((err) => {
        console.log("View tracking failed:", err);
      });
    }
  }, [productId, handleCreateView]);

  const product = useSelector((state) => state.products.product);
  useEffect(() => {
    setCurrentImage(0);
  }, [productId]);

  const images = product?.images || [];
  const hasMultipleImages = images.length > 1;

  const goToSlide = useCallback(
    (index) => {
      if (!hasMultipleImages) return;
      let newIndex = index;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      setCurrentImage(newIndex);
    },
    [hasMultipleImages, images.length],
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
    if (images.length > 0) setLightboxOpen(true);
  };

  if (!product) {
    return (
      <>
        <PageStyles />
        <ProductSkeleton />
      </>
    );
  }

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get product image for share
  const productImage = product.images?.[0]?.url || "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <PageStyles />

      {/* Share Popup */}
      <SharePopup
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        productUrl={productUrl}
        productTitle={product.title}
        productImage={productImage}
      />

      <ImageLightbox
        images={images}
        currentIndex={currentImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
        goToSlide={goToSlide}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-3 sm:py-4">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-1.5 sm:gap-2 text-[#777777] hover:text-[#f0f0f0] transition-colors text-xs sm:text-sm font-medium group"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4">
            {/* DESKTOP ONLY: Vertical thumbnails on LEFT */}
            {hasMultipleImages && (
              <div className="hidden lg:flex flex-col gap-2 lg:gap-3 overflow-y-auto scrollbar-hide max-h-[400px] lg:max-h-[600px] flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl overflow-hidden border transition-all flex-shrink-0 ${currentImage === idx ? "border-[#d4a76a]" : "border-[#1a1a1a] hover:border-[#333333]"}`}
                  >
                    <img
                      src={img?.url || img}
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

            {/* Main Image */}
            <div
              className="relative flex-1 aspect-square bg-[#111111] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
              onClick={openLightbox}
            >
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`carousel-slide ${idx === currentImage ? "active" : "inactive"}`}
                  >
                    <img
                      src={img?.url || img}
                      alt={`${product.title} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#333333] absolute inset-0">
                  <span className="text-sm sm:text-lg font-['Playfair_Display']">
                    No Image Available
                  </span>
                </div>
              )}

              {/* Expand icon */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-[#050505]/60 backdrop-blur-sm rounded-md sm:rounded-lg border border-[#1a1a1a] text-[#777777] z-20 pointer-events-none">
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-20">
                {product.isNew && (
                  <span className="bg-[#050505] text-[#f0f0f0] text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium border border-[#1a1a1a]">
                    NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-[#c4956a] text-[#f0f0f0] text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium flex items-center gap-0.5 sm:gap-1">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
                    HOT
                  </span>
                )}
              </div>

              {/* Views */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#050505]/80 backdrop-blur-sm text-[#f0f0f0] text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 border border-[#1a1a1a] z-20">
                <Eye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#d4a76a]" />
                {product.views}
              </div>

              {/* Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#050505]/80 backdrop-blur-sm text-[#f0f0f0] text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#1a1a1a] z-20">
                  {currentImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* MOBILE ONLY: Horizontal thumbnails at BOTTOM */}
            {hasMultipleImages && (
              <div className="flex lg:hidden gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${currentImage === idx ? "border-[#d4a76a]" : "border-[#1a1a1a] hover:border-[#333333]"}`}
                  >
                    <img
                      src={img?.url || img}
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
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            <div
              className="mb-4 sm:mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-medium text-[#d4a76a] uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2 block">
                    {product.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#f0f0f0] leading-tight font-['Playfair_Display']">
                    {product.title}
                  </h1>
                </div>
                <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all ${isWishlisted ? "bg-[#ff5555]/10 border-[#ff5555]/30 text-[#ff5555]" : "bg-[#111111] border-[#1a1a1a] text-[#555555] hover:text-[#f0f0f0]"}`}
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => setShareOpen(true)}
                    className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-[#1a1a1a] bg-[#111111] text-[#555555] hover:text-[#f0f0f0] transition-all"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#111111] text-[#777777] text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded border border-[#1a1a1a] flex items-center gap-0.5 sm:gap-1 capitalize"
                  >
                    <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#555555]" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f0f0f0]">
                  {formatPrice(product.price?.amount, product.price?.currency)}
                </span>
              </div>

              {product.sales > 0 && (
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-[#111111] border border-[#1a1a1a] rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d4a76a]" />
                    <span className="text-[11px] sm:text-[13px] text-[#aaaaaa] font-medium">
                      {product.sales} sold
                    </span>
                  </div>
                  {product.isBestseller && (
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-[#c4956a]/10 border border-[#c4956a]/20 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c4956a] fill-current" />
                      <span className="text-[11px] sm:text-[13px] text-[#c4956a] font-medium">
                        Bestseller
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="mb-4 sm:mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              <p className="text-[#aaaaaa] leading-relaxed text-sm sm:text-base lg:text-lg">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            <div
              className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              <span className="text-xs sm:text-sm font-medium text-[#777777]">
                Qty:
              </span>
              <div className="flex items-center border border-[#1a1a1a] rounded-lg sm:rounded-xl bg-[#111111]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-[#777777] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-l-lg sm:rounded-l-xl transition-colors text-base sm:text-lg"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="px-3 sm:px-6 py-2 sm:py-2.5 text-[#f0f0f0] font-medium min-w-[2rem] sm:min-w-[3rem] text-center text-sm sm:text-base border-x border-[#1a1a1a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 text-[#777777] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-r-lg sm:rounded-r-xl transition-colors text-base sm:text-lg"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <button className="flex-1 bg-[#f0f0f0] text-[#0a0a0a] px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg hover:bg-[#d4a76a] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-black/20">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Add to Cart
              </button>
              <button className="flex-1 bg-[#d4a76a] text-[#0a0a0a] px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg hover:bg-[#c4956a] active:scale-[0.98] transition-all shadow-lg shadow-[#d4a76a]/20">
                Buy Now
              </button>
            </div>

            <div
              className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-t border-[#1a1a1a] opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                <div className="p-1.5 sm:p-2.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                  <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#d4a76a]" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-[#777777]">
                  Free Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                <div className="p-1.5 sm:p-2.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-[#777777]">
                  Secure
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
                <div className="p-1.5 sm:p-2.5 bg-[#111111] rounded-full border border-[#1a1a1a]">
                  <RotateCcw className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#ff5555]" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-[#777777]">
                  Returns
                </span>
              </div>
            </div>

            <div
              className="mt-auto pt-4 sm:pt-6 border-t border-[#1a1a1a] space-y-1.5 sm:space-y-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <div className="flex justify-between text-xs sm:text-sm py-1 sm:py-1.5 border-b border-[#111111]">
                <span className="text-[#555555]">ID</span>
                <span className="text-[#777777] font-mono text-[10px] sm:text-xs">
                  {product._id}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm py-1 sm:py-1.5 border-b border-[#111111]">
                <span className="text-[#555555]">Seller</span>
                <span className="text-[#777777] font-mono text-[10px] sm:text-xs">
                  {product.seller.fullName}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm py-1 sm:py-1.5 border-b border-[#111111]">
                <span className="text-[#555555]">Published</span>
                <span className="text-[#aaaaaa] text-[10px] sm:text-xs">
                  {formatDate(product.publishedAt)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm py-1 sm:py-1.5">
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
  );
};

export default ProductDetails;
