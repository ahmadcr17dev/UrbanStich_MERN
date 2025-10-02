import { useEffect, useState, useRef } from 'react';
import { FaMapMarkerAlt, FaHeart, FaUserAlt } from "react-icons/fa";
import { MdLocalPhone, MdEmail, MdAccountCircle } from "react-icons/md";
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FaCartShopping } from "react-icons/fa6";
import urbanstichlogo from "../images/urbanstichlogo.png";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useAuth } from '../context/AuthContext';
import avatar from "../images/avatar.png";

const Navbar = ({ onLoginClick }) => {
    const [isOpen, setIsOpen] = useState(false); // Mobile menu
    const CartCount = useSelector((state) => state.cart.items.length);
    const WishlistCount = useSelector((state) => state.wishlist.items.length);
    const [loggedIn, setLoggedIn] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Ref for dropdown container to detect outside clicks
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };

        // Add event listener when dropdown is open
        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdown]);

    // logout logic for user only
    const HandleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setLoggedIn(false);
        setDropdown(false);
        logout();
        navigate("/");
    }

    const toggleDropdown = () => {
        setDropdown(prev => !prev);
    }

    const handleProfileNavigation = () => {
        setDropdown(false);
        setIsOpen(false); // Also close mobile menu if open
    }

    return (
        <>
            {/* Top Info Bar */}
            <section className="font-poppins bg-green-100 text-green-800 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 hidden sm:block">
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-y-2">
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
                        <a href="#" className="hover:text-green-700">About Us</a>
                        <a href="#" className="hover:text-green-700">Contact Us</a>
                        <a href="#" className="hover:text-green-700">Delivery</a>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-x-4 lg:gap-x-6 gap-y-2">
                        <div className="flex items-center gap-1 lg:gap-2">
                            <FaMapMarkerAlt className="text-[14px] lg:text-[16px]" />
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=123+I-9,+Islamabad,+Pakistan"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Store Location
                            </a>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-2">
                            <MdLocalPhone className="text-[14px] lg:text-[16px]" />
                            <a href="tel:+923226212707">+92 322 6212707</a>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-2">
                            <MdEmail className="text-[14px] lg:text-[16px]" />
                            <a href="mailto:nourisha123@gmail.com">urbanstich123@gmail.com</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Navbar */}
            <nav className="font-poppins bg-white">
                <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 lg:py-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img
                            src={urbanstichlogo}
                            alt="Site Logo"
                            className="w-[140px] sm:w-[180px] lg:w-[200px] xl:w-[220px] 2xl:w-[250px]"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center text-sm lg:text-base xl:text-[15px] gap-x-4 xl:gap-x-6">
                        <NavLink to="/" className={({ isActive }) => { return `hover:text-green-700 transition ${isActive ? "text-green-700" : "text-black"}` }}>Home</NavLink>
                        <NavLink to="/shop" className={({ isActive }) => { return `hover:text-green-700 transition ${isActive ? "text-green-700" : "text-black"}` }}>Products</NavLink>
                        <a href="#" className="hover:text-green-700 transition">Services</a>
                        <a href="#" className="hover:text-green-700 transition">Testimonials</a>
                        <a href="#" className="hover:text-green-700 transition">About</a>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        {/* Wishlist */}
                        <div className="relative flex items-center hover:cursor-pointer">
                            <NavLink to="/wishlist">
                                <FaHeart className="text-[18px] lg:text-[20px]" />
                                {WishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {WishlistCount}
                                    </span>
                                )}
                            </NavLink>
                        </div>

                        {/* Cart */}
                        <div className="relative flex items-center hover:cursor-pointer">
                            <NavLink to="/cart">
                                <FaCartShopping className="text-[18px] lg:text-[20px]" />
                                {CartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {CartCount}
                                    </span>
                                )}
                            </NavLink>
                        </div>

                        {/* Account */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <div className="cursor-pointer">
                                    {/* Avatar Icon */}
                                    <img src={avatar} alt='avatar'
                                        className="h-8 w-8"
                                        onClick={toggleDropdown}
                                    />

                                    {/* DropDown */}
                                    {dropdown && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                                            <button
                                                className="block w-full px-4 py-2 text-center text-sm hover:bg-green-700 hover:text-white transition-colors hover:cursor-pointer"
                                                onClick={HandleLogOut}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div onClick={onLoginClick} className="flex items-center hover:cursor-pointer">
                                <MdAccountCircle className="text-[20px] lg:text-[22px]" />
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? (
                                    <HiOutlineX className="text-[20px]" />
                                ) : (
                                    <HiOutlineMenu className="text-[20px]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Slide Menu */}
                <div
                    className={`fixed top-0 left-0 h-full w-[260px] bg-green-100 px-6 pt-4 pb-6 space-y-4 text-sm z-50 transform transition-transform duration-700 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <NavLink
                        to="/"
                        className={({ isActive }) => `block hover:text-green-700 ${isActive ? "text-green-700" : "text-black"}`}
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/shop"
                        className={({ isActive }) => `block hover:text-green-700 ${isActive ? "text-green-700" : "text-black"}`}
                        onClick={() => setIsOpen(false)}
                    >
                        Products
                    </NavLink>
                    <a href="#" className="block hover:text-green-700">Services</a>
                    <a href="#" className="block hover:text-green-700">Testimonials</a>
                    <a href="#" className="block hover:text-green-700">About</a>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </nav>
        </>
    );
};

export default Navbar;