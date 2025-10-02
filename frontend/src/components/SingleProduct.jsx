import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaShoppingCart, FaHeart, FaEye, FaTruck, FaTag } from "react-icons/fa";
import { Hourglass } from "react-loader-spinner";
import { AddToCart } from "../store/cartSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AddToWishlist } from "../store/wishSlice";

function SingleProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [related, setrelated] = useState([]);
    const [loading, setloading] = useState(true);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        setloading(true); // start loading

        // simulate 3 second delay
        const delayTimer = setTimeout(() => {
            axios
                .get(`${import.meta.env.VITE_API_ADDPRODUCT}/${id}`)
                .then((res) => {
                    if (isMounted) {
                        setProduct(res.data);
                        if (res.data.variations.length > 0) {
                            setSelectedVariation(res.data.variations[0]);
                            setSelectedImage(res.data.variations[0].mainImage);
                        }
                        return axios.get(`${import.meta.env.VITE_API_ADDPRODUCT}/related`, {
                            params: { category: res.data.category, excludeId: res.data._id },
                        });
                    }
                })
                .then((relatedRes) => {
                    if (isMounted && relatedRes) {
                        setrelated(relatedRes.data);
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    if (isMounted) setloading(false); // stop loading after API + delay
                });
        }, 3000);

        return () => {
            isMounted = false;
            clearTimeout(delayTimer);
        };
    }, [id]);

    // Loader
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Hourglass
                    visible={true}
                    height="70"
                    width="70"
                    ariaLabel="hourglass-loading"
                    colors={['#277621', '#72bf6a']}
                />
            </div>
        );
    }
    const price = selectedVariation?.price || 0;

    // Add to cart logic
    const HandleAddToCart = () => {
        if (!selectedVariation) {
            toast.error("Please select a color first");
            return;
        }
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        const variation = {
            color: selectedVariation.color,
            size: selectedSize.size,
            stock: selectedSize.stock,
        };

        const price = selectedVariation.price || product.price || 0;
        const finalPrice = price - (price / 100) * (product.discount || 0);

        // check if already in cart
        const exists = cartItems.some(
            (item) =>
                item._id === product._id &&
                item.variation.color === variation.color &&
                item.variation.size === variation.size
        );

        if (exists) {
            toast.error(`${product.name} is already in cart`);
            return;
        }

        const result = dispatch(
            AddToCart({
                _id: product._id,
                name: product.name,
                price: finalPrice,
                discount: product.discount,
                quantity: 1,
                mainImage: selectedVariation.mainImage
                    ? `${import.meta.env.VITE_API_BASE}/uploads/${selectedVariation.mainImage}`
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

    // Add related products to cart
    const RelatedAddToCart = (product) => {
        // always pick the first variation safely
        const firstVariation = product.variations?.[0] || {};

        // choose first size if available
        const selectedSizeObj = firstVariation.sizes?.[0] || { size: "Default", stock: firstVariation.stock || 0 };

        const variation = {
            color: firstVariation.color || "Default",
            size: selectedSizeObj.size,
            stock: selectedSizeObj.stock,
        };

        const price = firstVariation.price || product.price || 0;
        const finalPrice = price - (price / 100) * (product.discount || 0);

        // check if item with same variation already in cart
        const exists = cartItems.some(
            (item) =>
                item._id === product._id &&
                item.variation.color === variation.color &&
                item.variation.size === variation.size
        );

        if (exists) {
            toast.error(
                `${product.name} is already in cart`
            );
            return;
        }

        dispatch(
            AddToCart({
                _id: product._id,
                name: product.name,
                price: finalPrice,
                discount: product.discount,
                quantity: 1,
                mainImage: firstVariation.mainImage
                    ? `${import.meta.env.VITE_API_BASE}/uploads/${firstVariation.mainImage}`
                    : "placeholder.jpg",
                variation,
            })
        );

        toast.success(
            `${product.name} added to cart`
        );
    };

    const HandleAddToWishlist = (product) => {
        // always pick the first variation safely
        const firstVariation = product.variations?.[0] || {};

        // choose first size if available
        const selectedSizeObj = firstVariation.sizes?.[0] || { size: "Default", stock: firstVariation.stock || 0 };

        const variation = {
            color: firstVariation.color || "Default",
            size: selectedSizeObj.size,
            stock: selectedSizeObj.stock,
        };

        const price = firstVariation.price || product.price || 0;
        const finalPrice = price - (price / 100) * (product.discount || 0);

        // check if item with same variation already in wishlist
        const exists = wishlistItems.some(
            (item) =>
                item._id === product._id &&
                item.variation.color === variation.color &&
                item.variation.size === variation.size
        );

        if (exists) {
            toast.error(`${product.name} is already in wishlist`);
            return;
        }

        dispatch(
            AddToWishlist({
                _id: product._id,
                name: product.name,
                price: finalPrice,
                discount: product.discount,
                quantity: 1,
                mainImage: product.mainImage
                    ? product.mainImage.startsWith("http")
                        ? product.mainImage
                        : `${import.meta.env.VITE_API_BASE}/uploads/${product.mainImage}`
                    : firstVariation.mainImage
                        ? `${import.meta.env.VITE_API_BASE}/uploads/${firstVariation.mainImage}`
                        : "placeholder.jpg",
                variation,
            })
        );

        toast.success(`${product.name} added to wishlist`);
    };

    const HandleBuyNow = async (product) => {
        if (!selectedColor || !selectedSize) {
            toast.error("Select color and size before proceeding");
            return;
        }

        try {
            const firstVariation = product.variations?.[0] || {};
            const selectedSizeObj = firstVariation.sizes?.find(s => s.size === selectedSize) || {};

            const buyProduct = {
                _id: product._id,
                name: product.name,
                price: firstVariation.price,   // ✅ make sure price comes
                quantity: 1,
                discount: product.discount,
                mainImage: `${import.meta.env.VITE_API_BASE}/uploads/${firstVariation.mainImage}`,
                variation: {
                    color: selectedColor,
                    size: selectedSize,
                    stock: selectedSizeObj.stock || firstVariation.stock,
                },
            };

            // ✅ wrap it in an array because Checkout expects products.map()
            navigate("/checkout", { state: { products: [buyProduct] } });
        } catch (error) {
            console.error(error);
            toast.error("Error in Buy Now request");
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Hourglass
                        visible={true}
                        height="70"
                        width="70"
                        ariaLabel="hourglass-loading"
                        colors={['#277621', '#72bf6a']}
                    />
                </div>
            ) : (
                <>
                    <div className="bg-white mt-14">
                        <div className="pt-6">
                            {/* Breadcrumb */}
                            <nav aria-label="Breadcrumb">
                                <ol className="mx-auto flex max-w-7xl flex-wrap items-center space-x-2 px-4 sm:px-6 lg:px-8 font-montserrat text-sm sm:text-base">
                                    <li>
                                        <span className="text-gray-400">{product.category}</span>
                                    </li>
                                    <li className="text-gray-400">/</li>
                                    <li>
                                        <span className="text-gray-400">{product.subcategory}</span>
                                    </li>
                                    <li className="text-gray-400">/</li>
                                    <li className="text-gray-900 font-medium">{product.name}</li>
                                </ol>
                            </nav>

                            {/* Main Section */}
                            <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 gap-y-10">
                                {/* Left - Images */}
                                <div className="flex flex-col items-center">
                                    <div className="w-full overflow-hidden rounded-lg">
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE}/uploads/${selectedImage}`}
                                            alt={product.name}
                                            className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] object-cover object-center rounded-md shadow"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                        {[selectedVariation?.mainImage, ...(selectedVariation?.galleryImages || [])].map(
                                            (img, i) =>
                                                img && (
                                                    <img
                                                        key={i}
                                                        src={`${import.meta.env.VITE_API_BASE}/uploads/${img}`}
                                                        alt="thumbnail"
                                                        onClick={() => setSelectedImage(img)}
                                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md cursor-pointer border ${selectedImage === img
                                                            ? "border-blue-600"
                                                            : "border-gray-200"
                                                            }`}
                                                    />
                                                )
                                        )}
                                    </div>
                                </div>

                                {/* Right - Info */}
                                <div className="mt-4 lg:mt-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-poppins">
                                        {product.name}
                                    </h1>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-montserrat">
                                        <p className="mt-2 text-gray-600">{product.brand}</p>
                                        {product.discount > 0 && (
                                            <p className="mt-2 text-white bg-green-600 px-3 sm:px-4 py-1 rounded-lg text-sm sm:text-base text-center">
                                                {product.discount}% OFF
                                            </p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex flex-row items-center font-poppins mt-3">
                                        <span className="text-red-600 text-lg sm:text-xl font-bold">
                                            Rs: {(price - (price / 100) * product.discount).toFixed(2)}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className="ml-2 line-through text-gray-400 text-sm sm:text-base">
                                                Rs: {price}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="mt-4 sm:mt-6 text-gray-700 leading-relaxed font-montserrat text-sm sm:text-base">
                                        {product.description}
                                    </p>

                                    {/* Colors */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                                        <div className="mt-2 flex gap-2 flex-wrap">
                                            {product.variations.map((variation, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedVariation(variation);
                                                        setSelectedImage(variation.mainImage);
                                                        setSelectedColor(variation.color);
                                                        setSelectedSize(null); // reset size when switching color
                                                    }}
                                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border ${selectedColor === variation.color ? "border-green-600" : "border-gray-300"
                                                        }`}
                                                    style={{ backgroundColor: variation.color }}
                                                    title={variation.color}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-900">Available Sizes</h3>
                                        <div className="mt-2 flex gap-2 flex-wrap">
                                            {selectedVariation?.sizes.map((s, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedSize(s)}
                                                    className={`px-3 py-1 border rounded-md text-sm ${selectedSize?.size === s.size
                                                        ? "bg-green-600 text-white border-green-600"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {s.size} ({s.stock} left)
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-8 flex flex-col sm:flex-row gap-4 font-poppins">
                                        <button
                                            onClick={HandleAddToCart}
                                            disabled={!selectedColor || !selectedSize}
                                            className={`w-full sm:flex-1 px-6 py-3 rounded-lg font-medium border transition ${!selectedColor || !selectedSize
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "text-green-700 border-green-700 hover:bg-green-700 hover:text-white hover:cursor-pointer"
                                                }`}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className="w-full sm:flex-1 text-black px-6 py-3 border rounded-lg border-stone-800 font-medium hover:bg-stone-700 hover:text-white transition hover:cursor-pointer"
                                            onClick={() => HandleBuyNow(product)}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-20 sm:mt-[12rem] px-4 sm:px-6 lg:px-8">
                        <h3 className="font-poppins text-2xl sm:text-3xl font-semibold mb-6">
                            Related Products
                        </h3>

                        {/* Grid Responsive */}
                        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {related
                                .filter(p => p.discount >= 1)
                                .map((p) => {
                                    const firstVariation = p.variations[0] || {};
                                    const mainImage = firstVariation.mainImage || "placeholder.jpg";
                                    const displayPrice = firstVariation.price || p.price || 0;

                                    return (
                                        <div
                                            key={p._id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                        >
                                            <div className="w-full h-48 sm:h-56 bg-gray-100">
                                                <img
                                                    src={`${import.meta.env.VITE_API_BASE}/uploads/${mainImage}`}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="bg-green-600 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-md font-montserrat">
                                                        Up to {p.discount}% off
                                                    </span>
                                                    <div className="flex space-x-3 text-gray-500 text-sm">
                                                        <FaEye className="cursor-pointer hover:text-black transition" />
                                                        <FaHeart className="cursor-pointer hover:text-red-500 transition" onClick={() => HandleAddToWishlist(p)} />
                                                    </div>
                                                </div>

                                                <h2 className="text-base sm:text-lg font-semibold text-gray-800 leading-snug line-clamp-2 font-poppins">
                                                    {p.name}
                                                </h2>

                                                <div className="flex items-center space-x-1 mt-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className="text-yellow-400 text-xs sm:text-sm" />
                                                    ))}
                                                    <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700">5.0</span>
                                                    <span className="text-gray-400 text-xs sm:text-sm">(455)</span>
                                                </div>

                                                <div className="flex justify-between mt-3 text-gray-500 text-xs sm:text-sm">
                                                    <div className="flex items-center space-x-1">
                                                        <FaTruck />
                                                        <span>Fast Delivery</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <FaTag />
                                                        <span>Best Price</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col mt-5 font-montserrat">
                                                    <div className="flex flex-row items-center">
                                                        <span className="text-red-600 text-base sm:text-lg font-bold">
                                                            Rs: {(displayPrice - (displayPrice / 100) * p.discount).toFixed(2)}
                                                        </span>
                                                        {p.discount > 0 && (
                                                            <span className="ml-2 line-through text-gray-400 text-xs sm:text-sm">
                                                                Rs: {displayPrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="flex items-center justify-center mt-2 py-2 space-x-2 text-green-700 border border-green-700 rounded-md text-sm sm:text-base hover:bg-green-700 hover:text-white transition"
                                                        onClick={() => RelatedAddToCart(p)}
                                                    >
                                                        <FaShoppingCart />
                                                        <span>Add To Cart</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default SingleProduct;