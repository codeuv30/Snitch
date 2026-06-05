import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useProduct from "../hooks/useProduct";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Styles ───────────────────────────────────────────────────────
const PageStyles = () => (
  <style>{`
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .anim-fade-up {
      opacity: 0;
      animation: fade-up 0.6s ease-out forwards;
    }
    .anim-shimmer {
      background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { scrollbar-width: none; }
  `}</style>
);

// ─── Hero ─────────────────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&h=800&fit=crop",
      title: "New Season",
      subtitle: "Refresh your wardrobe with curated essentials",
    },
    {
      img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1400&h=800&fit=crop",
      title: "Premium Denim",
      subtitle: "Crafted for comfort, built to last",
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-[#0a0a0a]">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={s.img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center max-w-[1400px] mx-auto px-6">
        <div className="max-w-lg">
          <p className="text-[11px] tracking-[0.2em] text-[#c4956a] uppercase font-bold mb-3">
            {slides[slide].title}
          </p>
          <h1 className="font-['Playfair_Display'] text-[36px] sm:text-[48px] lg:text-[56px] text-white leading-[1.1] mb-4">
            {slides[slide].subtitle}
          </h1>
          <button
            onClick={() => navigate("/store")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] text-[12px] font-bold tracking-wider rounded-lg hover:bg-[#c4956a] transition-colors"
          >
            SHOP NOW <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`h-1 rounded-full transition-all ${
              i === slide ? "w-6 bg-[#c4956a]" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// ─── Features Bar ─────────────────────────────────────────────────
const Features = () => (
  <div className="bg-[#111] border-b border-[#1a1a1a]">
    <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-around">
      {[
        { icon: Truck, text: "Free Shipping", sub: "Orders over ₹1999" },
        { icon: Shield, text: "Secure Checkout", sub: "SSL encrypted" },
        { icon: RotateCcw, text: "Easy Returns", sub: "7 day policy" },
      ].map(({ icon: Icon, text, sub }) => (
        <div key={text} className="flex items-center gap-2.5">
          <Icon size={16} className="text-[#c4956a]" />
          <div className="hidden sm:block">
            <p className="text-[11px] text-white font-bold leading-tight">{text}</p>
            <p className="text-[10px] text-[#555]">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────
const SectionHeader = ({ label, title, action, onAction }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <p className="text-[10px] tracking-[0.2em] text-[#c4956a] uppercase font-bold mb-1">
        {label}
      </p>
      <h2 className="font-['Playfair_Display'] text-[24px] sm:text-[28px] text-white">
        {title}
      </h2>
    </div>
    {action && (
      <button
        onClick={onAction}
        className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#888] hover:text-white transition-colors"
      >
        {action} <ArrowRight size={12} />
      </button>
    )}
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group cursor-pointer anim-fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => navigate(`/store/product/${product._id}`)}
    >
      <div className="relative aspect-[3/4] bg-[#111] rounded-xl overflow-hidden mb-3 border border-[#1a1a1a] group-hover:border-[#2a2a2a] transition-colors">
        {product.thumbnail ? (
          <>
            <img
              src={product.thumbnail}
              alt={product.title}
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!loaded && <div className="absolute inset-0 anim-shimmer" />}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={24} className="text-[#222]" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-[#c4956a] text-[#0a0a0a] text-[9px] font-bold rounded">
              NEW
            </span>
          )}
          {(product.isBestseller || product.autoIsBestseller) && (
            <span className="px-2 py-0.5 bg-white text-[#0a0a0a] text-[9px] font-bold rounded flex items-center gap-1">
              <Star size={8} fill="currentColor" /> BEST
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 right-2.5 p-1.5 bg-black/40 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={12} className="text-white" />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full py-2.5 bg-white text-[#0a0a0a] text-[10px] font-bold tracking-wider rounded-lg hover:bg-[#c4956a] transition-colors">
            ADD TO CART
          </button>
        </div>
      </div>

      <div>
        <p className="text-[11px] text-[#c4956a] mb-0.5">{product.category}</p>
        <h3 className="text-[13px] text-white font-medium leading-snug line-clamp-1 mb-1 group-hover:text-[#c4956a] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-white font-bold">
            ₹{parseInt(product.startingPrice?.amount || 0).toLocaleString()}
          </span>
          {product.views > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#555]">
              <Eye size={10} /> {product.views}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Product Grid ─────────────────────────────────────────────────
const ProductGrid = ({ products, loading, title, label, filter }) => {
  const navigate = useNavigate();
  const filtered = filter ? products.filter(filter) : products;

  if (loading) {
    return (
      <section className="py-14">
        <div className="max-w-[1400px] mx-auto px-6">
          <SectionHeader label={label} title={title} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#111] rounded-xl anim-shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filtered.length === 0) return null;

  return (
    <section className="py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionHeader
          label={label}
          title={title}
          action="View All"
          onAction={() => navigate("/store")}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.slice(0, 8).map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Promo Strip ──────────────────────────────────────────────────
const PromoStrip = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#111] border border-[#1a1a1a]">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <p className="text-[10px] tracking-[0.2em] text-[#c4956a] uppercase font-bold mb-3">
                Member Exclusive
              </p>
              <h2 className="font-['Playfair_Display'] text-[28px] sm:text-[36px] text-white leading-tight mb-4">
                25% Off Your First Order
              </h2>
              <p className="text-[13px] text-[#888] mb-6 max-w-sm">
                Join the club. Get early access to drops, exclusive discounts, and style tips.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/store")}
                  className="px-5 py-2.5 bg-white text-[#0a0a0a] text-[11px] font-bold tracking-wider rounded-lg hover:bg-[#c4956a] transition-colors"
                >
                  SHOP NOW
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 border border-[#2a2a2a] text-[#888] text-[11px] font-bold tracking-wider rounded-lg hover:text-white hover:border-[#444] transition-colors"
                >
                  SIGN UP
                </button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=600&fit=crop"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────
const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] pt-12 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-['Playfair_Display'] text-[18px] text-white mb-3">SNITCH</h3>
            <p className="text-[11px] text-[#555] leading-relaxed mb-4">
              Premium fashion for the modern individual. Designed in India, worn worldwide.
            </p>
          </div>
          {[
            { title: "Shop", links: ["New Arrivals", "Men", "Women", "Sale"] },
            { title: "Support", links: ["Contact", "Shipping", "Returns", "FAQ"] },
            { title: "Company", links: ["About", "Careers", "Press", "Sustainability"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] tracking-[0.15em] text-[#555] uppercase font-bold mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => navigate(`/${link.toLowerCase().replace(/\s+/g, "-")}`)}
                      className="text-[11px] text-[#777] hover:text-white transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-[#444]">© 2026 Snitch. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <button key={t} className="text-[10px] text-[#444] hover:text-[#777] transition-colors">
                {t}
              </button>
            ))}
          </div>
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
  const hasLoaded = useRef(false);

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
        setTimeout(() => setLoading(false), 600);
      }
    }
    load();
  }, [handleGetAllProducts]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <PageStyles />

      <Navbar isLoggedIn={!!user} user={user} />

      <Hero />
      <Features />

      <ProductGrid
        products={products || []}
        loading={loading}
        title="Trending Now"
        label="Popular"
        filter={(p) => p.isBestseller || p.autoIsBestseller || p.views > 30}
      />

      <ProductGrid
        products={products || []}
        loading={loading}
        title="New Arrivals"
        label="Fresh Drops"
        filter={(p) => p.isNew}
      />

      <PromoStrip />

      <ProductGrid
        products={products || []}
        loading={loading}
        title="All Products"
        label="Browse"
      />

      <Footer />
    </div>
  );
};

export default Home;