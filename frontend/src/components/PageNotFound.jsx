import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { FaHome } from "react-icons/fa";

const PageNotFound = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Update confetti size dynamically
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4 overflow-hidden">
            {/* Crying confetti animation */}
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={150}
                gravity={0.3}
                colors={["#EF4444", "#10B981"]} // red & green combo
                recycle={true}
            />

            {/* 404 Text */}
            <h1 className="text-9xl font-extrabold text-red-500 animate-bounce">404</h1>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-800">
                Oops! Page not found 😢
            </h2>
            <p className="mt-2 text-gray-600 max-w-lg">
                The page you are looking for doesn’t exist.
                Even our server is shedding colorful confetti tears...
            </p>

            {/* Button */}
            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition-transform transform hover:scale-105"
            >
                <FaHome className="text-lg" /> Take me Home
            </Link>
        </div>
    );
};

export default PageNotFound;