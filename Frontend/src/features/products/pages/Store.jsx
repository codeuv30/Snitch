// Store.jsx
import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router';
import useProduct from '../hooks/useProduct'
import { useSelector } from 'react-redux';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  Eye,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Tag,
  X,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

const PageStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .animate-fade-in-up { 
      animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
    }
    .animate-shimmer {
      background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .product-card-hover:hover .product-image {
      transform: scale(1.05);
    }
    .product-card-hover:hover .quick-actions {
      opacity: 1;
      transform: translateY(0);
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

const Store = () => {
  const navigate = useNavigate();
  const { handleGetAllProducts } = useProduct();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlisted, setWishlisted] = useState(new Set());
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await handleGetAllProducts();
      setTimeout(() => setLoading(false), 600);
    }
    load();
  }, [handleGetAllProducts]);

  const products = useSelector((state) => state.products.products) || [];

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (priceRange.min) {
      result = result.filter(p => Number(p.price?.amount) >= Number(priceRange.min) * 100);
    }
    if (priceRange.max) {
      result = result.filter(p => Number(p.price?.amount) <= Number(priceRange.max) * 100);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => Number(a.price?.amount) - Number(b.price?.amount));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.price?.amount) - Number(a.price?.amount));
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'bestselling':
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  const toggleWishlist = (productId, e) => {
    e?.stopPropagation();
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(Number(amount) / 100);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceRange.min || priceRange.max;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <PageStyles />
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-6 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl overflow-hidden bg-[#111111] border border-[#1a1a1a]">
                <div className="aspect-[3/4] bg-[#151515] animate-shimmer" />
                <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-[#1a1a1a] rounded animate-shimmer w-3/4" />
                  <div className="h-2.5 sm:h-3 bg-[#1a1a1a] rounded animate-shimmer w-1/2" />
                  <div className="h-6 sm:h-8 bg-[#1a1a1a] rounded animate-shimmer w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <PageStyles />

      {/* Header */}
      <div className="bg-[#050505] border-b border-[#1a1a1a] sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] font-['Playfair_Display'] tracking-wide">Store</h1>
              <span className="bg-[#1a1a1a] text-[#777777] text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full border border-[#222222]">
                {filteredProducts.length}
              </span>
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#555555] group-focus-within:text-[#d4a76a] transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-[#111111] border border-[#1a1a1a] rounded-lg sm:rounded-xl text-[#f0f0f0] placeholder-[#555555] focus:outline-none focus:border-[#d4a76a]/30 focus:ring-1 focus:ring-[#d4a76a]/20 transition-all text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#f0f0f0] transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all ${
                  showFilters ? 'bg-[#d4a76a]/10 border-[#d4a76a]/30 text-[#d4a76a]' : 'bg-[#111111] border-[#1a1a1a] text-[#777777]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="hidden sm:flex items-center border border-[#1a1a1a] rounded-xl bg-[#111111] overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-[#f0f0f0]' : 'text-[#555555] hover:text-[#777777]'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-[#1a1a1a] text-[#f0f0f0]' : 'text-[#555555] hover:text-[#777777]'}`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#111111] border border-[#1a1a1a] rounded-lg sm:rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[#aaaaaa] focus:outline-none focus:border-[#d4a76a]/30 cursor-pointer hover:border-[#222222] transition-colors"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="popular">Popular</option>
                  <option value="bestselling">Best Selling</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#555555] pointer-events-none" />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-2 sm:mt-3 flex-wrap">
              <span className="text-xs sm:text-sm text-[#555555]">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#d4a76a]/10 text-[#d4a76a] text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full border border-[#d4a76a]/20">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-[#f0f0f0]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-[#d4a76a]/10 text-[#d4a76a] text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full border border-[#d4a76a]/20">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-[#f0f0f0]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="inline-flex items-center gap-1 bg-[#d4a76a]/10 text-[#d4a76a] text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-full border border-[#d4a76a]/20">
                  ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                  <button onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-[#f0f0f0]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="text-xs sm:text-sm text-[#ff5555] hover:text-[#ff7777] font-medium ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-10 py-4 sm:py-8">
        <div className="flex gap-4 sm:gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-[#050505] rounded-xl sm:rounded-2xl border border-[#1a1a1a] p-4 sm:p-6 sticky top-20 sm:top-24">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="font-semibold text-[#f0f0f0] flex items-center gap-2 text-sm tracking-wide">
                  <Filter className="w-4 h-4 text-[#d4a76a]" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-[#ff5555] hover:text-[#ff7777] font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs font-medium text-[#777777] uppercase tracking-wider mb-2 sm:mb-3">Categories</h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all capitalize ${
                        selectedCategory === cat
                          ? 'bg-[#d4a76a]/10 text-[#d4a76a] font-medium border border-[#d4a76a]/20'
                          : 'text-[#aaaaaa] hover:bg-[#111111] hover:text-[#f0f0f0]'
                      }`}
                    >
                      {cat === 'all' ? 'All Products' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs font-medium text-[#777777] uppercase tracking-wider mb-2 sm:mb-3">Price Range (₹)</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-xs sm:text-sm text-[#f0f0f0] placeholder-[#555555] focus:outline-none focus:border-[#d4a76a]/30 transition-colors"
                  />
                  <span className="text-[#555555]">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-xs sm:text-sm text-[#f0f0f0] placeholder-[#555555] focus:outline-none focus:border-[#d4a76a]/30 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-[#1a1a1a]">
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between text-[#777777]">
                    <span>Total Products</span>
                    <span className="font-medium text-[#f0f0f0]">{products.length}</span>
                  </div>
                  <div className="flex justify-between text-[#777777]">
                    <span>New Arrivals</span>
                    <span className="font-medium text-emerald-400">
                      {products.filter(p => p.isNew).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#777777]">
                    <span>Bestsellers</span>
                    <span className="font-medium text-[#d4a76a]">
                      {products.filter(p => p.isBestseller).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#050505] rounded-xl sm:rounded-2xl border border-[#1a1a1a] p-8 sm:p-12 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-[#1a1a1a]">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#555555]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-[#f0f0f0] mb-1 sm:mb-2">No products found</h3>
                <p className="text-[#777777] mb-3 sm:mb-4 text-xs sm:text-sm">Try adjusting your search or filters</p>
                <button 
                  onClick={clearFilters}
                  className="text-[#d4a76a] font-medium hover:text-[#f0f0f0] transition-colors text-xs sm:text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6' 
                  : 'flex flex-col gap-3 sm:gap-4'
                }
              `}>
                {filteredProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className={`group product-card-hover cursor-pointer opacity-0 animate-fade-in-up bg-[#050505] rounded-xl sm:rounded-2xl border border-[#1a1a1a] overflow-hidden hover:border-[#222222] hover:shadow-2xl hover:shadow-black/50 transition-all duration-500 ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                    }`}
                    style={{ animationDelay: `${Math.min(index * 0.05, 1)}s`, animationFillMode: "forwards" }}
                    onClick={() => navigate(`/store/product/${product._id}`)}
                  >
                    <div className={`relative overflow-hidden bg-[#111111] ${viewMode === 'list' ? 'sm:w-80 flex-shrink-0' : 'aspect-[3/4]'}`}>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]?.url || product.images[0]}
                          alt={product.title}
                          className="product-image w-full h-full object-cover transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#333333]">
                          <Tag className="w-8 h-8 sm:w-12 sm:h-12" />
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                        {product.isNew && (
                          <span className="bg-[#050505] text-[#f0f0f0] text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded font-medium border border-[#1a1a1a]">
                            NEW
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-[#c4956a] text-[#f0f0f0] text-[8px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded font-medium flex items-center gap-0.5 sm:gap-1">
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
                            HOT
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleWishlist(product._id, e)}
                        className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all ${
                          wishlisted.has(product._id)
                            ? 'bg-[#ff5555]/20 text-[#ff5555] border border-[#ff5555]/30'
                            : 'bg-[#050505]/80 backdrop-blur-sm text-[#777777] hover:text-[#ff5555] border border-[#1a1a1a]'
                        }`}
                      >
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${wishlisted.has(product._id) ? 'fill-current' : ''}`} />
                      </button>

                      {viewMode === 'grid' && (
                        <div className="quick-actions absolute inset-x-0 bottom-0 p-2 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="w-full bg-[#f0f0f0] text-[#0a0a0a] py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-[11px] tracking-[0.1em] flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#d4a76a] transition-colors shadow-lg"
                          >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            ADD TO CART
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 sm:p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-medium text-[#d4a76a] uppercase tracking-[0.1em] sm:tracking-[0.15em]">
                            {product.category}
                          </span>
                          <h3 className="font-medium text-[#f0f0f0] mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 group-hover:text-[#d4a76a] transition-colors text-xs sm:text-[15px] leading-snug">
                            {product.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[11px] sm:text-[13px] text-[#777777] line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 flex-1 leading-relaxed hidden sm:block">
                        {product.description || 'No description available'}
                      </p>

                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-4">
                        {product.tags?.slice(0, 2).map(tag => (
                          <span 
                            key={tag} 
                            className="text-[9px] sm:text-[10px] bg-[#111111] text-[#777777] px-1.5 sm:px-2 py-0.5 rounded border border-[#1a1a1a] capitalize tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags?.length > 2 && (
                          <span className="text-[9px] sm:text-[10px] text-[#555555] px-0.5 sm:px-1">+{product.tags.length - 2}</span>
                        )}
                      </div>

                      <div className="flex items-end justify-between pt-2 sm:pt-4 border-t border-[#1a1a1a]">
                        <div>
                          <span className="text-sm sm:text-xl font-bold text-[#f0f0f0]">
                            {formatPrice(product.price?.amount, product.price?.currency)}
                          </span>
                          {product.sales > 0 && (
                            <p className="text-[10px] sm:text-[11px] text-[#555555] mt-0.5 sm:mt-1">{product.sales} sold</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5 sm:gap-3 text-[#555555]">
                          <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px]">
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {product.views || 0}
                          </span>
                        </div>
                      </div>

                      {viewMode === 'list' && (
                        <div className="flex gap-2 mt-3 sm:mt-4">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-[#f0f0f0] text-[#0a0a0a] py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-[11px] tracking-[0.1em] flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#d4a76a] transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            ADD TO CART
                          </button>
                          <button 
                            onClick={(e) => toggleWishlist(product._id, e)}
                            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all ${
                              wishlisted.has(product._id)
                                ? 'bg-[#ff5555]/10 border-[#ff5555]/30 text-[#ff5555]'
                                : 'border-[#1a1a1a] text-[#555555] hover:text-[#ff5555]'
                            }`}
                          >
                            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlisted.has(product._id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;