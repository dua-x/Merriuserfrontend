'use client';
import Link from 'next/link';
import { CircleUserRound, Search, Menu, ShoppingCart, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { handlelog, userCart } from '@/lib/action';
import { usePathname, useRouter } from 'next/navigation';
import MeeriLogo from '@/components/MeeriLogo';
import { Facebook, Instagram } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

// Reusable Components
const NavLink = ({ href, pathname, children }: { href: string; pathname: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className={`text-sm font-medium hover:text-custom-white hover:underline hover:underline-offset-4 hover:decoration-2 transition-colors duration-200 ${pathname === href ? 'text-custom-brown' : 'text-white'}`}
  >
    {children}
  </Link>
);

const MobileLink = ({ href, children, className = '', onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`px-6 py-3 hover:bg-gray-50 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-110 transition-transform duration-200"
    aria-label={label}
  >
    {icon}
  </a>
);

const CartButton = ({ count, onClick, user }: { count: number; onClick: () => void; user: any }) => (
  <Link
    href={user ? '/Cart' : '/signin'}
    onClick={onClick}
    className="p-1 transition-all duration-200 hover:scale-110 relative focus:outline-none"
    aria-label="Cart"
  >
    <ShoppingCart className="w-6 h-6" />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-custom-beige text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </Link>
);

const UserDropdown = ({ user, router }: { user: any; router: any }) => (
  <div className="transition-all duration-300">
    <div className="p-4 border-b border-gray-100">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-custom-beige/10 flex items-center justify-center mb-2">
          <CircleUserRound className="text-gray-600 w-6 h-6" />
        </div>
        <p className="font-semibold text-gray-800">{user ? user.username : 'Guest'}</p>
        <p className="text-xs text-gray-500">{user ? user.email : 'guest@example.com'}</p>
      </div>
    </div>
    <div className="p-2">
      {user ? (
        <>
          <button
            onClick={() => router.push('/edituser')}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('authtoken');
              window.location.reload();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
          >
            Log out
          </button>
        </>
      ) : (
        <Link 
          href="/signin" 
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
        >
          Sign In
        </Link>
      )}
    </div>
  </div>
);

const MobileMenu = ({ user, cartItemCount, fetchCartData, onSearchClick }: { 
  user: any, 
  cartItemCount: number, 
  fetchCartData: () => void,
  onSearchClick: () => void 
}) => (
  <div className="flex flex-col divide-y divide-gray-100">
    <MobileLink href="/">Home</MobileLink>
    <MobileLink href={user ? '/wishlist' : '/signin'}>Wishlist</MobileLink>
    <MobileLink href="/orders">Orders</MobileLink>
    <button 
      onClick={onSearchClick}
      className="px-6 py-3 hover:bg-gray-50 transition-colors duration-200 text-left flex items-center"
    >
      <Search className="w-4 h-4 mr-2" />
      Search
    </button>
    
    <div className="px-6 py-4 flex justify-center space-x-4">
      <SocialIcon 
        href="https://www.facebook.com/people/Meeri-collection/61559554550501"
        icon={<Facebook className="w-5 h-5 text-gray-700" />}
        label="Facebook"
      />
      <SocialIcon 
        href="https://www.instagram.com/meeri__.collection"
        icon={<Instagram className="w-5 h-5 text-gray-700" />}
        label="Instagram"
      />
      <SocialIcon 
        href="https://www.tiktok.com/@meeri.collection"
        icon={<FaTiktok className="w-5 h-5 text-gray-700" />}
        label="TikTok"
      />
    </div>
  </div>
);

// Main Navbar Component
const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch cart data with error handling
  const fetchCartData = async () => {
    try {
      if (!isClient) return;
      
      const token = localStorage.getItem('authtoken');
      if (!token) {
        setCartItemCount(0);
        return;
      }
      
      const cartData = await userCart();
      const count = cartData?.ProductList?.length || 0;
      setCartItemCount(count);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItemCount(0);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial data fetch and setup
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) return;
        const userData = await handlelog();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
    fetchCartData();

    // Setup cart refresh mechanism
    const cartRefreshInterval = setInterval(fetchCartData, 30000);
    window.addEventListener('cartUpdated', fetchCartData);

    return () => {
      clearInterval(cartRefreshInterval);
      window.removeEventListener('cartUpdated', fetchCartData);
    };
  }, [isClient]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownMenu(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && 
          !(event.target instanceof SVGElement && event.target.closest('.search-icon'))) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
      setDropdownMenu(false); // Close mobile menu if open
    }
  };

  // Mobile search handler
  const handleMobileSearchClick = () => {
    setDropdownMenu(false);
    setShowSearch(true);
  };

  return (
    <>
<nav className={`fixed top-0 w-full z-50 py-3 px-6 transition-all duration-300 bg-custom-beige/90 backdrop-blur-sm text-white`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LEFT: NAVIGATION (DESKTOP) */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href={user ? '/wishlist' : '/signin'} pathname={pathname}>
              Wishlist
            </NavLink>
            <NavLink href="/orders" pathname={pathname}>
              Orders
            </NavLink>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 ml-4">
              <SocialIcon 
                href="https://www.facebook.com/people/Meeri-collection/61559554550501"
                icon={<Facebook className="w-4 h-4" />}
                label="Facebook"
              />
              <SocialIcon 
                href="https://www.instagram.com/meeri__.collection"
                icon={<Instagram className="w-4 h-4" />}
                label="Instagram"
              />
              <SocialIcon 
                href="https://www.tiktok.com/@meeri.collection"
                icon={<FaTiktok className="w-4 h-4" />}
                label="TikTok"
              />
            </div>
          </div>

          {/* CENTER: LOGO */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
              <MeeriLogo />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            className="lg:hidden p-1 transition-all duration-200 hover:scale-110 focus:outline-none"
            onClick={() => setDropdownMenu(!dropdownMenu)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center space-x-5">
            {/* Search Button */}
            <button 
              className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none search-icon"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            <CartButton 
              count={cartItemCount}
              onClick={fetchCartData}
              user={user}
            />

            <button 
              className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none"
              onClick={() => setUserDropdown(!userDropdown)}
              aria-label="User menu"
            >
              <CircleUserRound className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        {showSearch && (
          <div ref={searchRef} className="absolute top-full left-0 right-0 bg-white py-3 px-6 shadow-md animate-fadeIn">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto flex">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-custom-beige text-gray-800"
              />
              <button 
                type="submit"
                className="ml-4 bg-custom-beige text-white px-4 py-2 rounded hover:bg-[#a27a64] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {dropdownMenu && (
        <div 
          ref={dropdownRef}
          className="fixed top-16 left-0 z-50 bg-white text-gray-800 shadow-xl lg:hidden mx-4 rounded-lg overflow-hidden animate-fadeIn"
        >
          <MobileMenu 
            user={user}
            cartItemCount={cartItemCount}
            fetchCartData={fetchCartData}
            onSearchClick={handleMobileSearchClick}
          />
        </div>
      )}

      {/* USER DROPDOWN */}
      {userDropdown && (
        <div 
          ref={userDropdownRef}
          className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-xl overflow-hidden w-56 animate-fadeIn"
        >
          <UserDropdown 
            user={user}
            router={router}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;