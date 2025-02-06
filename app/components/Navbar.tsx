"use client";
import Link from "next/link";
import Image from "next/image";
import { CircleUserRound, Search, Menu, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { handlelog, userCart } from "@/lib/action";
import { usePathname, useRouter } from "next/navigation";


const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const cart = userCart();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await handlelog();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);
    // 9olili wsh lzm ndirha getuserinfo?? mkhdmhalk doka
    // khdemthaaaa wa7di  @younessssss
    // matochich
    // ana dertha bsh njib les informations te3 l user waitt
    useEffect(() => {
        const handleClickOutside = () => {
            setDropdownMenu(false);
            setUserDropdown(false);
        };
        if (dropdownMenu || userDropdown) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [dropdownMenu, userDropdown]);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownMenu(!dropdownMenu);
    };

    const toggleUserDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setUserDropdown(!userDropdown);
    };
    const [query, setQuery] = useState("");

    return (
        <div className="bg-custom-beige sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 shadow-xl">
            {/* Logo */}
            <Link href="/">
                <Image src="/logo.jpg" alt="Logo" width={130} height={100} />
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-4 text-base-bold max-lg:hidden">
                <Link
                    href="/"
                    className={`hover:text-red-1 ${pathname === "/" && "text-red-1"
                        }`}
                >
                    Home
                </Link>
                <Link
                    href={user ? "/wishlist" : "/sign-in"}
                    className={`hover:text-red-1 ${pathname === "/wishlist" && "text-red-1"
                        }`}
                >
                    Wishlist
                </Link>
                <Link
                    href={user ? "/orders" : "/sign-in"}
                    className={`hover:text-red-1 ${pathname === "/orders" && "text-red-1"
                        }`}
                >
                    Orders
                </Link>
            </div>

            <div className="flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-lg">
                <input
                    className="outline-none max-sm:max-w-[120px]"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    disabled={query === ""}
                    onClick={() => router.push(`/search/${query}`)}
                >
                    <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
                </button>
            </div>
            {/* Cart and User Dropdown */}
            <div className="relative flex gap-3 items-center">
                {/* Cart Link */}
                <div className="lg:flex hidden">
                    <Link
                        href="/Cart"
                        className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-black hover:text-white"
                    >
                        <ShoppingCart />
                        <p className="text-base-bold">Cart</p>
                    </Link>
                </div>

                {/* Navigation Menu */}

                <Menu
                    className="cursor-pointer lg:hidden"
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                />

                {/* Dropdown Menu */}
                {dropdownMenu && (
                    <div className="absolute top-12 right-5 flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold lg:hidden">
                        <Link href="/" className="hover:text-red-1">
                            Home
                        </Link>
                        <Link
                            href={user ? "/wishlist" : "/sign-in"}
                            className="hover:text-red-1"
                        >
                            Wishlist
                        </Link>
                        <Link
                            href={user ? "/orders" : "/sign-in"}
                            className="hover:text-red-1"
                        >
                            Orders
                        </Link>
                        <Link
                            href="/Cart"
                            className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white"
                        >
                            <ShoppingCart />
                            <p className="text-base-bold">
                                {/* Cart ({cart.cartItems.length}) */}
                            </p>
                        </Link>
                    </div>
                )}

                {/* User Profile Icon */}
                <button
                    className="cursor-pointer p-2 relative"
                    onClick={toggleUserDropdown}
                    aria-label="User profile"
                >
                    <CircleUserRound />
                </button>

                {/* User Profile Dropdown */}
                {userDropdown && (
                    <div
                        className="absolute top-12 right-0 flex flex-col gap-2 p-4 w-56 rounded-lg border bg-white shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center">
                            <CircleUserRound className="text-gray-600 w-12 h-12 mb-2" />
                            <p className="font-semibold">{user ? user.username : "Guest"}</p>
                            <p className="text-sm text-gray-500">{user ? user.email : "guest@example.com"}</p>
                        </div>
                        {user ? (
                            <div>
                                <div className="mt-3 text-center bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600">
                                    <Link
                                        href="/edituser"

                                    >
                                        Edit Profile
                                    </Link>
                                </div>
                                <div className="mt-3 text-center bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600">
                                    <Link
                                        href="/edituser"

                                    >
                                        Log out
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="mt-3 text-center bg-green-500 text-white py-1 rounded-lg hover:bg-green-600"
                            >
                                Sign In
                            </Link>
                        )}

                    </div>
                )}
            </div>
        </div >
    );
};

export default Navbar;

