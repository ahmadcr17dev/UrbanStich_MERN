import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger confetti burst when the page loads
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
        });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
            <motion.div
                className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Success Icon */}
                <motion.div
                    className="flex justify-center mb-6"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-lg" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="text-3xl font-bold text-gray-800 mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Payment Successful 🎉
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-gray-600 mb-8 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Thank you for your order!
                    We’re preparing your package and will notify you once it’s on the way.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-600 transition duration-300 hover:cursor-pointer"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;