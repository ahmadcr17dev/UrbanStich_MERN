import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FiTruck, FiPercent } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { ClearCart } from "../store/cartSlice";
import { RemoveFromWishlist } from "../store/wishSlice";

const Checkout = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        jazzcashMobile: "",
        jazzcashMpin: "",
        easypaisaMobile: "",
        easypaisaPin: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("card");
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const rawProducts = location.state?.products || [];
    const source = location.state?.source;
    const products = Array.isArray(rawProducts) ? rawProducts : [rawProducts];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Format card number with spaces
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\s/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        value = value.replace(/(.{4})/g, '$1 ').trim();
        setFormData({ ...formData, cardNumber: value });
    };

    const handleChangeExpiry = (e) => {
        setFormData({
            ...formData,
            expiry: e.target.value, // format: YYYY-MM
        });
    };

    const validateForm = () => {
        const errors = [];

        // Customer info validation - MATCH BACKEND EXPECTATIONS
        if (!formData.firstName || formData.firstName.length < 2) errors.push("First name must be at least 2 characters");
        if (!formData.lastName || formData.lastName.length < 2) errors.push("Last name must be at least 2 characters");
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.push("Valid email is required");
        if (!formData.phone || !/^\+?[\d\s-]{10,}$/.test(formData.phone)) errors.push("Valid phone number is required");
        if (!formData.address || formData.address.length < 5) errors.push("Address is required");
        if (!formData.city || formData.city.length < 2) errors.push("City is required");
        if (!formData.state || formData.state.length < 2) errors.push("State is required");

        // ZIP CODE VALIDATION - FIXED
        if (!formData.zip || !/^\d{5}$/.test(formData.zip)) {
            errors.push("Valid ZIP code is required (5 digits)");
        }

        // Payment method specific validation
        if (paymentMethod === 'card') {
            if (!formData.cardName || formData.cardName.length < 3) errors.push("Card name is required");

            // CARD NUMBER VALIDATION - FIXED
            const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
            if (!cleanCardNumber || cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
                errors.push("Valid 16-digit card number is required");
            }

            // CVV VALIDATION - FIXED
            if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
                errors.push("Valid CVV is required");
            }
        }

        if (paymentMethod === 'jazzcash') {
            if (!formData.jazzcashMobile || !/^03\d{9}$/.test(formData.jazzcashMobile)) errors.push("Valid JazzCash mobile number (03XXXXXXXXX) is required");
            if (!formData.jazzcashMpin || !/^\d{4}$/.test(formData.jazzcashMpin)) errors.push("Valid 4-digit MPIN is required");
        }

        if (paymentMethod === 'easypaisa') {
            if (!formData.easypaisaMobile || !/^03\d{9}$/.test(formData.easypaisaMobile)) errors.push("Valid EasyPaisa mobile number (03XXXXXXXXX) is required");
            if (!formData.easypaisaPin || !/^\d{4}$/.test(formData.easypaisaPin)) errors.push("Valid 4-digit PIN is required");
        }

        return errors;
    };

    const HandleClearCart = () => {
        dispatch(ClearCart());
    };

    const HandleRemoveFromWishlist = (productId) => {
        try {
            const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            console.log("Before remove:", storedWishlist);

            const updatedWishlist = storedWishlist.filter(
                (item) => item.id !== productId && item._id !== productId && item.productId !== productId
            );

            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
            setWishlistItems(updatedWishlist);

            console.log("After remove:", updatedWishlist);
            toast.success("Item removed from wishlist");
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Validate form
        const errors = validateForm();
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            setProcessing(false);
            return;
        }

        try {
            // Prepare payment data
            const paymentData = {
                customerInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zip
                },
                products: products.map(p => ({
                    name: p.name,
                    price: p.discount ? p.price - (p.price * p.discount) / 100 : p.price,
                    quantity: p.quantity || 1,
                    discount: p.discount || 0
                })),
                paymentMethod: paymentMethod,
                paymentDetails: formData,
                amount: {
                    subtotal: parseFloat(subtotal),
                    tax: parseFloat(tax),
                    shipping: parseFloat(shipping),
                    total: parseFloat(total)
                }
            };

            console.log('🔄 Sending payment request to:', import.meta.env.VITE_API_PAYMENT_PROCESS);

            // Send payment request to backend with better error handling
            const response = await fetch(import.meta.env.VITE_API_PAYMENT_PROCESS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            // Try to parse JSON response
            let result;
            try {
                const text = await response.text();
                result = text ? JSON.parse(text) : {};
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Invalid response from server');
            }

            if (result.success) {
                toast.success('Payment processed successfully!');
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    zip: "",
                    cardName: "",
                    cardNumber: "",
                    expiry: "",
                    cvv: "",
                    jazzcashMobile: "",
                    jazzcashMpin: "",
                    easypaisaMobile: "",
                    easypaisaPin: ""
                });
                if (source === "cart") {
                    HandleClearCart();
                } if (source === "wishlist" && products && products[0]) {
                    const item = products[0];
                    dispatch(RemoveFromWishlist({ _id: item._id, variation: item.variation }));
                }
                navigate("/ordersuccess");
            } else {
                // Show backend validation errors
                toast.error(result.message || 'Payment failed');
                if (result.errors && Array.isArray(result.errors)) {
                    result.errors.forEach(error => toast.error(error));
                }
            }

        } catch (error) {
            console.error('❌ Payment error:', error);

            // Show specific error messages based on error type
            if (error.message.includes('Backend server not found')) {
                toast.error(
                    <div>
                        <strong>Backend Server Not Running</strong>
                        <br />
                        Please start your backend server on port 8080
                    </div>,
                    { duration: 5000 }
                );
            } else if (error.message.includes('Failed to fetch')) {
                toast.error('Cannot connect to server. Please check your internet connection and make sure the backend is running.');
            } else {
                toast.error(error.message || 'Payment processing failed. Please try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    // Calculate totals
    const { subtotal, tax, shipping, total } = useMemo(() => {
        let subtotalAcc = 0;
        products.forEach((p) => {
            const qty = p.quantity || 1;
            const priceAfterDiscount = p.discount
                ? p.price - (p.price * p.discount) / 100
                : p.price;
            subtotalAcc += priceAfterDiscount * qty;
        });

        const shipping = products.length > 0 ? 350 : 0;
        const tax = subtotalAcc / 100 * 5;
        const total = subtotalAcc + shipping + tax;

        return {
            subtotal: subtotalAcc.toFixed(2),
            tax: tax.toFixed(2),
            shipping: shipping.toFixed(2),
            total: total.toFixed(2),
        };
    }, [products]);

    return (
        <>
            <div className="bg-gray-50 py-10 font-poppins">
                <div className="max-w-6xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
                    {/* Server Status Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            🛒 Product Checkout with Shipping Details
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Side - Delivery Details + Payment */}
                        <div className="lg:col-span-2">
                            {/* Delivery Details */}
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                Delivery Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {["firstName", "lastName", "email", "phone", "address", "city", "state", "zip"].map((field, i) => (
                                    <input
                                        key={i}
                                        type={field === "email" ? "email" : "text"}
                                        name={field}
                                        placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                    />
                                ))}
                            </div>

                            {/* Payment Section */}
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Method</h3>

                            {/* Payment Method Selection */}
                            <div className="flex gap-6 items-center mb-4 flex-wrap">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === "card"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="text-gray-700">Credit/Debit Card</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="jazzcash"
                                        checked={paymentMethod === "jazzcash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="text-gray-700">JazzCash</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="easypaisa"
                                        checked={paymentMethod === "easypaisa"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span className="text-gray-700">EasyPaisa</span>
                                </label>
                            </div>

                            {/* Card Payment Form */}
                            {paymentMethod === "card" && (
                                <>
                                    <div className="flex gap-2 mb-6">
                                        <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-8" />
                                        <img src="https://img.icons8.com/color/48/mastercard.png" alt="MasterCard" className="h-8" />
                                        <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-8" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <input
                                            type="text"
                                            name="cardName"
                                            placeholder="Cardholder Name"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="Card Number (4242 4242 4242 4242)"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={formData.cardNumber}
                                            onChange={handleCardNumberChange}
                                            maxLength={19}
                                            required
                                        />
                                        <input
                                            type="date"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={formData.expiry}
                                            onChange={handleChangeExpiry}
                                            min={new Date().toISOString().split("T")[0]} // today
                                            max="2035-12-31"
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="cvv"
                                            placeholder="CVV"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                    <div className="mb-6 p-3 bg-yellow-100 rounded text-sm">
                                        <p className="text-yellow-800">
                                            <strong>Demo:</strong> Use 4242 4242 4242 4242 or 16 digit number of your card
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* JazzCash Payment Form */}
                            {paymentMethod === "jazzcash" && (
                                <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                                    <h4 className="font-semibold text-blue-800 mb-3">JazzCash Payment</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="jazzcashMobile"
                                            placeholder="Mobile Number (03001234567)"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={formData.jazzcashMobile}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="jazzcashMpin"
                                            placeholder="MPIN (1234)"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                            value={formData.jazzcashMpin}
                                            onChange={handleChange}
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                    <div className="mt-3 p-3 bg-yellow-100 rounded text-sm">
                                        <p className="text-yellow-800">
                                            <strong>Demo:</strong> Use 03001234567 with MPIN 1234 or your own number
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* EasyPaisa Payment Form */}
                            {paymentMethod === "easypaisa" && (
                                <div className="mb-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
                                    <h4 className="font-semibold text-orange-800 mb-3">EasyPaisa Payment</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="easypaisaMobile"
                                            placeholder="Mobile Number (03451234567)"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                            value={formData.easypaisaMobile}
                                            onChange={handleChange}
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="easypaisaPin"
                                            placeholder="PIN (1234)"
                                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                            value={formData.easypaisaPin}
                                            onChange={handleChange}
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                    <div className="mt-3 p-3 bg-yellow-100 rounded text-sm">
                                        <p className="text-yellow-800">
                                            <strong>Demo:</strong> Use 03001234567 with MPIN 1234 or your own number
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="bg-gray-100 border px-6 py-2 rounded-lg hover:bg-gray-200 transition hover:cursor-pointer"
                                    onClick={() => navigate("/shop")}
                                >
                                    ← Continue Shopping
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-lg border border-green-100">
                            {/* Header */}
                            <h3 className="text-xl font-bold mb-6 text-green-800 flex items-center gap-2">
                                <FaShoppingCart className="w-6 h-6 text-green-600" />
                                Order Summary
                            </h3>

                            {/* List all products */}
                            <div className="space-y-4">
                                {products.map((p, index) => {
                                    const qty = p.quantity || 1;
                                    const priceAfterDiscount = p.discount
                                        ? p.price - (p.price * p.discount) / 100
                                        : p.price;
                                    const lineTotal = (priceAfterDiscount * qty).toFixed(2);

                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center border-b pb-3"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">{p.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Qty: {qty} ×{" "}
                                                    <span className="text-green-700 font-medium">
                                                        Rs {priceAfterDiscount.toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                            <span className="font-semibold text-green-900">
                                                Rs {lineTotal}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Totals */}
                            <div className="mt-6 border-t pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">Rs {subtotal}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-700">
                                    <span className="flex items-center gap-1">
                                        <FiTruck className="text-green-600" />
                                        Shipping{" "}
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            Standard
                                        </span>
                                    </span>
                                    <span className="font-semibold text-gray-900">Rs {shipping}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-700">
                                    <span className="flex items-center gap-1">
                                        <FiPercent className="text-green-600" /> Tax (5% GST)
                                    </span>
                                    <span className="font-semibold text-gray-900">Rs {tax}</span>
                                </div>

                                <div className="flex justify-between items-center font-bold text-lg text-green-900 border-t pt-3">
                                    <span>Total</span>
                                    <span className="text-xl">Rs {total}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium shadow-md transition hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' :
                                    paymentMethod === "card" ? "Pay with Card →" :
                                        paymentMethod === "jazzcash" ? "Pay with JazzCash →" :
                                            "Pay with EasyPaisa →"
                                }
                            </button>

                            {/* Payment Method Info */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Paying with: <span className="font-medium capitalize">{paymentMethod}</span>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Checkout;