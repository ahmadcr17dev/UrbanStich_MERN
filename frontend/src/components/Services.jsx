import React from "react";

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Custom Garment Store Design",
            description:
                "We design fully customized online stores that reflect your brand identity and attract fashion-conscious customers with stunning visuals and smooth navigation.",
            color: "green-800",
        },
        {
            id: 2,
            title: "Product Photography & Display",
            description:
                "We help you showcase your apparel products with high-quality images, smart categorization, and clean layout to enhance your customer’s buying experience.",
            color: "green-800",
        },
        {
            id: 3,
            title: "Inventory & Order Management",
            description:
                "Track stock, manage product variations, and monitor order statuses effortlessly through our integrated management tools for your e-commerce clothing store.",
            color: "green-800",
        },
        {
            id: 4,
            title: "Secure Payment Integration",
            description:
                "Enable safe and fast transactions through trusted payment gateways like Stripe, PayPal, or JazzCash — ensuring smooth checkout for your customers.",
            color: "green-800",
        },
    ];

    return (
        <div className="relative flex flex-col justify-between w-full h-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-32 mt-[150px]">
            {/* Heading */}
            <h2 className="mb-2 text-3xl sm:text-4xl lg:text-5xl text-center font-semibold leading-tight text-black font-poppins">
                Our Services
            </h2>
            <p className="mb-12 text-sm sm:text-sm md:text-base text-green-800 text-center font-montserrat font-medium">
                Explore our professional e-commerce services crafted specially for your
                fashion and garment business.
            </p>

            {/* Service Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {services.map((service) => (
                    <div key={service.id} className="relative h-full">
                        <span
                            className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-${service.color} rounded-lg`}
                        ></span>
                        <div
                            className={`relative h-full p-5 md:p-6 lg:p-8 bg-white border-2 border-${service.color} rounded-lg shadow-md hover:shadow-lg transition duration-300`}
                        >
                            <h3 className="my-2 text-lg md:text-xl font-semibold text-green-800 font-poppins">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base font-montserrat">
                                {service.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;