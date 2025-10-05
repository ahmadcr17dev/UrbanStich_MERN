import React from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Ahmed",
            role: "Fashion Designer",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            text: "Absolutely loved how my online store turned out! The team perfectly captured my brand’s vibe and improved noticeably.",
            rating: 5,
        },
        {
            id: 2,
            name: "Bilal Khan",
            role: "Clothing Brand Owner",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
            text: "A very professional and smooth experience! The e-commerce setup was quick and mobile-friendly.",
            rating: 4,
        },
        {
            id: 3,
            name: "Fatima Noor",
            role: "Boutique Owner",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            text: "Highly recommended for anyone starting an online store. Everything from design to SEO was on point!",
            rating: 5,
        },
        {
            id: 4,
            name: "Zain Malik",
            role: "Store Manager",
            image: "https://randomuser.me/api/portraits/men/33.jpg",
            text: "Very responsive and detail-oriented team. My store looks premium and is super easy to manage.",
            rating: 4,
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 700,
        autoplaySpeed: 4000,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1280, // xl
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 1024, // lg
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // md
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 640, // sm
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="w-[100%] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-40 py-16 bg-gray-50 mt-[150px]">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center mb-3 text-black font-poppins">
                What Our Clients Say
            </h2>
            <p className="text-center text-green-800 mb-10 font-montserrat text-sm font-medium">
                Hear from our satisfied clients about their experience working with us.
            </p>

            {/* Testimonials Slider */}
            <Slider {...settings}>
                {testimonials.map((t) => (
                    <div key={t.id} className="px-2 sm:px-4">
                        <div className="relative bg-white rounded-2xl border border-green-200 shadow-md hover:shadow-lg transition duration-300 p-5 sm:p-6 md:p-8 h-full flex flex-col items-center text-center">
                            <FaQuoteLeft className="text-green-400 text-2xl sm:text-3xl mb-4" />
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-montserrat mb-4 italic leading-relaxed">
                                “{t.text}”
                            </p>

                            <div className="flex justify-center mb-2">
                                {[...Array(t.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-400 text-sm sm:text-base" />
                                ))}
                            </div>

                            <img
                                src={t.image}
                                alt={t.name}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-green-300 mb-3"
                            />

                            <h3 className="font-poppins font-semibold text-green-800 text-base sm:text-lg">
                                {t.name}
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm font-montserrat">
                                {t.role}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Testimonials;