'use client';
import Link from 'next/link';
import { CircleUserRound, Search, Menu, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { handlelog, userCart } from '@/lib/action';
import { usePathname, useRouter } from 'next/navigation';
import MeeriLogo from '@/components/MeeriLogo';

const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [cart, setCart] = useState<{ ProductList: any[] } | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

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

        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                if (!token) return;
                const cartData = await userCart();
                setCart(cartData);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        };

        fetchUser();
        fetchCart();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownMenu(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="sticky top-0 z-50 py-10 px-4 py-2 shadow-md bg-custom-beige/90 backdrop-blur-sm text-white flex items-center justify-between">
                {/* LEFT: NAVIGATION (VISIBLE ON LARGE SCREENS) */}
                <div className="hidden lg:flex gap-4">
                    <Link href="/" className={`relative group ${pathname === '/' ? 'text-white' : 'text-gray-100'} transition-colors duration-300`}>
                        Home
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href={user ? '/wishlist' : '/signin'} className="relative group text-gray-100 hover:text-white transition-colors duration-300">
                        Wishlist
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href={user ? '/orders' : '/signin'} className="relative group text-gray-100 hover:text-white transition-colors duration-300">
                        Orders
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </div>

                {/* CENTER: LOGO */}
                
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center pt-2 gap-2 hover:scale-105 transition-transform duration-200">
                        <MeeriLogo />
                    </Link>
                
                    {/* MOBILE MENU BUTTON */}
                    <Menu className="cursor-pointer lg:hidden transition-transform duration-200 hover:scale-110" onClick={() => setDropdownMenu(!dropdownMenu)} />

                {/* RIGHT: SEARCH, CART, PROFILE */}
                <div className="flex gap-3 items-center">
                    {/* SEARCH (ALWAYS ON THE RIGHT) */}
                    <Search className="cursor-pointer transition-transform duration-200 hover:scale-110" />

                    {/* CART */}
                    <div className="hidden lg:flex">
                        <Link href={user ? '/Cart' : '/signin'} className="flex items-center gap-1 border border-white/50 rounded-md px-2 py-1 hover:bg-white hover:text-black transition-all duration-300">
                            <ShoppingCart />
                            <p className="text-sm">Cart ({cart?.ProductList?.length || 0})</p>
                        </Link>
                    </div>

                    {/* PROFILE BUTTON (ALWAYS ON RIGHT) */}
                    <button className="cursor-pointer p-1 transition-transform duration-200 hover:scale-110" onClick={() => setUserDropdown(!userDropdown)}>
                        <CircleUserRound />
                    </button>
                </div>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {dropdownMenu && (
                <div ref={dropdownRef} className="fixed top-[60px] left-5 z-50 flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold lg:hidden shadow-xl transition-transform duration-300">
                    <Link href="/" className="hover:text-custom-beige transition-colors duration-300">
                        Home
                    </Link>
                    <Link href={user ? '/wishlist' : '/signin'} className="hover:text-custom-beige transition-colors duration-300">
                        Wishlist
                    </Link>
                    <Link href={user ? '/orders' : '/signin'} className="hover:text-custom-beige transition-colors duration-300">
                        Orders
                    </Link>
                    <Link href={user ? '/Cart' : '/signin'} className="flex items-center gap-1 border rounded-md px-2 py-1 hover:bg-custom-beige hover:text-white transition-colors duration-300">
                        <ShoppingCart />
                        <p className="text-sm">Cart ({cart?.ProductList?.length || 0})</p>
                    </Link>
                </div>
            )}

            {/* USER PROFILE DROPDOWN */}
            {userDropdown && (
                <div ref={userDropdownRef} className="fixed top-[72px] right-0 z-50 flex flex-col gap-2 p-4 w-56 rounded-lg border bg-white shadow-xl transition-transform duration-300">
                    <div className="flex flex-col items-center text-center">
                        <CircleUserRound className="text-gray-600 w-12 h-12 mb-2" />
                        <p className="font-semibold">{user ? user.username : 'Guest'}</p>
                        <p className="text-sm text-gray-500">{user ? user.email : 'guest@example.com'}</p>
                    </div>
                    {user ? (
                        <>
                            <button
  onClick={() => {
    localStorage.removeItem('authtoken');
    window.location.reload(); // Full page reload to reset all client-side state
  }}
  className="mt-3 text-center bg-custom-beige text-white py-1 rounded-lg hover:bg-[#a27a64] transition-colors duration-300"
>
  Log out
</button>

                            <button onClick={() => router.push('/edituser')} className="mt-3 text-center bg-custom-beige text-white py-1 rounded-lg hover:bg-[#a27a64] transition-colors duration-300">
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <Link href="/signin" className="mt-3 text-center bg-custom-beige hover:bg-[#a27a64] text-white py-1 rounded-lg transition-colors duration-300">
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
