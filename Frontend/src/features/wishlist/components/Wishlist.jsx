// Wishlist.jsx - Standalone Wishlist Component
import React from "react";
import { WishlistContext } from "../context/WishlistContext";
import {
  Heart,
  X,
  Trash2,
  ArrowRight,
  ShoppingCart,
  ImageIcon,
} from "lucide-react";

// ─── Wishlist Styles ───────────────────────────────────────────
const WishlistStyles = () => (
  <style>{`
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes scale-in {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// ─── Format Price Helper ───────────────────────────────────
const formatPrice = (amount, currency = "INR") => {
  if (!amount || isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

// ─── Wishlist Button (Header Trigger) ──────────────────────────
export const WishlistButton = ({ className = "" }) => {
  const { wishlistOpen, setWishlistOpen, wishlistItemCount } =
    React.useContext(WishlistContext);

  return (
    <button
      onClick={() => setWishlistOpen(true)}
      className={`relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-[#1a1a1a] bg-[#111111] text-[#555555] hover:text-[#ff5555] hover:border-[#ff5555]/30 transition-all ${className}`}
    >
      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
      {wishlistItemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ff5555] text-[#0a0a0a] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
          {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
        </span>
      )}
    </button>
  );
};

// ─── Product Thumbnail Helper ──────────────────────────────
const ProductThumbnail = ({ product, variant }) => {
  const imageUrl = variant?.images?.[0]?.url || product?.thumbnail;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={product?.title || "Product"}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#333333]" />
    </div>
  );
};

// ─── Wishlist Sidebar (Drawer) ─────────────────────────────────
export const WishlistSidebar = () => {
  const {
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    removeItem,
    wishlistItemCount,
  } = React.useContext(WishlistContext);

  if (!wishlistOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      <WishlistStyles />
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setWishlistOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-[#1a1a1a] animate-scale-in overflow-y-auto scrollbar-hide flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1a1a1a]">
          <h3 className="text-[#f0f0f0] font-semibold text-base sm:text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#ff5555]" />
            Your Wishlist ({wishlistItemCount})
          </h3>
          <button
            onClick={() => setWishlistOpen(false)}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#777777] hover:text-[#f0f0f0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#111111] flex items-center justify-center mb-4 border border-[#1a1a1a]">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#333333]" />
            </div>
            <h4 className="text-[#f0f0f0] font-medium text-sm sm:text-base mb-1">
              Your wishlist is empty
            </h4>
            <p className="text-[#555555] text-xs sm:text-sm mb-4">
              Save items you love for later
            </p>
            <button
              onClick={() => {
                setWishlistOpen(false);
                window.location.href = "/store";
              }}
              className="text-[#d4a76a] font-medium hover:text-[#f0f0f0] transition-colors text-xs sm:text-sm flex items-center gap-1"
            >
              Continue Shopping <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Wishlist Items */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 flex-1">
              {wishlist.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#111111] rounded-xl border border-[#1a1a1a] group hover:border-[#333333] transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#1a1a1a] flex-shrink-0 bg-[#0a0a0a]">
                    <ProductThumbnail product={item.product} variant={item.variant} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#f0f0f0] text-xs sm:text-sm font-medium truncate">
                      {item.product?.title || "Untitled Product"}
                    </h4>
                    {item.variant?.variantKey && (
                      <p className="text-[10px] sm:text-xs text-[#777777] mt-0.5">
                        {item.variant.variantKey}
                      </p>
                    )}
                    {item.variant?.sku && (
                      <p className="text-[10px] text-[#555555] mt-0.5">
                        SKU: {item.variant.sku}
                      </p>
                    )}
                    <p className="text-[11px] sm:text-xs text-[#d4a76a] font-medium mt-1">
                      {formatPrice(
                        item.product?.startingPrice?.amount,
                        item.product?.startingPrice?.currency
                      )}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => {
                          setWishlistOpen(false);
                          window.location.href = `/store/product/${item.product?._id}`;
                        }}
                        className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#d4a76a] hover:text-[#f0f0f0] transition-colors font-medium"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        View Product
                      </button>
                      <button
                        onClick={() =>
                          removeItem(item.product?._id, item.variant?._id)
                        }
                        className="p-1.5 text-[#555555] hover:text-[#ff5555] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[#1a1a1a] p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div className="flex justify-between text-[#aaaaaa] text-sm">
                <span>Items</span>
                <span className="font-medium">{wishlistItemCount}</span>
              </div>
              <button
                onClick={() => {
                  setWishlistOpen(false);
                  window.location.href = "/store";
                }}
                className="w-full py-2.5 sm:py-3 border border-[#1a1a1a] text-[#777777] rounded-xl font-medium text-xs sm:text-sm hover:text-[#f0f0f0] hover:border-[#333333] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Full Wishlist (Sidebar) ────────────────────────
export const Wishlist = () => {
  return (
    <>
      <WishlistSidebar />
    </>
  );
};

export default Wishlist;