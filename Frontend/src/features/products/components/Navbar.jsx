import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  ChevronRight,
} from "lucide-react";
import { useCartUI } from "../../cart/context/CartContext";
import { CartSidebar } from "../../cart/components/Cart";
import { WishlistSidebar } from "../../wishlist/components/Wishlist";
import { useWishlistUI } from "../../wishlist/context/WishlistContext";
import UserDetailsModal from "../../auth/components/UserDetailsModal";

const Navbar = ({ isLoggedIn, user, onSearchOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { setCartOpen, cartItemCount } = useCartUI();
  const { setWishlistOpen } = useWishlistUI();

  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "MEN", href: "/store/category/men" },
    { label: "WOMEN", href: "/store/category/women" },
    { label: "NEW ARRIVALS", href: "/store/new-arrivals" },
    { label: "COLLECTIONS", href: "/store/collections" },
    ...(user?.role === "seller"
      ? [{ label: "DASHBOARD", href: "/seller/dashboard" }]
      : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md shadow-sm]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mr-10"
            >
              <h1 className="font-['Playfair_Display'] text-[22px] sm:text-[26px] tracking-[0.15em] text-[#f0f0f0] font-bold">
                SNITCH
              </h1>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[11px] tracking-[0.15em] text-[#f0f0f0] hover:text-[#d4a76a] transition-colors font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#8B6F5A] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onSearchOpen}
                className="w-9 h-9 flex items-center justify-center text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-full transition-all duration-200"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <button
                onClick={() => setWishlistOpen(true)}
                className="w-9 h-9 hidden sm:flex items-center justify-center text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-full transition-all duration-200"
              >
                <Heart className="w-[18px] h-[18px]" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="w-9 h-9 flex items-center justify-center text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-full transition-all duration-200 relative"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#050505] text-[#f0f0f0] text-[9px] rounded-full flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>

              {isLoggedIn && user ? (
                <button
                  onClick={() => setShowUserDetails(true)}
                  className="w-9 h-9 hidden sm:flex items-center justify-center text-[#f0f0f0] hover:bg-[#1a1a1a] rounded-full transition-all duration-200"
                >
                  <User className="w-[18px] h-[18px]" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[11px] tracking-[0.1em] text-[#f0f0f0] hover:text-[#d4a76a] transition-colors font-medium px-3 py-1.5"
                  >
                    LOGIN
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="text-[11px] tracking-[0.1em] bg-[#050505] text-[#f0f0f0] px-4 py-2 rounded-lg hover:text-[#d4a76a] transition-colors font-medium"
                  >
                    REGISTER
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-[#0a0a0a] border-b border-[#151515] p-6 animate-fade-in-up shadow-lg">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[13px] tracking-[0.1em] text-[#f0f0f0] hover:text-[#d4a76a] transition-colors py-2 border-b border-[#151515] flex items-center justify-between"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-[#555555]" />
                </Link>
              ))}
              {!isLoggedIn && (
                <div className="flex gap-3 mt-4 pt-2">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-3 border border-[#1a1a1a] text-[#f0f0f0] text-[12px] tracking-[0.1em] rounded-lg font-medium"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-3 bg-[#050505] text-[#f0f0f0] text-[12px] tracking-[0.1em] rounded-lg font-medium"
                  >
                    REGISTER
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && user && (
        <UserDetailsModal
          user={user}
          onClose={() => setShowUserDetails(false)}
        />
      )}
      <CartSidebar />
      <WishlistSidebar />
    </>
  );
};

export default Navbar;
