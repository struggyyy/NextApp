'use client';

import { useRouter } from "next/navigation";
import { FaHome, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCalendar } from "react-icons/fa";
import { Menu } from '@headlessui/react';
import { useAuth } from "../lib/AuthContext";
import Image from 'next/image';
import clsx from 'clsx';
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const NavLink = ({ href, icon: Icon, children }) => (
    <a
      href={href}
      className={clsx(
        'flex items-center gap-2 p-2 rounded-lg',
        'text-white/70 hover:text-white',
        'bg-white/5 hover:bg-white/10',
        'transition-all duration-200',
        'backdrop-blur-sm'
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </a>
  );

  const UserSection = () => {
    if (!user) return null;

    return (
      <div className={clsx(
        'p-4 border-t border-white/10',
        'flex items-center gap-3'
      )}>
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className={clsx(
              'w-full h-full flex items-center justify-center',
              'text-white/50 text-lg font-medium'
            )}>
              {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user.displayName || user.email}
          </p>
          <p className="text-xs text-white/50 truncate">
            {user.email}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-lg font-medium text-white/90">Calendar App</h1>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white"
          >
            {isOpen ? 'Hide Menu' : 'Show Menu'}
          </button>
        </div>
      </header>
      
      {/* Sidebar */}
<aside className={clsx(
        'bg-white/10 rounded-lg shadow-lg backdrop-blur-md',
        'fixed top-16 left-0 bottom-0 transition-transform duration-300',
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full'
      )}>
        <nav className="p-4 space-y-2">
          <NavLink href="/" icon={FaCalendar}>
            Calendar
          </NavLink>
          
          {user && user.emailVerified ? (
            <>
              <NavLink href="/protected/user/profile" icon={FaUser}>
                Profile
              </NavLink>
              <NavLink href="/protected/user/signout" icon={FaSignOutAlt}>
                Sign Out
              </NavLink>
            </>
          ) : (
            <>
              <NavLink href="/public/user/signin" icon={FaSignInAlt}>
                Sign In
              </NavLink>
              <NavLink href="/public/user/register" icon={FaUserPlus}>
                Register
              </NavLink>
            </>
          )}
        </nav>

        <UserSection />
      </aside>
    </>
  );
}
