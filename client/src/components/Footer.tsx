// components/Footer.jsx


import InstagramIcon from '../assets/icons/instagram.svg';

import TwitterIcon from '../assets/icons/twitter.svg';
import LinkedInIcon from '../assets/icons/linkedin.svg';
import GitHubIcon from '../assets/icons/github.svg';


const Footer = () => {
  return (
    <footer className="bg-green-950 text-green-100 py-16 sm:py-24 px-4 sm:px-6 md:px-20">
      <div className="max-w-7xl mx-10 sm:mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">

        {/* Brand Info */}
        <div className="col-span-2 sm:col-span-1 ">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-heading">CropCart</h2>
          <p className="text-green-300 text-sm leading-relaxed">
            Bridging the gap between farms and families. Get fresh, local, and seasonal produce delivered with care.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://www.termsfeed.com/live/3cdb6ed6-7926-4bb1-b2ac-10926a21316f" className="hover:text-white transition">Privacy Policy</a></li>
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
            <a href="https://www.instagram.com/saurabh_shisode_?igsh=MWZ3cHRwNmM0NTJxNA==" aria-label="Instagram" className="hover:text-green-400 text-white transition">
              <img src={InstagramIcon} alt="Instagram" className="w-6 h-6 filter brightness-0 invert" />
            </a>
            <a href="https://www.linkedin.com/in/saurabh-shisode-686476248/" aria-label="LinkedIn" className="hover:text-green-400 text-white transition">
              <img src={LinkedInIcon} alt="LinkedIn" className="w-6 h-6 filter brightness-0 invert" />
            </a>
            <a href="https://x.com/NotSaurabh_?t=9cnJ8PnEbgz4XIixYymSeA&s=09" aria-label="Twitter" className="hover:text-green-400 text-white transition">
              <img src={TwitterIcon} alt="Twitter" className="w-6 h-6 filter brightness-0 invert" />
            </a>
            <a href="https://github.com/SaurabhShisode" aria-label="GitHub" className="hover:text-green-400 text-white transition">
              <img src={GitHubIcon} alt="GitHub" className="w-6 h-6 filter brightness-0 invert" />
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
