import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useProduct from "../hooks/useProduct";
import {
  ShoppingBag, ArrowRight, Heart, Star, Search, X, SlidersHorizontal
} from "lucide-react";
import Navbar from "../components/Navbar";

const Keyframes = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `}</style>
);

/* ─── Hero — single reliable image ──────────────────────── */
function Hero() {
  const nav = useNavigate();

  return (
    <section className="relative h-[80vh] min-h-[480px] bg-[#0a0a0c] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&h=900&fit=crop&q=80"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.35]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,12,0.3)] via-[rgba(10,10,12,0.4)] to-[rgba(10,10,12,0.95)]" />

      <div className="relative z-[2] h-full flex flex-col justify-end max-w-[1200px] mx-auto px-8 md:px-12 pb-20">
        <div style={{ animation: "fadeUp 0.7s ease both" }}>
          <p className="text-[10px] font-semibold text-[#d4a853] tracking-[0.25em] uppercase mb-5">
            Spring / Summer 2026
          </p>
          <h1 className="font-[Playfair_Display] text-[clamp(36px,5vw,56px)] font-semibold text-white leading-[1.05] mb-5 -tracking-[0.02em]">
            The New Season Edit
          </h1>
          <p className="text-sm text-white/45 leading-relaxed mb-10 max-w-[360px]">
            Premium fabrics and contemporary cuts for the modern wardrobe.
          </p>
          <button
            onClick={() => nav("/store")}
            className="bg-[#d4a853] text-[#0a0a0c] font-semibold text-[11px] tracking-[0.12em] uppercase px-8 py-3.5 rounded-md hover:bg-[#e4c06d] transition-colors duration-200 inline-flex items-center gap-2"
          >
            Shop Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Search Bar — works from navbar too ────────────────── */
function SearchBar({ searchOpen, setSearchOpen }) {
  const [query, setQuery] = useState("");
  const nav = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      nav(`/store?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="bg-[#0a0a0c] border-b border-[#1a1a1d]" style={{ animation: "fadeUp 0.3s ease both" }}>
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 py-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a3a40]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full bg-[#141418] border border-[#1a1a1d] rounded-xl py-3 pl-11 pr-10 text-sm text-[#e8e8ec] placeholder:text-[#3a3a40] outline-none focus:border-[#d4a853]/30 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3a40] hover:text-[#e8e8ec]"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#d4a853] text-[#0a0a0c] font-semibold text-[11px] tracking-[0.12em] uppercase px-6 py-3 rounded-xl hover:bg-[#e4c06d] transition-colors flex items-center gap-2"
          >
            <Search size={14} /> Search
          </button>
          <button
            type="button"
            onClick={() => nav("/store")}
            className="text-[#6a6a70] border border-[#1a1a1d] font-medium text-[11px] tracking-wider uppercase px-4 py-3 rounded-xl hover:border-[#d4a853]/30 hover:text-[#d4a853] transition-all flex items-center gap-2"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Category Pills — filter on page, no redirect ──────── */
const CAT_PILLS = ["All", "Shirts", "T-Shirts", "Denim", "Jackets", "Polos"];

function CategoryPills({ active, setActive }) {
  return (
    <div className="bg-[#0a0a0c] border-b border-[#1a1a1d]">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
          {CAT_PILLS.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 border ${
                active === cat
                  ? "bg-[#d4a853] text-[#0a0a0c] border-[#d4a853]"
                  : "bg-transparent text-[#6a6a70] border-[#2a2a2e] hover:border-[#3a3a3e] hover:text-[#8a8a90]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Section Header ────────────────────────────────────── */
function SectionHeader({ eyebrow, title }) {
  return (
    <div className="mb-10">
      <p className="text-[10px] font-semibold text-[#d4a853] tracking-[0.2em] uppercase mb-2">
        {eyebrow}
      </p>
      <h2 className="font-[Playfair_Display] text-[clamp(22px,2.5vw,30px)] font-semibold text-[#e8e8ec] leading-[1.1]">
        {title}
      </h2>
    </div>
  );
}

/* ─── Product Card ──────────────────────────────────────── */
function ProductCard({ product, index = 0 }) {
  const nav = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount = product.originalPrice && product.startingPrice
    ? Math.round(((product.originalPrice - product.startingPrice.amount) / product.originalPrice) * 100)
    : 0;

  const goToProduct = () => nav(`/store/product/${product._id}`);

  return (
    <div
      className="cursor-pointer group"
      style={{ animation: `fadeUp 0.6s ease both ${index * 0.06}s` }}
      onClick={goToProduct}
    >
      <div className="relative aspect-[3/4] bg-[#141418] overflow-hidden rounded-xl mb-3.5">
        {product.thumbnail ? (
          <>
            <img
              src={product.thumbnail}
              alt={product.title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"} group-hover:scale-105`}
            />
            {!imgLoaded && (
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(90deg, #141418 25%, #1c1c20 50%, #141418 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease infinite",
                }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={24} className="text-[#2a2a2e]" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-[3px] rounded bg-[#d4a853] text-[#0a0a0c] text-[8px] font-bold tracking-[0.1em] uppercase">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-[3px] rounded bg-[#1a3a2a] text-[#6ab888] text-[8px] font-bold tracking-[0.1em] uppercase">
              -{discount}%
            </span>
          )}
        </div>

        <button
          onClick={goToProduct}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/[0.06] flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Heart size={13} className="text-white/80" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={goToProduct}
            className="w-full bg-[#d4a853] text-[#0a0a0c] font-semibold text-[10px] tracking-[0.12em] uppercase py-2.5 rounded-lg hover:bg-[#e4c06d] transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={12} /> Add to Bag
          </button>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-[#d4a853] tracking-[0.12em] uppercase mb-1">
          {product.category}
        </p>
        <h3 className="text-[13px] font-medium text-[#c8c8cc] leading-snug mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-semibold text-[#e8e8ec]">
            ₹{parseInt(product.startingPrice?.amount || 0).toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#4a4a50] line-through">
              ₹{parseInt(product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Star size={10} className="text-[#d4a853] fill-[#d4a853]" />
          <span className="text-[10px] text-[#5a5a60]">4.8</span>
          <span className="text-[10px] text-[#3a3a40]">(124)</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Grid ──────────────────────────────────────── */
function ProductGrid({ products, loading, eyebrow, title, filter, limit = 8 }) {
  const filtered = filter ? (products || []).filter(filter) : (products || []);

  return (
    <section className="bg-[#0a0a0c] py-20">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        <SectionHeader eyebrow={eyebrow} title={title} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl"
                  style={{
                    background: "linear-gradient(90deg, #141418 25%, #1c1c20 50%, #141418 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease infinite",
                  }}
                />
              ))
            : filtered.slice(0, limit).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))
          }
        </div>
      </div>
    </section>
  );
}

/* ─── Minimal Footer ────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#0a0a0c] border-t border-[#1a1a1d] py-10">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 flex justify-between items-center flex-wrap gap-4">
        <p className="text-[10px] text-[#2a2a30]">© 2026 Snitch</p>
        <p className="text-[10px] text-[#2a2a30]">Premium fashion. Designed in India.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const products = useSelector(s => s.products.products);
  const user = useSelector(s => s.auth?.user);
  const { handleGetAllProducts } = useProduct();
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    (async () => {
      try { await handleGetAllProducts(); }
      catch (e) { console.error(e); }
      finally { setTimeout(() => setLoading(false), 400); }
    })();
  }, [handleGetAllProducts]);

  const prods = products || [];

  // Category filter
  const getFiltered = (baseFilter) => {
    let filtered = baseFilter ? prods.filter(baseFilter) : [...prods];
    if (activeCategory !== "All") {
      filtered = filtered.filter(p =>
        p.category?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Keyframes />
      <Navbar isLoggedIn={!!user} user={user} onSearchOpen={() => setSearchOpen(s => !s)} />
      <Hero />
      <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
      <CategoryPills active={activeCategory} setActive={setActiveCategory} />

      <ProductGrid
        products={getFiltered(p => p.isBestseller || p.autoIsBestseller || p.views > 30)}
        loading={loading}
        eyebrow="Trending"
        title="Best Sellers"
        limit={8}
      />

      <ProductGrid
        products={getFiltered(p => p.isNew)}
        loading={loading}
        eyebrow="New"
        title="Just Dropped"
        limit={8}
      />

      <ProductGrid
        products={getFiltered()}
        loading={loading}
        eyebrow="All"
        title="The Collection"
        limit={12}
      />

      <Footer />
    </div>
  );
}