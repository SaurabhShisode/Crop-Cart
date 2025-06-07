// components/Footer.jsx


import InstagramIcon from '../assets/icons/instagram.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import TwitterIcon from '../assets/icons/twitter.svg';

const Footer = () => {
  return (
   <footer className="bg-green-950 text-green-100 py-16 sm:py-24 px-4 sm:px-6 md:px-20">
  <div className="max-w-7xl mx-10 sm:mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">

    {/* Brand Info */}
    <div className="col-span-2 sm:col-span-1 ">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">CropCart</h2>
      <p className="text-green-300 text-sm leading-relaxed">
        Bridging the gap between farms and families. Get fresh, local, and seasonal produce delivered with care.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
        <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
        <li><a href="#" className="hover:text-white transition">Help Center</a></li>
        <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
      </ul>
    </div>

    {/* Explore */}
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Explore</h3>
      <ul className="space-y-2 text-sm">
        <li><a href="#" className="hover:text-white transition">About Us</a></li>
        <li><a href="#" className="hover:text-white transition">Our Farmers</a></li>
        <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
        <li><a href="#" className="hover:text-white transition">Careers</a></li>
      </ul>
    </div>

    {/* Socials */}
    <div className="mt-6 sm:mt-0 flex flex-col items-start">
      <h4 className="text-base sm:text-lg font-semibold mb-3">Follow Me</h4>
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

  <div className="mt-12 sm:mt-16 border-t border-green-800 pt-6 text-center text-xs sm:text-sm text-green-500">
    © 2025 <span className="font-semibold">CropCart</span>. All rights reserved.
  </div>
</footer>

  );
};

export default Footer;
