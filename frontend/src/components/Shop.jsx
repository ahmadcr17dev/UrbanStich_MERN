import { useEffect, useState } from "react";
import { FaThLarge, FaList, FaStar, FaShoppingCart, FaHeart, FaEye, FaTruck, FaTag } from "react-icons/fa";
import cat1 from "../images/cat1.png";
import cat2 from "../images/cat2.png";
import cat3 from "../images/cat3.png";
import cat4 from "../images/cat4.png";
import cat5 from "../images/cat5.png";
import cat6 from "../images/cat6.webp";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Hourglass } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { AddToCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import { AddToWishlist } from "../store/wishSlice";

const responsive = {
    superLargeDesktop: { // 2xl
        breakpoint: { max: 4000, min: 1536 },
        items: 5
    },
    desktop: { // xl
        breakpoint: { max: 1536, min: 1280 },
        items: 5
    },
    laptop: { // lg
        breakpoint: { max: 1280, min: 1024 },
        items: 5
    },
    tablet: { // md
        breakpoint: { max: 1024, min: 640 },
        items: 3
    },
    mobile: { // sm
        breakpoint: { max: 640, min: 0 },
        items: 2
    }
};

const categories = [
    { name: "Shirts", img: cat1, bg: "bg-green-100" },
    { name: "Pents", img: cat2, bg: "bg-yellow-100" },
    { name: "Watches", img: cat3, bg: "bg-pink-100" },
    { name: "Coats", img: cat4, bg: "bg-red-100" },
    { name: "Formal", img: cat5, bg: "bg-blue-100" },
    { name: "Accessories", img: cat6, bg: "bg-purple-100" }
];

const Shop = () => {
    const [layout, setLayout] = useState("grid");
    const [products, setproducts] = useState([]);
    const [loading, setloading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true; // prevent state updates if unmounted

        axios
            .get(import.meta.env.VITE_API_DISPLAYPRODUCT)
            .then((res) => {
                if (isMounted) {
                    setproducts(res.data);
                }
            })
            .catch((error) => {
                console.error(error.message);
            })
            .finally(() => {
                if (isMounted) {
                    setloading(false);
                }
            });

        return () => {
            isMounted = false; // cleanup on unmount
        };
    }, []);

    // handle add to cart
    const handleAddToCart = (product) => {
        const firstVariation = product.variations?.[0] || {};

        // pick first size if none selected
        const selectedSizeObj = firstVariation.sizes?.[0] || {
            size: "",
            stock: 0,
        };

        const variation = {
            color: firstVariation.color || "Default",
            size: selectedSizeObj.size || "Default",
            stock: selectedSizeObj.stock || 0,
        };

        const price = firstVariation.price || product.price || 0;

        const result = dispatch(
            AddToCart({
                _id: product._id,
                name: product.name,
                price: price,
                discount: product.discount,
                quantity: 1,
                mainImage: firstVariation.mainImage
                    ? `${import.meta.env.VITE_API_BASE}/uploads/${firstVariation.mainImage}`
                    : "placeholder.jpg",
                variation,
            })
        );

        if (result.payload?.error) {
            toast.error(`${product.name} is already in cart`);
        } else {
            toast.success(`${product.name} added to cart`);
        }
    };

    // Add items to wishlist
    const HandleAddToWishlist = (WishItem) => {
        // If product has variations array, pick the first one
        const firstVariation = Array.isArray(WishItem.variations)
            ? WishItem.variations[0]
            : {};

        // Pick size if available, otherwise fallback
        const selectedSizeObj = firstVariation?.sizes?.[0] || {
            size: "",
            stock: firstVariation?.stock || 0,
        };

        const variation = {
            color: firstVariation?.color || "Default",
            size: selectedSizeObj.size || "Default",
            stock: selectedSizeObj.stock || 0,
        };

        const price = firstVariation?.price || WishItem.price || 0;

        const result = dispatch(
            AddToWishlist({
                _id: WishItem._id,
                name: WishItem.name,
                price,
                discount: WishItem.discount,
                quantity: 1,
                mainImage: firstVariation?.mainImage
                    ? `${import.meta.env.VITE_API_BASE}/uploads/${firstVariation.mainImage}`
                    : "placeholder.jpg",
                variation,
            })
        );

        if (result.payload?.error) {
            toast.error(`${WishItem.name} is already in wishlist`);
        } else {
            toast.success(`${WishItem.name} added to wishlist`);
        }
    }

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Hourglass
                        visible={true}
                        height="70"
                        width="70"
                        ariaLabel="hourglass-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        colors={['#277621', '#72bf6a']}
                    />
                </div>
            ) : (
                <>
                    {/* Categories Section */}
                    <section className="px-6 sm:px-10 lg:px-12 xl:px-12 mt-[120px]">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                            <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
                                Shop By Categories
                            </h2>
                            <p className="font-montserrat text-gray-500 text-sm sm:text-base mt-2 sm:mt-0">
                                Explore the latest styles and trends
                            </p>
                        </div>

                        <Carousel
                            responsive={responsive}
                            autoPlay={true}
                            autoPlaySpeed={2500}
                            infinite={true}
                            keyBoardControl={true}
                            customTransition="transform 700ms ease-in-out"
                            transitionDuration={700}
                            pauseOnHover={true}
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            arrows={false}
                            containerClass="pb-8"
                        >
                            {categories.map((cat, index) => (
                                <div
                                    key={index}
                                    className="group p-4 flex flex-col items-center font-poppins text-center"
                                >
                                    <div
                                        className={`${cat.bg} rounded-2xl shadow-md hover:shadow-xl p-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                                    >
                                        <img
                                            src={cat.img}
                                            alt={cat.name}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                                        />
                                    </div>
                                    <p className="mt-4 text-base sm:text-lg font-medium text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                                        {cat.name}
                                    </p>
                                </div>
                            ))}
                        </Carousel>
                    </section>
                    {/* Categories Section */}

                    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 p-4 sm:p-6">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-1/4 bg-white p-4 sm:p-5 rounded-lg shadow-md mb-6 lg:mb-0">
                            <h2 className="text-base sm:text-lg font-semibold mb-4">Filters</h2>

                            {/* Price */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-2 text-sm sm:text-base">Price</h3>
                                <input type="range" min="0" max="50000" className="w-full accent-green-600" />
                                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                                    <span>Rs 0</span>
                                    <span>Rs 50,000</span>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-2 text-sm sm:text-base">Categories</h3>
                                <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                                    <li><input type="checkbox" /> Shirts</li>
                                    <li><input type="checkbox" /> Pants</li>
                                    <li><input type="checkbox" /> Watches</li>
                                    <li><input type="checkbox" /> Coats</li>
                                    <li><input type="checkbox" /> Formal</li>
                                    <li><input type="checkbox" /> Accessories</li>
                                </ul>
                            </div>

                            {/* Colors */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-2 text-sm sm:text-base">Colors</h3>
                                <div className="flex flex-wrap gap-3">
                                    <span className="w-6 h-6 rounded-full bg-red-500 border"></span>
                                    <span className="w-6 h-6 rounded-full bg-blue-500 border"></span>
                                    <span className="w-6 h-6 rounded-full bg-green-500 border"></span>
                                    <span className="w-6 h-6 rounded-full bg-black border"></span>
                                    <span className="w-6 h-6 rounded-full bg-white border"></span>
                                    <span className="w-6 h-6 rounded-full bg-gray-500 border"></span>
                                    <span className="w-6 h-6 rounded-full bg-[#faf9f6] border"></span>
                                    <span className="w-6 h-6 rounded-full bg-yellow-500 border"></span>
                                    <span className="w-6 h-6 rounded-full bg-[#964b00] border"></span>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-2 text-sm sm:text-base">Sizes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["S", "M", "L", "XL", "XXL"].map((s) => (
                                        <span
                                            key={s}
                                            className="px-3 py-1 border rounded-md text-gray-600 text-xs sm:text-sm cursor-pointer hover:bg-green-600 hover:text-white"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-2 text-sm sm:text-base">Stock</h3>
                                <label className="block text-xs sm:text-sm text-gray-700">
                                    <input type="checkbox" /> In Stock
                                </label>
                                <label className="block text-xs sm:text-sm text-gray-700">
                                    <input type="checkbox" /> Out of Stock
                                </label>
                            </div>

                            {/* Discount */}
                            <div className="mb-6">
                                <h3 className="font-medium mb-2 text-sm sm:text-base">Discount</h3>
                                <input type="range" min="0" max="100" className="w-full accent-green-600" />
                                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                                    <span>0%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </aside>

                        {/* Products Section */}
                        <main className="w-full lg:w-3/4 lg:pl-6">
                            {/* Top Bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                                <h2 className="text-xl sm:text-2xl font-semibold">Shop</h2>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setLayout("grid")}
                                        className={`p-2 rounded-md text-sm sm:text-base ${layout === "grid" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                                    >
                                        <FaThLarge />
                                    </button>
                                    <button
                                        onClick={() => setLayout("list")}
                                        className={`p-2 rounded-md text-sm sm:text-base ${layout === "list" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                                    >
                                        <FaList />
                                    </button>
                                </div>
                            </div>

                            {/* Products */}
                            <div
                                className={
                                    layout === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6"
                                        : "space-y-6"
                                }
                            >
                                {products.map((p) => {
                                    const firstVariation = p.variations && p.variations.length > 0 ? p.variations[0] : null;
                                    const imageUrl = firstVariation?.mainImage
                                        ? firstVariation.mainImage.startsWith("http")
                                            ? firstVariation.mainImage
                                            : `${import.meta.env.VITE_API_BASE}/uploads/${firstVariation.mainImage}`
                                        : "/placeholder.png";
                                    const price = firstVariation?.price || 0;

                                    return (
                                        <div
                                            key={p.id}
                                            className="bg-white rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition"
                                        >
                                            {/* Product Image */}
                                            <div className="relative">
                                                <Link to={`/product/${p._id}`}>
                                                    <img
                                                        src={imageUrl}
                                                        alt={p.name}
                                                        className="w-full h-44 sm:h-56 md:h-64 object-cover rounded-md"
                                                    />
                                                </Link>
                                                {p.discount > 0 && (
                                                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded-md">
                                                        -{p.discount}%
                                                    </span>
                                                )}
                                                <div className="absolute top-2 right-2 flex space-x-2 text-gray-500 text-sm sm:text-base">
                                                    <FaEye className="cursor-pointer hover:text-green-600" />
                                                    <FaHeart className="cursor-pointer hover:text-red-600" onClick={() => HandleAddToWishlist(p)} />
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <h3 className="text-sm sm:text-base md:text-lg font-semibold mt-3">{(p.name).slice(0, 20) + "..."}</h3>
                                            <div className="flex items-center space-x-1 mt-2 text-xs sm:text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className="text-yellow-400" />
                                                ))}
                                            </div>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-3 mt-3 text-gray-500 text-xs sm:text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <FaTruck /> <span>Fast Delivery</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <FaTag /> <span>Best Price</span>
                                                </div>
                                            </div>

                                            {/* Price + Button */}
                                            <div className="flex flex-col mt-3">
                                                <div className="flex flex-row items-center">
                                                    <span className="text-red-600 text-sm sm:text-lg font-bold">
                                                        Rs: {(price - (price / 100) * p.discount).toFixed(2)}
                                                    </span>
                                                    {p.discount > 0 && (
                                                        <span className="ml-2 line-through text-gray-400 text-xs sm:text-sm">
                                                            Rs: {price}
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="flex justify-center items-center w-full space-x-2 border border-green-600 text-green-600 px-3 sm:px-4 py-2 rounded-md hover:bg-green-700 hover:text-white hover:cursor-pointer transition mt-2 text-xs sm:text-sm md:text-base"
                                                    onClick={() => handleAddToCart(p)}
                                                >
                                                    <FaShoppingCart />
                                                    <span>Add To Cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </main>
                    </div >
                </>
            )}
        </>
    );
}

export default Shop;