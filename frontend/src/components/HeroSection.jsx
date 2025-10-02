import heroimage from "../images/heroimage.png";
import Marquee from "react-fast-marquee";
import { MdAccessTimeFilled, MdLocalShipping, MdShoppingBasket, MdPriceChange, MdCreditCard } from "react-icons/md";
import cat1 from "../images/cat1.png";
import cat2 from "../images/cat2.png";
import cat3 from "../images/cat3.png";
import cat4 from "../images/cat4.png";
import cat5 from "../images/cat5.png";
import cat6 from "../images/cat6.webp";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

const HeroSection = () => {
    const categories = [
        { name: "Shirts", img: cat1, bg: "bg-green-100" },
        { name: "Pents", img: cat2, bg: "bg-yellow-100" },
        { name: "Watches", img: cat3, bg: "bg-pink-100" },
        { name: "Coats", img: cat4, bg: "bg-red-100" },
        { name: "Formal", img: cat5, bg: "bg-blue-100" },
        { name: "Accessories", img: cat6, bg: "bg-purple-100" }
    ];

    return (
        <>
            <section className="flex flex-col-reverse lg:flex-row justify-between items-center px-6 md:px-10 lg:px-14 xl:px-14 2xl:px-14 py-12 sm:py-16 lg:py-20 xl:py-24 gap-8 sm:gap-10 lg:gap-12">

                {/* Left Content */}
                <div className="w-full lg:w-1/2 max-w-xl text-center lg:text-left">
                    {/* Subtitle */}
                    <h5 className="font-montserrat bg-green-200 text-green-800 font-medium px-4 sm:px-6 py-2 text-[12px] 2xl:text-xs xl:text-xs lg:text-xs md:text-base rounded-full inline-block">
                        Your Trusted Partner for Daily Needs
                    </h5>

                    {/* Title */}
                    <h1 className="font-poppins text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-[54px] font-bold leading-snug sm:leading-snug lg:leading-tight mt-4 sm:mt-6">
                        Discover <span className="text-green-600">Everyday</span> Fashion Crafted for Modern <span className="text-green-600">Living</span>
                    </h1>

                    {/* Paragraph */}
                    <p className="font-montserrat text-gray-700 lg:text-sm text-sm sm:text-base md:text-lg mt-4 sm:mt-5 lg:mt-6 max-w-lg mx-auto lg:mx-0 flex items-justified">
                        UrbanStitch brings you a curated collection of trendy shirts, pants, and everyday essentials designed for modern lifestyles.
                        Our focus is on comfort, quality, and timeless style that fits every occasion.
                        Shop with confidence and upgrade your wardrobe with pieces made to last.
                    </p>

                    {/* Button */}
                    <button className="border border-green-600 px-12 sm:px-10 md:px-12 lg:px-14 xl:px-16 py-2.5 sm:py-3 md:py-3.5 rounded-full mt-5 sm:mt-6 font-montserrat lg:text-sm sm:text-base md:text-lg font-medium hover:bg-green-600 hover:text-white transition duration-300 ease-in-out hover:cursor-pointer">
                        Shop Now
                    </button>
                </div>

                {/* Right Image */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <img
                        src={heroimage}
                        alt="Fresh groceries delivery"
                        className="w-full h-[600px] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl object-contain"
                    />
                </div>
            </section>

            {/* Marquee Effect */}
            <Marquee
                speed={60}
                gradient={false}
                className="bg-yellow-100 py-4 mb-10"
            >
                <div className="flex flex-wrap gap-x-10 gap-y-3 items-center text-sm sm:text-base font-montserrat font-medium px-4">

                    {/* 24/7 Service */}
                    <div className="flex items-center gap-2 min-w-max">
                        <MdAccessTimeFilled className="text-green-600 text-xl sm:text-2xl" />
                        <span>24/7 Service Always There For You</span>
                    </div>

                    {/* Free Delivery */}
                    <div className="flex items-center gap-2 min-w-max">
                        <MdLocalShipping className="text-blue-600 text-xl sm:text-2xl" />
                        <span>Free Delivery From Rs 1500</span>
                    </div>

                    {/* Fresh Products */}
                    <div className="flex items-center gap-2 min-w-max">
                        <MdShoppingBasket className="text-orange-600 text-xl sm:text-2xl" />
                        <span>Fresh Products Every Day</span>
                    </div>

                    {/* Low Price */}
                    <div className="flex items-center gap-2 min-w-max">
                        <MdPriceChange className="text-purple-600 text-xl sm:text-2xl" />
                        <span>Low Price Than Local Market</span>
                    </div>

                    {/* Safe Payment */}
                    <div className="flex items-center gap-2 min-w-max">
                        <MdCreditCard className="text-red-600 text-xl sm:text-2xl" />
                        <span>Safe Payment With Any Bank Card</span>
                    </div>

                </div>
            </Marquee>
            {/* Marquee Effect */}

            {/* Categories Section */}
            <section className="px-6 sm:px-10 lg:px-12 xl:px-12 mt-[120px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800">
                        Popular Categories
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

        </>
    )
}

export default HeroSection;