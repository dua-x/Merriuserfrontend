'use client';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound, Search, Menu, ShoppingCart, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { handlelog, userCart } from '@/lib/action';
import { usePathname, useRouter } from 'next/navigation';
import MeeriLogo from '@/components/MeeriLogo';

const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [cart, setCart] = useState<{ ProductList: any[] } | null>(null);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [query, setQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            localStorage.setItem('authtoken', '');
            router.push('/');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

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

    // Fermer les menus déroulants au clic en dehors
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
            <div
                className="
          sticky top-0 z-50 px-4 py-2 shadow-md
          flex justify-between items-center
          bg-custom-beige/90 backdrop-blur-sm
          text-white transition-all duration-300 ease-out
        "
            >
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                    <MeeriLogo />
                </Link>

                {/* LIENS DE NAVIGATION (DESKTOP) */}
                <div className="hidden lg:flex gap-4">
                    <Link
                        href="/"
                        className={`
              relative group 
              ${pathname === '/' ? 'text-white' : 'text-gray-100'} 
              transition-colors duration-300
            `}
                    >
                        Home
                        <span
                            className="
                absolute left-0 -bottom-1 w-0 h-[2px] bg-white
                group-hover:w-full transition-all duration-300
              "
                        ></span>
                    </Link>
                    <Link
                        href={user ? '/wishlist' : '/signin'}
                        className="
              relative group 
              text-gray-100 hover:text-white 
              transition-colors duration-300
            "
                    >
                        Wishlist
                        <span
                            className="
                absolute left-0 -bottom-1 w-0 h-[2px] bg-white
                group-hover:w-full transition-all duration-300
              "
                        ></span>
                    </Link>
                    <Link
                        href={user ? '/orders' : '/signin'}
                        className="
              relative group 
              text-gray-100 hover:text-white 
              transition-colors duration-300
            "
                    >
                        Orders
                        <span
                            className="
                absolute left-0 -bottom-1 w-0 h-[2px] bg-white
                group-hover:w-full transition-all duration-300
              "
                        ></span>
                    </Link>
                </div>

                {/* BARRE DE RECHERCHE (DESKTOP) */}
                <div className="hidden lg:flex items-center gap-2 border border-white/50 px-2 py-1 rounded-md transition-all duration-300">
                    <input
                        className="bg-transparent border-none w-full outline-none text-white placeholder-white/80"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button disabled={query === ''} onClick={() => router.push(`/search/${query}`)}>
                        <Search className="cursor-pointer h-4 w-4 hover:text-red-200 transition-colors duration-300" />
                    </button>
                </div>

                {/* ICONES (DROITE) */}
                <div className="flex gap-2 items-center">
                    {/* ICONE DE RECHERCHE MOBILE */}
                    <Search
                        className="cursor-pointer lg:hidden transition-transform duration-200 hover:scale-110"
                        onClick={() => setShowSearchModal(true)}
                    />

                    {/* PANIER (DESKTOP) */}
                    <div className="hidden lg:flex">
                        <Link
                            href={user ? '/Cart' : '/signin'}
                            className="
                flex items-center gap-1 border border-white/50 
                rounded-md px-2 py-1 hover:bg-white hover:text-black
                transition-all duration-300
              "
                        >
                            <ShoppingCart />
                            <p className="text-sm">Cart ({cart?.ProductList?.length || 0})</p>
                        </Link>
                    </div>

                    {/* MENU ICON (MOBILE) */}
                    <Menu
                        className="cursor-pointer lg:hidden transition-transform duration-200 hover:scale-110"
                        onClick={() => setDropdownMenu(!dropdownMenu)}
                    />

                    {/* ICONE DE PROFIL */}
                    <button
                        className="cursor-pointer p-1 relative transition-transform duration-200 hover:scale-110"
                        onClick={() => setUserDropdown(!userDropdown)}
                        aria-label="User profile"
                    >
                        <CircleUserRound />
                    </button>
                </div>
            </div>

            {/* MODAL DE RECHERCHE MOBILE */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="w-full m-12 bg-custom-beige/85 p-6 rounded-lg shadow-xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-black">Search</h2>
                            <X className="cursor-pointer text-black" onClick={() => setShowSearchModal(false)} />
                        </div>
                        <div className="mt-4 bg-white/30 flex gap-3 border border-gray-300 px-3 py-2 items-center rounded-lg">
                            <input
                                className="bg-transparent text-lg font-semibold text-black border-transparent w-full outline-none"
                                placeholder="Search for products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                disabled={query === ''}
                                onClick={() => {
                                    router.push(`/search/${query}`);
                                    setShowSearchModal(false);
                                }}
                            >
                                <Search className="cursor-pointer h-5 w-5 text-gray-600 transition-colors duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MENU DE NAVIGATION MOBILE */}
            {dropdownMenu && (
                <div
                    ref={dropdownRef}
                    className="
            absolute top-[72px] right-5 z-50 
            flex flex-col gap-4 p-3 
            rounded-lg border bg-white text-base-bold 
            lg:hidden shadow-xl transition-transform duration-300 transform
            scale-100
          "
                >
                    <Link href="/" className="hover:text-custom-beige transition-colors duration-300">
                        Home
                    </Link>
                    <Link href={user ? '/wishlist' : '/signin'} className="hover:text-custom-beige transition-colors duration-300">
                        Wishlist
                    </Link>
                    <Link href={user ? '/orders' : '/signin'} className="hover:text-custom-beige transition-colors duration-300">
                        Orders
                    </Link>
                    <Link
                        href={user ? '/Cart' : '/signin'}
                        className="
              flex items-center gap-1 border rounded-md px-2 py-1 
              hover:bg-custom-beige hover:text-white transition-colors duration-300
            "
                    >
                        <ShoppingCart />
                        <p className="text-sm">
                            Cart ({cart?.ProductList?.length || 0})
                        </p>
                    </Link>
                </div>
            )}

            {/* DROPDOWN DU PROFIL UTILISATEUR */}
            {userDropdown && (
                <div
                    ref={userDropdownRef}
                    className="
            absolute top-[72px] right-0 z-50 
            flex flex-col gap-2 p-4 w-56 
            rounded-lg border bg-white shadow-xl transition-transform duration-300 transform
            scale-100
          "
                >
                    <div className="flex flex-col items-center text-center">
                        <CircleUserRound className="text-gray-600 w-12 h-12 mb-2" />
                        <p className="font-semibold">{user ? user.username : 'Guest'}</p>
                        <p className="text-sm text-gray-500">{user ? user.email : 'guest@example.com'}</p>
                    </div>
                    {user ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="mt-3 text-center bg-custom-beige text-white py-1 rounded-lg hover:bg-[#a27a64] transition-colors duration-300"
                            >
                                Log out
                            </button>
                            <button
                                onClick={() => router.push('/edituser')}
                                className="mt-3 text-center bg-custom-beige text-white py-1 rounded-lg hover:bg-[#a27a64] transition-colors duration-300"
                            >
                                edit profile
                            </button>

                        </>

                    ) : (
                        <Link
                            href="/signin"
                            className="mt-3 text-center bg-custom-beige hover:bg-[#a27a64] text-white py-1 rounded-lg transition-colors duration-300"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
