import { useEffect, useState } from "react";
import { Hourglass } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
    DecrementProduct,
    IncrementProduct,
    RemoveFromCart,
    ClearCart,
} from "../store/cartSlice";
import { FaTrash, FaRegSadTear, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Confetti from "canvas-confetti";

const EmptyCartAnimation = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            Confetti({
                particleCount: 5,
                angle: 90,
                spread: 45,
                origin: { x: 0.5, y: 0 },
                gravity: 0.4,
                colors: ["#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A"],
                scalar: 0.7,
                drift: 0.3,
                zIndex: 9999,
            });
        }, 300); // every 0.3s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">
            <FaRegSadTear className="mb-6 text-8xl text-green-500 animate-bounce" />
            <p className="text-3xl font-bold text-gray-700 mb-2 flex items-center gap-2">
                Your Cart is Empty! <FaShoppingCart className="text-3xl text-gray-400" />
            </p>
            <p className="text-gray-500 max-w-md">
                Looks like you haven’t added any items yet. The cart is shedding little tears 😢
            </p>
        </div>
    );
};

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);
    const CartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const HandleRemoveFromCart = (item) => {
        dispatch(RemoveFromCart({ _id: item._id, variation: item.variation }));
        toast.success(`${item.name} removed from cart`);
    };

    const HandleIncrementQuantity = (item) => {
        dispatch(IncrementProduct({ _id: item._id, variation: item.variation }));
    };

    const HandleDecrementQuantity = (item) => {
        dispatch(DecrementProduct({ _id: item._id, variation: item.variation }));
    };

    const HandleClearCart = () => {
        setIsClearing(true);
        toast.loading("Clearing Cart ....", { duration: 3000 });
        const timer = setTimeout(() => {
            dispatch(ClearCart());
            setIsClearing(false);
            toast.success("Cart has been cleared");
        }, 3000);
        return () => clearTimeout(timer);
    };

    const SubTotal = CartItems.reduce(
        (sum, item) =>
            sum + (item.price - (item.price / 100) * item.discount) * item.quantity,
        0
    );

    const HandleCheckout = () => {
        if (!CartItems || CartItems.length === 0) {
            toast.error("Cart is Empty");
            return;
        }

        navigate("/checkout", {
            state: { products: CartItems, source: "cart" },
        });
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
        <section className="bg-white py-10 font-poppins">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div
                    className={`transition-opacity duration-1000 ${isClearing ? "opacity-0" : "opacity-100"
                        }`}
                >
                    {CartItems.length > 0 ? (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 sm:text-3xl mb-6">
                                Shopping Cart
                            </h2>
                            <div className="mt-4 md:gap-8 lg:flex lg:items-start xl:gap-12">
                                {/* LEFT SIDE - CART ITEMS */}
                                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                                    {CartItems.map((p, index) => (
                                        <div
                                            key={index}
                                            className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                                {/* IMAGE */}
                                                <img
                                                    className="h-24 w-24 object-cover rounded-lg border"
                                                    src={p.mainImage}
                                                    alt={p.name}
                                                />

                                                {/* DETAILS */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <p className="text-lg font-medium text-gray-900 hover:text-green-700">
                                                        {p.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <button
                                                            className="flex items-center gap-1 hover:text-green-700 hover:cursor-pointer"
                                                            onClick={() =>
                                                                toast.success(`${p.name} added to favorites`)
                                                            }
                                                        >
                                                            ❤️ Add to Favorites
                                                        </button>
                                                        <FaTrash
                                                            onClick={() => HandleRemoveFromCart(p)}
                                                            className="text-red-500 hover:text-red-600 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                {/* QUANTITY + PRICE */}
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center border rounded-lg overflow-hidden">
                                                        <button
                                                            className={`px-3 py-1 text-gray-700 bg-gray-100 ${p.quantity === 1
                                                                ? "cursor-not-allowed opacity-50"
                                                                : "hover:bg-gray-200 hover:cursor-pointer"
                                                                }`}
                                                            onClick={() => HandleDecrementQuantity(p)}
                                                            disabled={p.quantity === 1}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={p.quantity}
                                                            className="w-12 text-center text-sm font-medium border-x bg-white"
                                                        />
                                                        <button
                                                            className={`px-3 py-1 text-gray-700 bg-gray-100 ${p.quantity === p.variation.stock
                                                                ? "cursor-not-allowed opacity-50"
                                                                : "hover:bg-gray-200 hover:cursor-pointer"
                                                                }`}
                                                            onClick={() => HandleIncrementQuantity(p)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <p className="text-lg font-bold text-gray-900">
                                                        Rs{" "}
                                                        {(
                                                            (p.price - (p.price / 100) * p.discount) *
                                                            p.quantity
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        className="bg-white border border-2 border-red-700 rounded-lg text-black font-medium px-12 py-3 hover:bg-red-700 hover:cursor-pointer hover:text-white transition delay-100 ease-in-out"
                                        onClick={() => HandleClearCart()}
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                {/* RIGHT SIDE - ORDER SUMMARY */}
                                <div className="mx-auto mt-6 w-full max-w-sm lg:mt-0">
                                    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Order Summary
                                        </h3>

                                        <div className="space-y-3">
                                            <dl className="flex justify-between text-gray-600">
                                                <dt>Subtotal</dt>
                                                <dd className="font-medium text-gray-900">
                                                    Rs {SubTotal.toFixed(2)}
                                                </dd>
                                            </dl>
                                            <dl className="flex justify-between text-gray-600">
                                                <dt>Tax (5% GST)</dt>
                                                <dd className="font-medium text-gray-900">
                                                    Rs {((SubTotal / 100) * 5).toFixed(2)}
                                                </dd>
                                            </dl>
                                        </div>

                                        <dl className="flex justify-between border-t pt-3 text-lg font-bold text-gray-900">
                                            <dt>Total</dt>
                                            <dd>
                                                Rs {(((SubTotal / 100) * 5 + SubTotal)).toFixed(2)}
                                            </dd>
                                        </dl>

                                        <button
                                            className="w-full rounded-lg bg-green-600 px-5 py-3 text-white font-medium hover:bg-green-700 transition hover:cursor-pointer"
                                            onClick={HandleCheckout}
                                        >
                                            Proceed to Checkout
                                        </button>

                                        <div className="flex justify-center items-center gap-2 text-sm">
                                            <span className="text-gray-500">or</span>
                                            <a
                                                href="#"
                                                className="text-green-700 font-medium hover:underline hover:cursor-pointer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.history.back();
                                                }}
                                            >
                                                Continue Shopping →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <EmptyCartAnimation />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Cart;