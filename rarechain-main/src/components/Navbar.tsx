'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RiMenu2Line } from 'react-icons/ri';
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';

const navItems = [
  { label: 'Home', href: '/' },
  // { label: 'About', href: '/about' },
  // { label: 'Nodes', href: '/nodes' },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const [menuClass, setMenuClass] = useState('');

  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();

  const isDashboard = pathname === '/dashboard';

  const toggleMenu = () => setToggle((prev) => !prev);
  const closeNavbar = () => setToggle(false);

  useEffect(() => {
    setMenuClass(
      toggle
        ? 'transition-opacity ease-in-out duration-300 transform translate-y-0 opacity-100'
        : 'transition-opacity ease-in-out duration-300 transform -translate-y-full opacity-0'
    );
  }, [toggle]);

  const handleLogin = async () => {
    try {
      await login();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="w-full bg-white text-black flex justify-between items-center px-0 py-2 lg:px-16 sticky top-0 z-40">
      {/* Logo */}
      <Link href="/">
        <Image src="/assets/Logo.png" alt="Logo" width={200} height={200} priority />
      </Link>

      {/* If on /dashboard: show only logout button */}
      {isDashboard ? (
        <div className="flex items-center justify-end">
          {ready && authenticated && (
            <button
              onClick={handleLogout}
              className="text-white bg-black border h-12 px-6 font-medium rounded-full transition-all duration-300 transform hover:translate-y-1"
            >
              Logout
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center items-center">
            <ul className="flex gap-4">
              {navItems.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}>
                    <span className="text-lg cursor-pointer rounded-sm px-5 py-2 hover:bg-black hover:text-white transition-all">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center justify-end gap-4 cursor-pointer">
            {ready && authenticated ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="text-white bg-black border h-12 px-6 font-medium rounded-full transition-all duration-300 transform hover:translate-y-1"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="text-white bg-black border h-12 px-6 font-medium rounded-full transition-all duration-300 transform hover:translate-y-1"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex lg:hidden text-black">
            <RiMenu2Line
              className="h-8 w-8 text-[#5300CC] cursor-pointer"
              onClick={toggleMenu}
            />
          </div>

          {/* Mobile Dropdown Menu */}
          {toggle && (
            <div
              className={`lg:hidden bg-white text-black py-4 absolute top-20 right-0 w-full ${menuClass}`}
            >
              <ul className="flex flex-col justify-center items-center gap-2">
                {navItems.map(({ label, href }) => (
                  <li
                    key={label}
                    className="text-xl font-semibold hover:bg-[#5300CC] hover:text-white w-full py-3 px-4 text-center"
                  >
                    <Link href={href} onClick={closeNavbar}>
                      {label}
                    </Link>
                  </li>
                ))}
                <button
                  onClick={async () => {
                    closeNavbar();
                    if (ready && authenticated) {
                      router.push('/dashboard');
                    } else {
                      await handleLogin();
                    }
                  }}
                  className="text-white bg-black border h-12 px-6 font-medium rounded-full transition-all duration-300 transform hover:translate-y-1 py-3 w-[80%] text-xl mt-5"
                >
                  {ready && authenticated ? 'Dashboard' : 'Connect Wallet'}
                </button>
              </ul>
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default Navbar;
