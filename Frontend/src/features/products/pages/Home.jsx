import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import useProduct from "../hooks/useProduct";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Star,
  TrendingUp,
  Eye,
} from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Animations ───────────────────────────────────────────────────
const PageStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
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
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-shimmer {
      background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .animate-marquee { animation: marquee 30s linear infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }

    .product-card-hover:hover .product-image {
      transform: scale(1.05);
    }
    .product-card-hover:hover .quick-actions {
      opacity: 1;
      transform: translateY(0);
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    .masonry-grid {
      column-count: 2;
      column-gap: 16px;
    }
    @media (min-width: 768px) {
      .masonry-grid { column-count: 3; column-gap: 20px; }
    }
    @media (min-width: 1280px) {
      .masonry-grid { column-count: 4; column-gap: 24px; }
    }
    .masonry-grid > * { break-inside: avoid; margin-bottom: 16px; }
    @media (min-width: 768px) {
      .masonry-grid > * { margin-bottom: 20px; }
    }
    @media (min-width: 1280px) {
      .masonry-grid > * { margin-bottom: 24px; }
    }
  `}</style>
);

// ─── Search Overlay ──────────────────────────────────────────────
const SearchOverlay = ({ isOpen, onClose, products }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = products
      .filter((p) => p.title?.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
    setResults(filtered);
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute top-0 left-0 right-0 bg-[#111111] shadow-xl border-b border-[#151515] animate-fade-in-up">
        <div className="max-w-[800px] mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-[#555555]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, collections..."
              className="flex-1 bg-transparent text-[18px] text-[#f0f0f0] placeholder:text-[#555555] outline-none font-['Playfair_Display'] text-[#f0f0f0]"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#f0f0f0]" />
            </button>
          </div>

          {results.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => {
                    navigate(`/store/product/${product._id}`);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#050505] transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Search className="w-4 h-4 text-[#555555]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] text-[#f0f0f0] font-medium truncate">
                      {product.title}
                    </p>
                    <p className="text-[11px] text-[#777777]">
                      {product.startingPrice?.currency}{" "}
                      {parseInt(product.startingPrice?.amount || 0).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <p className="mt-6 text-[14px] text-[#555555] text-center py-8">
              No products found for "{query}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Hero Section ────────────────────────────────────────────────
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 opacity-10 pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-gradient-to-br from-[#2d2d2d] to-[#0a0a0a] animate-float"
            style={{
              animationDelay: `${i * 0.5}s`,
              height: `${200 + (i % 3) * 100}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-[11px] tracking-[0.3em] text-[#d4a76a] uppercase mb-6 animate-fade-in-up">
          Premium Fashion Destination
        </p>
        <h1
          className="font-['Playfair_Display'] text-[60px] sm:text-[80px] md:text-[120px] lg:text-[140px] leading-[0.9] tracking-[0.05em] text-[#f0f0f0] mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          SNITCH
        </h1>
        <p
          className="text-[14px] sm:text-[16px] text-[#aaaaaa] max-w-md mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Discover curated collections of premium menswear and womenswear.
          Crafted for the modern individual.
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={() => navigate("/category/men")}
            className="group px-8 py-4 bg-[#050505] text-[#f0f0f0] text-[12px] tracking-[0.15em] rounded-xl hover:bg-[#1a1a1a] transition-all duration-300 flex items-center gap-3 font-medium"
          >
            SHOP MEN
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/category/women")}
            className="group px-8 py-4 border-2 border-[#1a1a1a] text-[#f0f0f0] text-[12px] tracking-[0.15em] rounded-xl hover:bg-[#050505] hover:text-[#f0f0f0] transition-all duration-300 flex items-center gap-3 font-medium"
          >
            SHOP WOMEN
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#f0f0f0]/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#f0f0f0]/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

// ─── Marquee Banner ──────────────────────────────────────────────
const MarqueeBanner = () => {
  const items = [
    "FREE SHIPPING ON ORDERS ABOVE ₹1999",
    "NEW ARRIVALS EVERY WEEK",
    "PREMIUM QUALITY GUARANTEED",
    "EASY RETURNS WITHIN 7 DAYS",
  ];

  return (
    <div className="bg-[#050505] py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[11px] tracking-[0.2em] text-[#f0f0f0]/80 mx-8 flex items-center gap-2"
          >
            <Star className="w-3 h-3 text-[#d4a76a]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Category Strip ──────────────────────────────────────────────
const CategoryStrip = () => {
  const navigate = useNavigate();

  // Categories aligned with the model's tag/category enum values
  const categories = [
    {
      name: "Shirts",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      tag: "shirts",
    },
    {
      name: "T-Shirts",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      tag: "t-shirts",
    },
    {
      name: "Jeans",
      image:
        "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=500&fit=crop",
      tag: "jeans",
    },
    {
      name: "Trousers",
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
      tag: "trousers",
    },
    {
      name: "Blazers",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop",
      tag: "blazers",
    },
    {
      name: "Footwear",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
      tag: "footwear",
    },
    {
      name: "Accessories",
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&fit=crop",
      tag: "accessories",
    },
    {
      name: "Ethnic",
      image:
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=500&fit=crop",
      tag: "ethnic",
    },
  ];

  return (
    <section className="py-12 bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-['Playfair_Display'] text-[24px] sm:text-[28px] text-[#f0f0f0]">
            Shop by Category
          </h2>
          <button
            onClick={() => navigate("/categories")}
            className="text-[12px] tracking-[0.1em] text-[#d4a76a] hover:text-[#f0f0f0] transition-colors flex items-center gap-1"
          >
            VIEW ALL <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/category/${cat.tag}`)}
              className="flex-shrink-0 group text-center"
            >
              <div className="w-[120px] h-[160px] sm:w-[140px] sm:h-[180px] rounded-2xl overflow-hidden mb-3 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              </div>
              <p className="text-[12px] tracking-[0.1em] text-[#f0f0f0] font-medium">
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Product Card ────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const hasImage = product.thumbnail;

  // Fixed aspect ratios since width/height are no longer in the image schema
  const aspectRatio =
    [1.2, 0.85, 1.5, 1.0, 1.3, 0.9, 1.4, 1.1][index % 8] || 1.2;

  // isNew and isBestseller come from virtuals / model field
  const isNew = product.isNew;
  const isBestseller = product.isBestseller || product.autoIsBestseller;

  return (
    <div
      className="group product-card-hover cursor-pointer opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${Math.min(index * 0.08, 1.5)}s`,
        animationFillMode: "forwards",
      }}
      onClick={() => navigate(`/store/product/${product._id}`)}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] mb-3"
        style={{ aspectRatio: `${1 / aspectRatio}` }}
      >
        {hasImage ? (
          <>
            <img
              src={product.thumbnail}
              alt={product.title}
              onLoad={() => setImageLoaded(true)}
              className={`product-image w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-[#333333]" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions absolute bottom-7 left-4 right-4 flex gap-2 opacity-0 translate-y-4 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/store/product/${product._id}`);
            }}
            className="flex-1 py-2.5 bg-[#1a1a1a]/90 backdrop-blur-sm text-[#f0f0f0] text-[11px] tracking-[0.1em] rounded-lg font-medium hover:bg-[#333333] transition-colors"
          >
            ADD TO CART
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/store/product/${product._id}`);
            }}
            className="w-10 h-10 bg-[#1a1a1a]/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-[#f0f0f0] hover:text-[#ff5555] transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Badges — driven by real model fields */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="absolute top-3 left-3 bg-[#050505] text-[#f0f0f0] text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-md font-medium">
              NEW
            </span>
          )}
          {isBestseller && (
            <span className="absolute top-3 left-3 bg-[#c4956a] text-[#f0f0f0] text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-md font-medium">
              BESTSELLER
            </span>
          )}
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-[13px] text-[#f0f0f0] font-medium leading-snug line-clamp-2 mb-1 group-hover:text-[#d4a76a] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#f0f0f0] font-semibold">
            {product.startingPrice?.currency}{" "}
            {parseInt(product.startingPrice?.amount || 0).toLocaleString()}
          </span>
          {/* Real stats from model */}
          {product.views > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-[#555555]">
              <Eye className="w-3 h-3" />
              {product.views}
            </span>
          )}
        </div>
        {product.sales > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-[#d4a76a]" />
            <span className="text-[11px] text-[#777777]">
              {product.sales} sold
            </span>
          </div>
        )}
        {/* Tags pill (first tag only) */}
        <div className="flex gap-2">
          {product.tags?.length > 0 &&
            product.tags.map((tag) => {
              return (
                <span className="inline-block mt-1.5 text-[10px] tracking-[0.08em] text-[#d4a76a] bg-[#222222] px-2 py-0.5 rounded-sm capitalize">
                  {tag}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// ─── Product Skeleton ────────────────────────────────────────────
const ProductSkeleton = ({ index }) => {
  const heights = [280, 340, 260, 300, 320, 240, 360, 290];
  return (
    <div
      className="break-inside-avoid mb-5 opacity-0 animate-fade-in"
      style={{
        animationDelay: `${index * 0.06}s`,
        animationFillMode: "forwards",
      }}
    >
      <div
        className="rounded-2xl bg-[#151515] overflow-hidden mb-3"
        style={{ height: `${heights[index % heights.length]}px` }}
      >
        <div className="w-full h-full animate-shimmer" />
      </div>
      <div className="space-y-2 px-1">
        <div className="h-4 bg-[#1a1a1a] rounded w-3/4 animate-shimmer" />
        <div className="h-3 bg-[#1a1a1a] rounded w-1/3 animate-shimmer" />
      </div>
    </div>
  );
};

// ─── Products Section ────────────────────────────────────────────
const ProductsSection = ({ products, loading }) => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Filters now map to real model fields: tags, category, isNew (virtual), isBestseller
  const filters = [
    { value: "all", label: "All Products" },
    { value: "new", label: "New Arrivals" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "bestseller", label: "Bestsellers" },
  ];

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "new") return p.isNew;
    if (filter === "men")
      return p.category === "men" || p.tags?.includes("men");
    if (filter === "women")
      return p.category === "women" || p.tags?.includes("women");
    if (filter === "bestseller") return p.isBestseller || p.autoIsBestseller;
    return true;
  });

  return (
    <section className="py-16 bg-[#0a0a0a]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-[#d4a76a] uppercase mb-2">
              Curated For You
            </p>
            <h2 className="font-['Playfair_Display'] text-[28px] sm:text-[36px] text-[#f0f0f0] leading-tight">
              Trending Now
            </h2>
          </div>
          <button
            onClick={() => navigate("/store")}
            className="text-[12px] tracking-[0.1em] text-[#d4a76a] hover:text-[#f0f0f0] transition-colors flex items-center gap-1 font-medium"
          >
            VIEW ALL PRODUCTS <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] tracking-[0.1em] font-medium transition-all duration-300 ${
                filter === f.value
                  ? "bg-[#050505] text-[#f0f0f0] shadow-lg"
                  : "bg-[#111111] text-[#666666] hover:text-[#f0f0f0] border border-[#222222]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="masonry-grid">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} index={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-[#333333] mx-auto mb-4" />
            <h3 className="font-['Playfair_Display'] text-[20px] text-[#f0f0f0] mb-2">
              No products found
            </h3>
            <p className="text-[13px] text-[#777777]">
              Check back soon for new arrivals
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredProducts.slice(0, 12).map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ─── Featured Collection Banner ──────────────────────────────────
const FeaturedBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-[#050505]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] tracking-[0.3em] text-[#d4a76a] uppercase mb-4">
              Limited Edition
            </p>
            <h2 className="font-['Playfair_Display'] text-[32px] sm:text-[42px] text-[#f0f0f0] leading-tight mb-4">
              Summer Collection
              <br />
              2026
            </h2>
            <p className="text-[14px] text-[#aaaaaa] leading-relaxed mb-8 max-w-md">
              Embrace the warmth with our carefully curated summer essentials.
              Lightweight fabrics, breathable designs, and timeless style for
              the season ahead.
            </p>
            <button
              onClick={() => navigate("/collections/summer-2026")}
              className="group px-8 py-4 bg-[#f0f0f0] text-[#0a0a0a] text-[12px] tracking-[0.15em] rounded-xl hover:bg-[#0a0a0a] transition-all duration-300 flex items-center gap-3 font-medium"
            >
              EXPLORE COLLECTION
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-[#1a1a1a]">
                <img
                  src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=500&fit=crop"
                  alt="Summer collection"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square bg-[#1a1a1a]">
                <img
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop"
                  alt="Summer style"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="pt-8">
              <div className="rounded-2xl overflow-hidden aspect-[3/5] bg-[#1a1a1a]">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop"
                  alt="Summer fashion"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Newsletter Section ──────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <h2 className="font-['Playfair_Display'] text-[28px] sm:text-[32px] text-[#f0f0f0] mb-3">
          Join the Inner Circle
        </h2>
        <p className="text-[14px] text-[#999999] mb-8 leading-relaxed">
          Subscribe for exclusive early access to new collections, special
          offers, and style inspiration.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3.5 bg-[#111111] border border-[#222222] rounded-xl text-[14px] text-[#f0f0f0] placeholder:text-[#555555] outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all"
            required
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#050505] text-[#f0f0f0] text-[12px] tracking-[0.15em] rounded-xl hover:bg-[#1a1a1a] transition-colors font-medium whitespace-nowrap"
          >
            {subscribed ? "SUBSCRIBED!" : "SUBSCRIBE"}
          </button>
        </form>

        <p className="text-[11px] text-[#555555] mt-4">
          By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

// ─── Footer ──────────────────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Shop: ["New Arrivals", "Men", "Women", "Accessories", "Sale"],
    Help: ["Track Order", "Returns", "Shipping Info", "Size Guide", "FAQ"],
    Company: ["About Us", "Careers", "Press", "Sustainability", "Affiliates"],
    Legal: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "Accessibility",
    ],
  };

  return (
    <footer className="bg-[#050505] text-[#f0f0f0] pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] tracking-[0.2em] text-[#555555] uppercase mb-4 font-medium">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() =>
                        navigate(`/${link.toLowerCase().replace(/\s+/g, "-")}`)
                      }
                      className="text-[13px] text-[#777777] hover:text-[#f0f0f0] transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="font-['Playfair_Display'] text-[20px] tracking-[0.15em] text-[#f0f0f0]">
            SNITCH
          </h2>
          <p className="text-[11px] text-[#555555]">
            © 2026 Snitch. All rights reserved. Crafted with precision.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════
const Home = () => {
  const products = useSelector((state) => state.products.products);
  const user = useSelector((state) => state.auth?.user);

  const { handleGetAllProducts } = useProduct();
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const hasLoaded = useRef(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    async function load() {
      setLoading(true);
      try {
        await handleGetAllProducts();
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    load();
  }, [handleGetAllProducts]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageStyles />

      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products || []}
      />

      <div className="pt-16 lg:pt-20">
        <HeroSection />
      </div>

      <MarqueeBanner />
      <CategoryStrip />
      <ProductsSection products={products || []} loading={loading} />
      <FeaturedBanner />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
