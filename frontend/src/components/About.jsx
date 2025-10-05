import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaHandshake, FaShoppingBag, FaCheckCircle } from "react-icons/fa";

const About = () => {
    return (
        <section className="w-full bg-gradient-to-b from-white via-green-100 to-white pb-20 pt-10 px-6 sm:px-10 lg:px-24 mt-[100px]">
            <div className="max-w-6xl mx-auto text-center">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl font-bold text-green-900 mb-4 font-poppins"
                >
                    About <span className="text-green-600">Our Store</span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-green-800 text-sm font-montserrat mb-12 text-center mx-auto font-medium"
                >
                    Redefining fashion through comfort, sustainability, and timeless design.
                </motion.p>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    {[
                        {
                            icon: <FaLeaf className="text-green-600 text-3xl mb-3" />,
                            title: "Sustainable Fabrics",
                            desc: "We use eco-friendly materials that respect both your skin and the environment.",
                        },
                        {
                            icon: <FaShoppingBag className="text-green-600 text-3xl mb-3" />,
                            title: "Modern Collection",
                            desc: "Our styles combine elegance with comfort — designed for the modern generation.",
                        },
                        {
                            icon: <FaHandshake className="text-green-600 text-3xl mb-3" />,
                            title: "Customer Commitment",
                            desc: "We prioritize transparency, trust, and long-term satisfaction in every purchase.",
                        },
                        {
                            icon: <FaCheckCircle className="text-green-600 text-3xl mb-3" />,
                            title: "Premium Quality",
                            desc: "Each product is tested and inspected to maintain the highest quality standards.",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 border border-green-100 hover:border-green-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                {item.icon}
                                <h3 className="text-green-800 font-poppins text-lg font-semibold mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 font-montserrat text-sm sm:text-base leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-16 bg-green-600 text-white rounded-3xl shadow-lg p-10 sm:p-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-400 opacity-20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl"></div>

                    <h3 className="text-2xl sm:text-3xl font-poppins font-semibold mb-4">
                        Our Mission
                    </h3>
                    <p className="text-base sm:text-lg font-montserrat leading-relaxed max-w-3xl mx-auto">
                        To deliver stylish, sustainable, and affordable fashion that empowers every
                        individual. We are dedicated to creating positive change through innovation,
                        responsibility, and care — making every outfit a step toward a greener future.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default About;