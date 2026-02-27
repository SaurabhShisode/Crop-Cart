import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-green-700 text-white shadow-lg hover:bg-green-800 hover:shadow-xl hover:scale-110 transition-all duration-300"
            aria-label="Scroll to top"
        >
            <ChevronUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTop;
