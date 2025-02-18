'use client';
import Link from "next/link";
import Image from "next/image";
import { CircleUserRound, Search, Menu, ShoppingCart, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { handlelog, userCart } from "@/lib/action";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [cart, setCart] = useState<{ ProductList: any[] } | null>(null);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [query, setQuery] = useState("");
    const pathname = usePathname();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            localStorage.setItem('authtoken', "");
            location.href = '/';
        } catch (error) {
            console.error("Failed to log out:", error);
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
                console.error("Failed to fetch user:", error);
            }
        };

        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                if (!token) return;
                const cartData = await userCart();
                setCart(cartData);
            } catch (error) {
                console.error("Failed to fetch cart:", error);
            }
        };

        fetchUser();
        fetchCart();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownMenu(false);
            }
            if (
                userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)
            ) {
                setUserDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-custom-beige/95 sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 shadow-xl">
            {/* Logo */}
            <Link href="/">
                <Image src="/logo.jpg" alt="Logo" width={130} height={100} />
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-4 text-base-bold max-lg:hidden">
                <Link href="/" className={`hover:text-red-1 ${pathname === "/" && "text-red-1"}`}>Home</Link>
                <Link href={user ? "/wishlist" : "/signin"} className={`hover:text-red-1 ${pathname === "/wishlist" && "text-red-1"}`}>Wishlist</Link>
                <Link href={user ? "/orders" : "/signin"} className={`hover:text-red-1 ${pathname === "/orders" && "text-red-1"}`}>Orders</Link>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-lg">
                <input
                    className="bg-transparent border-transparent w-full outline-none text-black focus:border-transparent"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button disabled={query === ""} onClick={() => router.push(`/search/${query}`)}>
                    <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
                </button>
            </div>

            {/* Cart and User Dropdown */}
            <div className="relative flex gap-3 items-center">
                <Search className="cursor-pointer lg:hidden" onClick={() => setShowSearchModal(true)} />

                {/* Cart Link */}
                <div className="lg:flex hidden">
                    <Link href={user ? "/Cart" : "/signin"} className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-black hover:text-white">
                        <ShoppingCart />
                        <p className="text-base-bold">Cart ({cart?.ProductList?.length || 0})</p>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <Menu className="cursor-pointer lg:hidden" onClick={() => setDropdownMenu(!dropdownMenu)} />

                {/* User Profile Icon */}
                <button className="cursor-pointer p-2 relative" onClick={() => setUserDropdown(!userDropdown)} aria-label="User profile">
                    <CircleUserRound />
                </button>
            </div>

            {/* Mobile Search Modal */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="w-full m-12 bg-custom-beige/85 p-6 rounded-lg shadow-xl">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Search</h2>
                            <X className="cursor-pointer" onClick={() => setShowSearchModal(false)} />
                        </div>
                        <div className="mt-4 bg-white/30 flex gap-3 border border-gray-300 px-3 py-2 items-center rounded-lg">
                            <input
                                className="bg-transparent text-lg font-semibold text-black border-transparent w-full outline-none"
                                placeholder="Search for products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                disabled={query === ""}
                                onClick={() => {
                                    router.push(`/search/${query}`);
                                    setShowSearchModal(false);
                                }}
                            >
                                <Search className="cursor-pointer h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown Menu */}
            {dropdownMenu && (
                <div ref={dropdownRef} className="absolute top-[72px] right-5 flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold lg:hidden">
                    <Link href="/">Home</Link>
                    <Link href={user ? "/wishlist" : "/signin"}>Wishlist</Link>
                    <Link href={user ? "/orders" : "/signin"}>Orders</Link>
                    <Link href={user ? "/Cart" : "/signin"} className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white">
                        <ShoppingCart />
                        <p className="text-base-bold">Cart ({cart?.ProductList.length || 0})</p>
                    </Link>
                </div>
            )}

            {/* User Profile Dropdown */}
            {userDropdown && (
                <div ref={userDropdownRef} className="absolute top-[72px] right-0 flex flex-col gap-2 p-4 w-56 rounded-lg border bg-white shadow-lg">
                    <div className="flex flex-col items-center text-center">
                        <CircleUserRound className="text-gray-600 w-12 h-12 mb-2" />
                        <p className="font-semibold">{user ? user.username : "Guest"}</p>
                        <p className="text-sm text-gray-500">{user ? user.email : "guest@example.com"}</p>
                    </div>
                    {user ? (
                        <button onClick={handleLogout} className="mt-3 text-center bg-custom-beige text-white py-1 rounded-lg hover:bg-[#a27a64]">Log out</button>
                    ) : (
                        <Link href="/signin" className="mt-3 text-center bg-custom-beige hover:bg-[#a27a64] text-white py-1 rounded-lg">Sign In</Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
