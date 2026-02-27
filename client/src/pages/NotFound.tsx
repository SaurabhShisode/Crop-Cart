import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = 'Page Not Found | CropCart';
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center justify-center px-4 text-center">
            {/* SVG Illustration */}
            <svg
                className="w-56 h-56 sm:w-72 sm:h-72 mb-8"
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Ground */}
                <ellipse cx="150" cy="250" rx="120" ry="16" fill="#E8F5E9" />

                {/* Plant pot */}
                <path d="M120 210h60l-8 40h-44l-8-40z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2.5" />
                <rect x="115" y="205" width="70" height="10" rx="3" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />

                {/* Wilted stem */}
                <path d="M150 205c0-30 -5-50 -10-70" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" fill="none" />

                {/* Drooping leaf */}
                <path d="M140 135c-15 5-25 20-20 35c10-5 25-15 20-35z" fill="#81C784" stroke="#388E3C" strokeWidth="1.5" />

                {/* Small fallen leaf */}
                <g transform="translate(170, 230) rotate(45)">
                    <path d="M0 10C0 10 4 0 14 0C14 0 10 7 0 10Z" fill="#A5D6A7" opacity="0.7" />
                </g>

                {/* Another fallen leaf */}
                <g transform="translate(115, 240) rotate(-20)">
                    <path d="M0 8C0 8 3 0 12 0C12 0 9 6 0 8Z" fill="#C8E6C9" opacity="0.6" />
                </g>

                {/* Question marks floating */}
                <text x="170" y="120" fontSize="28" fontWeight="bold" fill="#388E3C" opacity="0.25" fontFamily="Inter, sans-serif">?</text>
                <text x="115" y="100" fontSize="20" fontWeight="bold" fill="#388E3C" opacity="0.15" fontFamily="Inter, sans-serif">?</text>
                <text x="185" y="150" fontSize="16" fontWeight="bold" fill="#388E3C" opacity="0.2" fontFamily="Inter, sans-serif">?</text>
            </svg>

            {/* Text */}
            <h1 className="text-6xl sm:text-8xl font-extrabold text-green-800 mb-3 font-heading">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 font-heading">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8 text-sm sm:text-base">
                Looks like this crop didn't make it to harvest. The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Go to Homepage
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-700 hover:bg-green-50 transition-all duration-300"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
