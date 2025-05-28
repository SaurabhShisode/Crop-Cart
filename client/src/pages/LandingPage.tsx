import { useEffect, useState } from 'react';
import heroImage from '../assets/hero.png';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faBoxOpen, faHandHoldingHeart, faSearch, faShoppingCart, faTruck } from '@fortawesome/free-solid-svg-icons';
import InstagramIcon from '../assets/icons/instagram.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import TwitterIcon from '../assets/icons/twitter.svg';
import logo from '../assets/logo.png';

export default function LandingPage() {
    const [loaded, setLoaded] = useState(false);
    const [active, setActive] = useState('home');


    const navigate = useNavigate();

    useEffect(() => {
        setLoaded(true);
    }, []);



    const cards = [
        {
            icon: faSeedling,
            title: "Empower Farmers",
            text: "We provide a platform for farmers to sell directly, gain better margins, and grow sustainably."
        },
        {
            icon: faBoxOpen,
            title: "Fresh Produce Delivery",
            text: "Consumers get farm-fresh fruits and vegetables delivered straight from the source—no middlemen."
        },
        {
            icon: faHandHoldingHeart,
            title: "Community First",
            text: "We build stronger local economies and foster trust by connecting neighbors through fresh food."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 dark:text-white flex flex-col transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50 flex justify-between items-center p-6">
                <div className="flex items-center space-x-2 text-2xl font-extrabold text-green-700 dark:text-green-400">
                    <img src={logo} alt="CropCart Logo" className="w-8 h-8" />

                    <span>CropCart</span>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
                    {['home', 'about', 'contact'].map(section => (
                        <button
                            key={section}
                            onClick={() => {
                                const elementId = section === 'home' ? null : section === 'about' ? 'what-we-do' : 'contact-us';
                                if (elementId) {
                                    const element = document.getElementById(elementId);
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                                setActive(section);
                            }}
                            className={`font-semibold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${active === section
                                ? 'bg-green-200 text-green-800 dark:bg-green-500 dark:text-white'
                                : 'text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400'
                                }`}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="space-x-4 flex items-center">


                    <button className="px-5 py-3 bg-green-100 text-green-700 hover:bg-green-200 font-semibold rounded-md text-lg">
                        Sell Your Produce
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 text-lg"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white rounded-md text-lg font-semibold"
                    >
                        Sign up
                    </button>
                </div>
            </nav>





            {/* Hero Section */}
            <section className="relative bg-green-900 text-white overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between px-10 py-24 max-w-7xl mx-auto">
                    <div className={`max-w-xl space-y-8 transition-all duration-700 ease-out transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'}`}>
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Buy Fresh Crops <br />Directly from Local Farmers
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-semibold">
                            Join our platform to discover fresh, high-quality produce from farmers nearby and support your community.
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-md font-semibold"
                        >
                            Get Started
                        </button>

                    </div>
                    <div className={`relative max-w-sm mx-auto transition-all duration-700 ease-out transform ${loaded ? 'translate-y-20 opacity-100' : 'translate-y-[150px] opacity-0'}`}>
                        <img
                            src={heroImage}
                            alt="Hero"
                            className="w-full object-contain drop-shadow-2xl scale-125 relative z-0"
                        />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
                    <svg
                        className="relative block w-[calc(100%+1.3px)] h-[80px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0 0 C 600 120 600 120 1200 0 L1200 120 L0 120 Z"
                            className="fill-[#F9F9F9] dark:fill-gray-900"
                        />
                    </svg>
                </div>

            </section>

            {/* What We Do Section */}
            <section id="what-we-do" className="mt-20 py-24 px-6 md:px-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6">What We Do</h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-16 font-semibold leading-relaxed">
                        We connect local farmers directly with consumers through an intuitive, transparent, and fair marketplace.
                    </p>

                    <div className="grid gap-12 md:grid-cols-3">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="cursor-pointer group bg-[#F9F9F9] p-10 rounded-3xl shadow-md hover:shadow-xl hover:bg-green-50 transition duration-500 transform hover:-translate-y-4"
                            >
                                <div className="text-green-700 text-5xl mb-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                    <FontAwesomeIcon icon={card.icon} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                                    {card.title}
                                </h3>
                                <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300 text-lg leading-relaxed font-semibold">
                                    {card.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-20 py-24 px-6 md:px-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-6">How It Works</h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-16 font-semibold leading-relaxed">
                        A simple 3-step process to get fresh produce delivered to your doorstep.
                    </p>

                    <div className="grid gap-12 md:grid-cols-3">
                        {[
                            { icon: faSearch, title: "Explore", text: "Browse local farmers and their fresh produce listings." },
                            { icon: faShoppingCart, title: "Order", text: "Place an order directly with the farmer of your choice." },
                            { icon: faTruck, title: "Receive", text: "Get your order delivered fresh and fast to your door." },
                        ].map((step, index) => (
                            <div
                                key={index}
                                className="cursor-pointer group bg-[#F9F9F9] p-10 rounded-3xl shadow-md hover:shadow-xl hover:bg-green-50 transition duration-500 transform hover:-translate-y-4"
                            >
                                <div className="text-green-700 text-5xl mb-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                    <FontAwesomeIcon icon={step.icon} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300 text-lg leading-relaxed font-semibold">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-20 py-24 px-6 md:px-20 ">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">Voices of Trust</h2>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-16 font-semibold leading-relaxed">
                        Hear directly from the farmers whose lives we're transforming.
                    </p>

                    <div className="grid gap-12 md:grid-cols-2">
                        {[
                            {
                                name: "Ravi Kumar",
                                text: "Thanks to CropCart, I now earn 30% more by selling directly to customers. It's a game-changer for small farmers like me!",
                            },
                            {
                                name: "Sita Devi",
                                text: "No middlemen, no hassle. I feel empowered and connected to my community like never before.",
                            },
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="cursor-pointer group bg-[#F9F9F9] dark:bg-green-900 p-10 rounded-3xl shadow-md hover:shadow-xl hover:bg-green-50 dark:hover:bg-green-800 transition duration-500 transform hover:-translate-y-4 text-left"
                            >
                                <p className="text-gray-700 dark:text-green-100 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-300 italic mb-4 font-semibold">
                                    “{testimonial.text}”
                                </p>
                                <div className="text-green-700 dark:text-green-300 font-bold text-lg group-hover:text-green-800 dark:group-hover:text-green-100 transition-colors duration-300">
                                    — {testimonial.name}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <section className="mt-20 py-24 px-6 md:px-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">Frequently Asked Questions</h2>
                    <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-16 font-semibold leading-relaxed">
                        Have questions? We’ve got answers to help you understand how CropCart works.
                    </p>

                    <div className="max-w-4xl mx-auto text-left space-y-0">
                        {[
                            {
                                question: "How do I place an order on CropCart?",
                                answer:
                                    "Browse the available produce, add items to your cart, and proceed to checkout with your preferred payment method. Your fresh produce will be delivered directly to your doorstep.",
                            },
                            {
                                question: "Are there any delivery charges?",
                                answer:
                                    "Delivery charges depend on your location and order size. We strive to keep them affordable and transparent before you complete your purchase.",
                            },
                            {
                                question: "How does CropCart ensure product quality?",
                                answer:
                                    "All farmers undergo a quality check and are encouraged to maintain freshness and hygiene standards. We also welcome your feedback to keep improving.",
                            },
                            {
                                question: "Can I return or exchange products?",
                                answer:
                                    "Since produce is perishable, returns are generally not accepted. However, if there’s an issue with your order, please contact our support team and we’ll do our best to resolve it.",
                            },
                        ].map(({ question, answer }, idx) => (
                            <details
                                key={idx}
                                className="bg-[#F9F9F9] rounded-3xl p-8 cursor-pointer hover:bg-green-50 transition duration-500"
                            >
                                <summary className="font-semibold text-lg md:text-base leading-6 list-none focus:outline-none text-green-700 hover:text-green-800">
                                    {question}
                                </summary>
                                <p className="mt-3 text-gray-700">{answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>







            {/* Contact Section */}
            <section id="contact-us" className="mt-20 py-24 px-6 md:px-20 bg-green-50 text-green-900">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Get in Touch</h2>
                    <p className="max-w-3xl mx-auto mb-16 text-xl font-semibold leading-relaxed">
                        Have questions or want to partner with us? Reach out and we'll get back to you as soon as possible.
                    </p>

                    <form className="max-w-xl mx-auto space-y-8 text-left">
                        <div>
                            <label htmlFor="name" className="block mb-3 font-bold text-lg">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full px-5 py-3 rounded-md border border-green-300 focus:outline-none focus:ring-3 focus:ring-green-600 text-lg"
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-3 font-bold text-lg">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-5 py-3 rounded-md border border-green-300 focus:outline-none focus:ring-3 focus:ring-green-600 text-lg"
                                placeholder="Your email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block mb-3 font-bold text-lg">Message</label>
                            <textarea
                                id="message"
                                rows={5}
                                className="w-full px-5 py-3 rounded-md border border-green-300 focus:outline-none focus:ring-3 focus:ring-green-600 text-lg"
                                placeholder="Write your message here..."
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-md font-bold text-xl transition"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-green-950 text-green-100 py-16 px-6 md:px-20 mt-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Info */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">CropCart</h2>
                        <p className="text-green-300 text-sm leading-relaxed">
                            Bridging the gap between farms and families. Get fresh, local, and seasonal produce delivered with care.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Our Farmers</a></li>
                            <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="flex flex-col items-start">
                        <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Instagram" className="hover:text-green-400 text-white transition">
                                <img src={InstagramIcon} alt="Instagram" className="w-6 h-6 filter brightness-0 invert" />
                            </a>
                            <a href="#" aria-label="Facebook" className="hover:text-green-400 text-white transition">
                                <img src={FacebookIcon} alt="Facebook" className="w-6 h-6 filter brightness-0 invert" />
                            </a>
                            <a href="#" aria-label="Twitter" className="hover:text-green-400 text-white transition">
                                <img src={TwitterIcon} alt="Twitter" className="w-6 h-6 filter brightness-0 invert" />
                            </a>
                        </div>
                    </div>


                </div>

                <div className="mt-16 border-t border-green-800 pt-6 text-center text-sm text-green-500">
                    © 2025 <span className="font-semibold">CropCart</span>. All rights reserved.
                </div>
            </footer>



        </div>
    );
}
