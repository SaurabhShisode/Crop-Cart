import { useEffect, useState } from 'react';
import heroImage from '../assets/hero.png';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSeedling, faBoxOpen, faHandHoldingHeart, faSearch, faShoppingCart, faTruck, faBars,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import LiveCounters from "../components/LiveCounters";
import TestimonialSection from "../components/Testimonials";

import Footer from '../components/Footer';
import { useForm, ValidationError } from '@formspree/react';



export default function LandingPage() {
    const [loaded, setLoaded] = useState(false);
    const [active, setActive] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [state, handleSubmit] = useForm("movwjepn");
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);


    const cards = [
        {
            icon: faSeedling,
            title: 'Empower Farmers',
            text: 'We provide a platform for farmers to sell directly, gain better margins, and grow sustainably.',
        },
        {
            icon: faBoxOpen,
            title: 'Fresh Produce Delivery',
            text: 'Consumers get farm-fresh fruits and vegetables delivered straight from the source—no middlemen.',
        },
        {
            icon: faHandHoldingHeart,
            title: 'Community First',
            text: 'We build stronger local economies and foster trust by connecting neighbors through fresh food.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 dark:text-white flex flex-col transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50 p-4 md:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 text-2xl font-extrabold text-green-700 dark:text-green-400">
                        <img src={logo} alt="CropCart Logo" className="w-8 h-8" />
                        <span>CropCart</span>
                    </div>

                    {/* Centered Menu Links (Desktop Only) */}
                    <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
                        {['home', 'about', 'contact'].map((section) => (
                            <button
                                key={section}
                                onClick={() => {
                                    const elementId =
                                        section === 'home'
                                            ? null
                                            : section === 'about'
                                                ? 'what-we-do'
                                                : 'contact-us';
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

                    {/* Right Buttons (Desktop Only) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/farmer-login')}
                            className="px-5 py-3 bg-green-100 text-green-700 hover:bg-green-200 font-semibold rounded-md text-lg"
                        >
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

                    {/* Hamburger Icon (Mobile Only) */}
                    <button
                        className="md:hidden text-2xl text-green-700 dark:text-green-400 focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="flex flex-col mt-4 space-y-4 md:hidden">
                        {['home', 'about', 'contact'].map((section) => (
                            <button
                                key={section}
                                onClick={() => {
                                    const elementId =
                                        section === 'home'
                                            ? null
                                            : section === 'about'
                                                ? 'what-we-do'
                                                : 'contact-us';
                                    if (elementId) {
                                        const element = document.getElementById(elementId);
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    } else {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                    setActive(section);
                                    setMobileMenuOpen(false);
                                }}
                                className={`font-semibold text-left px-4 py-2 rounded-md transition ${active === section
                                    ? 'bg-green-200 text-green-800 dark:bg-green-500 dark:text-white'
                                    : 'text-gray-800 dark:text-gray-200 hover:text-green-700 hover:bg-green-100 dark:hover:text-green-400 dark:hover:bg-green-800'
                                    }`}
                            >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </button>
                        ))}
                        <button className="px-4 py-3 font-semibold text-left text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400">
                            Sell Your Produce
                        </button>
                        <button
                            onClick={() => {
                                navigate('/login');
                                setMobileMenuOpen(false);
                            }}
                            className="px-4 py-3 font-semibold text-left text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => {
                                navigate('/register');
                                setMobileMenuOpen(false);
                            }}
                            className="px-4 py-3 font-semibold text-left text-gray-800 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400"
                        >
                            Sign up
                        </button>
                    </div>
                )}
            </nav>






            {/* Hero Section */}
            <section className="relative bg-green-900 text-white overflow-hidden h-[860px] sm:h-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-y-0 px-6 sm:px-8 md:px-10 pt-24 pb-16 md:py-24 max-w-7xl mx-auto">
                    {/* Left Text Content */}
                    <div
                        className={`max-w-xl space-y-4 sm:space-y-8 transition-all duration-700 ease-out transform ${loaded ? 'translate-y-10  sm:translate-y-4 opacity-100' : 'translate-y-[100px]    sm:translate-y-[100px] opacity-0'
                            } mt-8 md:mt-24`}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center md:text-left">
                            Buy Fresh Crops <br />Directly from Local Farmers
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl text-gray-200 leading-relaxed font-medium md:font-semibold text-center md:text-left">
                            Join our platform to discover fresh, high-quality produce from farmers nearby and support your community.
                        </p>
                        <div className="flex justify-center  md:justify-start">
                            <button
                                onClick={() => navigate('/home')}
                                className="w-30 sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-8 sm:py-4 text-base sm:text-xl rounded-md font-semibold "
                            >
                                Get Started
                            </button>

                        </div>
                    </div>


                    {/* Right Image */}
                    <div
                        className={`relative max-w-sm mx-auto transition-all duration-700 ease-out transform ${loaded
                            ? 'translate-y-22 sm:translate-y-32 opacity-100'
                            : 'translate-y-[150px] sm:translate-y-[150px] opacity-0'
                            }`}
                    >
                        <img
                            src={heroImage}
                            alt="Hero"
                            className="mt-4 sm:mt-0 w-5/5 sm:w-full object-contain drop-shadow-2xl scale-100 sm:scale-125 relative z-0"
                        />
                    </div>
                </div>

                {/* SVG Bottom Wave */}
                <div className=" absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
                    <svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="w-full h-[100px]"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="
      M0 120
      C 300 10, 900 170, 1200 50
      L1200 120 
      L0 120 
      Z
    "
                            className="fill-[#F9F9F9] dark:fill-gray-900"
                        />
                    </svg>

                </div>



            </section>



            {/* What We Do Section */}
            <section id="what-we-do" className=" sm:mt-20 py-16 sm:py-24 px-4 sm:px-6 md:px-20">
                <div className="max-w-7xl mx-10 sm:mx-auto text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-4 sm:mb-6">
                        What We Do
                    </h2>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-14 font-medium sm:font-semibold leading-relaxed">
                        We connect local farmers directly with consumers through an intuitive, transparent, and fair marketplace.
                    </p>

                    <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 md:grid-cols-3">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="cursor-pointer group bg-[#F9F9F9] p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl hover:bg-green-50 transition duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3"
                            >
                                <div className="text-green-700 text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                    <FontAwesomeIcon icon={card.icon} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                                    {card.title}
                                </h3>
                                <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base leading-relaxed font-medium sm:font-semibold">
                                    {card.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <section className=" py-16 sm:py-24 px-4 sm:px-6 md:px-20">
                <div className="max-w-7xl mx-10 sm:mx-auto text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-4 sm:mb-6">How It Works</h2>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-14 font-medium sm:font-semibold leading-relaxed">
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
                                className="cursor-pointer group bg-[#F9F9F9] p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl hover:bg-green-50 transition duration-500 transform hover:-translate-y-2 sm:hover:-translate-y-3"
                            >
                                <div className="text-green-700 text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                    <FontAwesomeIcon icon={step.icon} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                                    {step.title}
                                </h3>
                                <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base leading-relaxed font-medium sm:font-semibold">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <LiveCounters />

            <TestimonialSection />
            <section className=" py-16 sm:py-24 px-4 sm:px-6 md:px-20">
                <div className="max-w-7xl mx-10 sm:mx-auto text-center">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-14 font-medium sm:font-semibold leading-relaxed">
                        Have questions? We’ve got answers to help you understand how CropCart works.
                    </p>

                    <div className="max-w-4xl text-2xl mx-auto text-left space-y-0">
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
                                <summary className="font-semibold text-base sm:text-lg md:text-base leading-6 list-none focus:outline-none text-green-900 hover:text-green-800">
                                    {question}
                                </summary>
                                <p className="mt-3 text-gray-700 text-sm">{answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>


            {/* Contact Section */}
            <section id="contact-us" className="py-16 sm:py-24 px-4 sm:px-6 md:px-20 bg-green-100 text-green-900">
                <div className="max-w-7xl mx-4 sm:mx-auto text-center">
                    <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-green-800 mb-3 sm:mb-6">
                        Get in Touch
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-6 sm:mb-12 font-medium sm:font-semibold leading-relaxed">
                        Have questions or want to partner with us? Reach out and we'll get back to you as soon as possible.
                    </p>

                    {state.succeeded ? (
                        <div className="text-lg sm:text-2xl font-semibold text-green-800">
                            ✅ Thanks for reaching out! We'll get back to you shortly.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 sm:space-y-8 text-left">
                            <div>
                                <label htmlFor="name" className="block mb-2 font-bold text-base sm:text-lg">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-3 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
                                    placeholder="Your name"
                                    required
                                />
                                <ValidationError prefix="Name" field="name" errors={state.errors} />
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 font-bold text-base sm:text-lg">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="w-full px-4 py-3 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
                                    placeholder="Your email"
                                    required
                                />
                                <ValidationError prefix="Email" field="email" errors={state.errors} />
                            </div>

                            <div>
                                <label htmlFor="message" className="block mb-2 font-bold text-base sm:text-lg">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
                                    placeholder="Write your message here..."
                                    required
                                />
                                <ValidationError prefix="Message" field="message" errors={state.errors} />
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={state.submitting}
                                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-md font-bold text-base sm:text-xl transition"
                                >
                                    {state.submitting ? "Sending..." : "Send Message"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>


            {/* Footer */}
            <Footer />



        </div>
    );
}
