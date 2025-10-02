import urbanstichlogo from "../images/urbanstichlogo.png";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { FaApple } from "react-icons/fa";
import { RiGooglePlayFill } from "react-icons/ri";
import {
    TiSocialYoutubeCircular,
    TiSocialFacebookCircular,
    TiSocialInstagramCircular,
    TiSocialPinterestCircular,
} from "react-icons/ti";

export const Footer = () => {
    return (
        <footer className="bg-green-900 text-white font-montserrat px-0 mt-48">
            <div className="mx-auto px-6 2xl:px-12 xl:px-12 lg:px-8 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand Info */}
                <div className="w-fit">
                    <img
                        src={urbanstichlogo}
                        alt="Site Logo"
                        className="w-[180px] sm:w-[200px] lg:w-[200px] mb-4"
                    />
                    <p className="text-sm leading-6 text-green-100">
                        UrbanStich – Styles & Fashions <br />
                        Shop #12, Ground Floor, Green Plaza, <br />
                        G-11 Markaz, Islamabad, Pakistan
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-green-100 text-sm hover:text-white transition-colors">
                        <MdLocalPhone className="text-sm" />
                        <a href="tel:+923226212707">+92 322 6212707</a>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-green-100 text-sm hover:text-white transition-colors">
                        <MdEmail className="text-sm" />
                        <a href="mailto:urbanstich123@gmail.com">urbanstich123@gmail.com</a>
                    </div>
                </div>

                {/* Popular Categories */}
                <div>
                    <h5 className="font-poppins font-semibold text-lg mb-4 border-b border-green-700 pb-2 w-fit">
                        Popular Categories
                    </h5>
                    <ul className="space-y-2 text-green-100 flex flex-col w-fit text-sm">
                        <a href="#" className="hover:text-white transition-colors"> Shirts </a>
                        <a href="#" className="hover:text-white transition-colors"> Pents </a>
                        <a href="#" className="hover:text-white transition-colors"> Watches </a>
                        <a href="#" className="hover:text-white transition-colors"> Formal </a>
                        <a href="#" className="hover:text-white transition-colors"> Coats </a>
                        <a href="#" className="hover:text-white transition-colors"> Accessories </a>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h5 className="font-poppins font-semibold text-lg mb-4 border-b border-green-700 pb-2 w-fit">
                        Quick Links
                    </h5>
                    <ul className="space-y-2 text-green-100 flex flex-col w-fit text-sm">
                        <a href="#" className="hover:text-white transition-colors"> About Us </a>
                        <a href="#" className="hover:text-white transition-colors"> Contact Us </a>
                        <a href="#" className="hover:text-white transition-colors"> Delivery </a>
                        <a href="#" className="hover:text-white transition-colors"> Blogs </a>
                    </ul>
                </div>

                {/* Download App & Socials */}
                <div>
                    <h5 className="font-poppins font-semibold text-lg mb-4 border-b border-green-700 pb-2 w-fit">
                        Download Our App
                    </h5>
                    <div className="flex items-center gap-4 text-2xl text-green-100 mb-6">
                        <a href="https://www.apple.com" target="_blank" className="hover:text-white transition-colors">
                            <FaApple />
                        </a>
                        <a href="https://www.googleplay.com" target="_blank" className="hover:text-white transition-colors">
                            <RiGooglePlayFill />
                        </a>
                    </div>

                    <h5 className="font-poppins font-semibold text-lg mb-4">
                        Follow Us
                    </h5>
                    <div className="flex items-center gap-3 text-3xl text-green-100">
                        <a
                            href="https://www.youtube.com"
                            target="_blank"
                            className="hover:text-white transition-colors"
                        >
                            <TiSocialYoutubeCircular />
                        </a>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            className="hover:text-white transition-colors"
                        >
                            <TiSocialFacebookCircular />
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            className="hover:text-white transition-colors"
                        >
                            <TiSocialInstagramCircular />
                        </a>
                        <a
                            href="https://www.pinterest.com"
                            target="_blank"
                            className="hover:text-white transition-colors"
                        >
                            <TiSocialPinterestCircular />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-green-800 text-center text-sm text-green-200 py-4">
                © {new Date().getFullYear()} UrbanStich. All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
