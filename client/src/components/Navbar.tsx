import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('cropcartUser');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.user.name);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem('cropcartUser');
    toast.success('Logged out successfully');
    navigate('/home');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-7 bg-white shadow-sm sticky top-0 z-50">
      <div
        className="flex items-center space-x-2 text-2xl font-extrabold text-green-700 cursor-pointer select-none dark:text-green-400"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <img src={logo} alt="CropCart Logo" className="w-8 h-8" />
        <span>CropCart</span>
      </div>

      <div className="flex items-center space-x-4 relative">
        {userName ? (
          <>
            <span className="font-semibold text-green-700 text-lg">
              Hi, {userName}
            </span>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 rounded-full bg-green-100 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <User className="w-6 h-6 text-green-700" />
              </button>
              {dropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-48 bg-white border border-green-200 rounded-md shadow-lg z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <li>
                    <button
                      onClick={() => {
                        navigate('/myorders');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-green-800 hover:bg-green-100"
                      role="menuitem"
                    >
                      My Orders
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/my-account');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-green-800 hover:bg-green-100"
                      role="menuitem"
                    >
                      My Account
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 font-semibold text-gray-800 hover:text-green-700 text-lg"
              aria-label="Login"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-lg font-semibold flex items-center gap-2"
              aria-label="Sign up"
            >
              <UserPlusIcon className="w-5 h-5" aria-hidden="true" />
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
