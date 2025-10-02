import { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
    FaStar,
    FaShoppingCart,
    FaHeart,
    FaEye,
    FaTruck,
    FaTag,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AddToCart } from "../store/cartSlice";
import { AddToWishlist } from "../store/wishSlice";
import toast from "react-hot-toast";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5 },
    desktop: { breakpoint: { max: 1536, min: 1280 }, items: 4 },
    laptop: { breakpoint: { max: 1280, min: 1020 }, items: 3 },
    tablet: { breakpoint: { max: 1020, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

const PopularProducts = () => {
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_DISPLAYPRODUCT)
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Add to Cart Handler
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
    }

    // Add product to wishlist
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
    };

    return (
        <section className="mt-20 px-4 sm:px-6 md:px-10 lg:px-12 2xl:px-20">
            {/* Heading */}
            <h2 className="font-poppins text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-semibold text-gray-800">
                Popular Products
            </h2>
            <p className="text-center text-green-800 font-medium font-montserrat text-xs sm:text-sm md:text-base mt-2">
                Content means little without design, context, and clarity
            </p>

            {/* Carousel */}
            <div>
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
                    {products
                        .filter((p) => p.discount >= 5)
                        .map((p) => {
                            const firstVariation = p.variations?.[0] || {};
                            const mainImage = firstVariation.mainImage || "placeholder.jpg";
                            const displayPrice = firstVariation.price || p.price || 0;
                            return (
                                <div
                                    key={p._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl my-6 sm:my-8 w-[90%] sm:w-72 md:w-80 lg:w-72 mx-auto"
                                >
                                    {/* Product Image */}
                                    <div className="w-full h-44 sm:h-56 md:h-64 lg:h-56 bg-gray-100">
                                        <img
                                            src={`http://localhost:8080/uploads/${mainImage}`}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 sm:p-4">
                                        {/* Discount & Icons */}
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="bg-green-600 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-md font-montserrat">
                                                Up to {p.discount}% off
                                            </span>
                                            <div className="flex space-x-2 sm:space-x-3 text-gray-500 text-sm sm:text-base">
                                                <FaEye className="cursor-pointer hover:text-black transition" />
                                                <FaHeart className="cursor-pointer hover:text-red-500 transition" onClick={() => HandleAddToWishlist(p)} />
                                            </div>
                                        </div>

                                        {/* Product Title */}
                                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 leading-snug line-clamp-2 font-poppins">
                                            {p.name.slice(0, 22) + "..."}
                                        </h2>

                                        {/* Rating */}
                                        <div className="flex items-center space-x-1 mt-2 text-xs sm:text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className="text-yellow-400" />
                                            ))}
                                            <span className="ml-1 sm:ml-2 text-gray-700">5.0</span>
                                            <span className="text-gray-400">(455)</span>
                                        </div>

                                        {/* Features */}
                                        <div className="flex justify-between mt-3 text-gray-500 text-[10px] sm:text-sm">
                                            <div className="flex items-center space-x-1">
                                                <FaTruck />
                                                <span>Fast Delivery</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FaTag />
                                                <span>Best Price</span>
                                            </div>
                                        </div>

                                        {/* Price & Button */}
                                        <div className="flex flex-col mt-4 sm:mt-5 font-montserrat">
                                            <div className="flex flex-row items-center">
                                                <span className="text-red-600 text-base sm:text-lg font-bold">
                                                    Rs:{" "}
                                                    {(
                                                        displayPrice -
                                                        (displayPrice / 100) * p.discount
                                                    ).toFixed(2)}
                                                </span>
                                                {p.discount > 0 && (
                                                    <span className="ml-2 line-through text-gray-400 text-xs sm:text-sm">
                                                        Rs: {displayPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(p)}
                                                className="flex items-center justify-center mt-2 py-2 space-x-2 bg-none text-green-700 border border-green-700 rounded-md hover:bg-green-700 hover:text-white hover:cursor-pointer transition text-xs sm:text-sm md:text-base"
                                            >
                                                <FaShoppingCart />
                                                <span>Add To Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </Carousel>
            </div>
        </section>
    );
};

export default PopularProducts;