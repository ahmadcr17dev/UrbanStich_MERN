import { useEffect, useState } from "react";
import { FaHeartBroken, FaTrash } from "react-icons/fa";
import { Hourglass } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { ClearWishlist, RemoveFromWishlist } from "../store/wishSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Confetti from "canvas-confetti";

const EmptyWishlistAnimation = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Update window size dynamically
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Trigger confetti animation for broken heart
    useEffect(() => {
        const interval = setInterval(() => {
            Confetti({
                particleCount: 5,
                angle: 90,
                spread: 45,
                origin: { x: 0.5, y: 0 },
                gravity: 0.5,
                colors: ["#F87171", "#EF4444", "#DC2626", "#BBF7D0", "#4ADE80"], // red + green shades
                scalar: 0.8,
                drift: 0.5,
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">
            <FaHeartBroken className="mb-6 text-8xl text-red-500 animate-bounce" />
            <h2 className="text-3xl font-bold text-gray-700 mb-2">
                Your wishlist is empty!
            </h2>
            <p className="text-gray-500 max-w-md">
                Add products to your wishlist to see them here. The heart is crying little tears 💔
            </p>
        </div>
    );
};

const Wishlist = () => {
    const [loading, setLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Remove item from wishlist
    const HandleRemoveFromWishlist = (item) => {
        dispatch(RemoveFromWishlist({ _id: item._id, variation: item.variation }));
        toast.success(`${item.name} removed from wishlist`);
    };

    // Clear entire wishlist
    const HandleClearWishlist = () => {
        setIsClearing(true);
        toast.loading("Clearing Wishlist ...", { duration: 3000 });
        const timer = setTimeout(() => {
            dispatch(ClearWishlist());
            setIsClearing(false);
            toast.success("Wishlist has been cleared");
        }, 3000);
        return () => clearTimeout(timer);
    };

    const HandleBuyNow = (item) => {
        if (!item) return toast.error("Failed to proceed");
        navigate("/checkout", { state: { products: [item], source: "wishlist" } });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Hourglass
                    visible={true}
                    height="70"
                    width="70"
                    ariaLabel="hourglass-loading"
                    colors={["#277621", "#72bf6a"]}
                />
            </div>
        );
    }

    return (
        <>
            {wishlistItems.length > 0 ? (
                <div className={`transition-opacity duration-1000 ${isClearing ? "opacity-0" : "opacity-100"}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-center">Your Favorite Items</h1>
                        <p className="text-center text-gray-500 mt-2">
                            There are {wishlistItems.length.toString().padStart(2, "0")} products in this list
                        </p>

                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="py-3 px-4">Product Name</th>
                                        <th className="py-3 px-4">Unit Price</th>
                                        <th className="py-3 px-4">Stock Status</th>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wishlistItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td className="py-4 px-4 flex items-center gap-3">
                                                <img
                                                    src={item.mainImage}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                <span className="font-semibold text-gray-800">{item.name}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {item.oldPrice && (
                                                    <span className="line-through text-gray-400 mr-2">
                                                        Rs {item.oldPrice}
                                                    </span>
                                                )}
                                                <span className="text-gray-800 font-medium">
                                                    Rs {(item.price - (item.price / 100) * item.discount).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {item.stock > 0 ? (
                                                    <span className="text-green-600">In Stock</span>
                                                ) : (
                                                    <span className="text-red-600">Stock Out</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button
                                                    className="border border-1 border-stone-700 bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-stone-700 hover:text-white hover:cursor-pointer"
                                                    onClick={() => HandleBuyNow(item)}
                                                >
                                                    Buy Now
                                                </button>
                                            </td>
                                            <td className="py-4 px-4">
                                                <button className="text-gray-500 hover:text-red-600 hover:cursor-pointer">
                                                    <FaTrash onClick={() => HandleRemoveFromWishlist(item)} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                className="px-12 py-3 bg-white text-black font-medium border border-2 border-red-700 rounded-lg hover:cursor-pointer hover:bg-red-700 hover:text-white transition delay-50 ease-in-out mt-6"
                                onClick={() => HandleClearWishlist()}
                            >
                                Clear Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyWishlistAnimation />
            )}
        </>
    );
};

export default Wishlist;