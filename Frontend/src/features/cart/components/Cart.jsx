// Cart.jsx - Standalone Cart Component (No Login Required)
import React from "react";
import { CartContext } from "../context/CartContext";
import {
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ImageIcon,
} from "lucide-react";

// ─── Cart Styles ───────────────────────────────────────────
const CartStyles = () => (
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

// ─── Cart Button (Header Trigger) ──────────────────────────
export const CartButton = ({ className = "" }) => {
  const { cartOpen, setCartOpen, cartItemCount } =
    React.useContext(CartContext);

  return (
    <button
      onClick={() => setCartOpen(true)}
      className={`relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-[#1a1a1a] bg-[#111111] text-[#555555] hover:text-[#f0f0f0] hover:border-[#333333] transition-all ${className}`}
    >
      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#d4a76a] text-[#0a0a0a] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
          {cartItemCount > 99 ? "99+" : cartItemCount}
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

// ─── Cart Sidebar (Drawer) ─────────────────────────────────
export const CartSidebar = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    cartTotal,
    cartItemCount,
  } = React.useContext(CartContext);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      <CartStyles />
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-[#1a1a1a] animate-slide-up sm:animate-scale-in overflow-y-auto scrollbar-hide flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1a1a1a]">
          <h3 className="text-[#f0f0f0] font-semibold text-base sm:text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#d4a76a]" />
            Your Cart ({cartItemCount})
          </h3>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#777777] hover:text-[#f0f0f0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#111111] flex items-center justify-center mb-4 border border-[#1a1a1a]">
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-[#333333]" />
            </div>
            <h4 className="text-[#f0f0f0] font-medium text-sm sm:text-base mb-1">
              Your cart is empty
            </h4>
            <p className="text-[#555555] text-xs sm:text-sm mb-4">
              Add some products to get started
            </p>
            <button
              onClick={() => {
                setCartOpen(false);
                window.location.href = "/store";
              }}
              className="text-[#d4a76a] font-medium hover:text-[#f0f0f0] transition-colors text-xs sm:text-sm flex items-center gap-1"
            >
              Continue Shopping <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 flex-1">
              {cart.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#111111] rounded-xl border border-[#1a1a1a]"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[#1a1a1a] flex-shrink-0 bg-[#0a0a0a]">
                    <ProductThumbnail
                      product={item.product}
                      variant={item.variant}
                    />
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
                    {item.price.amount > item.variant.price.amount ? (
                      <div className="flex gap-2">
                        <p className="text-[11px] sm:text-xs text-[#b6b6b6] font-medium mt-1 line-through">
                          {formatPrice(
                            item.price?.amount,
                            item.price?.currency,
                          )}
                        </p>
                        <p className="text-[11px] sm:text-xs text-[#d4a76a] font-medium mt-1">
                          {formatPrice(
                            item.variant.price?.amount,
                            item.variant.price?.currency,
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] sm:text-xs text-[#d4a76a] font-medium mt-1">
                        {formatPrice(item.price?.amount, item.price?.currency)}
                      </p>
                    )}

                    {item.price.amount > item.variant.price.amount && (
                      <>
                        <p className="text-[11px] sm:text-xs text-green-400 font-medium mt-0.5">You are saving {formatPrice((item.price?.amount - item.variant.price?.amount), item.variant.price?.currency)} on this item.</p>
                      </>
                    )}

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#1a1a1a] rounded-lg bg-[#0a0a0a]">
                        <button
                          onClick={() =>
                            decrementQuantity(
                              item.product._id,
                              item.variant?._id,
                            )
                          }
                          className="px-2 sm:px-3 py-1 text-[#777777] hover:text-[#f0f0f0] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 sm:px-3 py-1 text-[#f0f0f0] text-xs font-medium border-x border-[#1a1a1a] min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            incrementQuantity(
                              item.product._id,
                              item.variant?._id,
                            )
                          }
                          className="px-2 sm:px-3 py-1 text-[#777777] hover:text-[#f0f0f0] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.product._id, item.variant?._id)
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

            {/* Footer - Totals + Checkout */}
            <div className="border-t border-[#1a1a1a] p-4 sm:p-5 space-y-3 sm:space-y-4">
              <div className="flex justify-between text-[#aaaaaa] text-sm">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatPrice(cartTotal, "INR")}
                </span>
              </div>
              <div className="flex justify-between text-[#f0f0f0] text-base sm:text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal, "INR")}</span>
              </div>
              <button className="w-full py-3 sm:py-4 bg-[#f0f0f0] text-[#0a0a0a] rounded-xl font-semibold text-sm sm:text-base hover:bg-[#d4a76a] transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Proceed to Checkout
              </button>
              <button
                onClick={() => {
                  setCartOpen(false);
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

// ─── Full Cart (Sidebar) ────────────────────────
export const Cart = () => {
  return (
    <>
      <CartSidebar />
    </>
  );
};

export default Cart;
