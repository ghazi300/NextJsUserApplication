"use client"; 

import { useState } from 'react';
import Image from 'next/image';
import LogoutButton from "./LogoutButton";
import Logo from '../../public/images/next-js.svg';
import { signIn } from 'next-auth/react';

const HeaderClient = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Image src={Logo} alt="Your App Logo" width={100} height={40} />
          <button onClick={toggleMenu} className="ml-4 md:hidden focus:outline-none">
            <span className="text-white text-3xl">☰</span>
          </button>
        </div>
        <nav className={`md:flex md:items-center ${isMenuOpen ? 'block' : 'hidden'} absolute md:static bg-gray-800 w-full md:w-auto transition duration-300 ease-in-out`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0 md:space-y-0 space-y-2 md:space-y-0">
            <li className="hover:bg-gray-700 rounded-md transition duration-300">
              <a href="/" className="block px-4 py-2" onClick={handleMenuItemClick}>Home</a>
            </li>
            <li className="hover:bg-gray-700 rounded-md transition duration-300">
              <a href="#" className="block px-4 py-2" onClick={handleMenuItemClick}>Features</a>
            </li>
            <li className="hover:bg-gray-700 rounded-md transition duration-300">
              <a href="#" className="block px-4 py-2" onClick={handleMenuItemClick}>About</a>
            </li>
            <li className="hover:bg-gray-700 rounded-md transition duration-300">
              <a href="#" className="block px-4 py-2" onClick={handleMenuItemClick}>Contact</a>
            </li>
            {session ? (
              <li className="hover:bg-gray-700 rounded-md transition duration-300">
                <LogoutButton />
              </li>
            ) : (
              <li className="hover:bg-gray-700 rounded-md transition duration-300">
                <button
                  onClick={async () => {
                    await signIn();
                  }}
                  className="btn btn-primary w-full hover:bg-blue-700 transition duration-300 ease-in-out"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderClient;
