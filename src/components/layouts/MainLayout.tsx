import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { NavItem } from '../NavItem';
import { MobileMenu } from '../MobileMenu';

export function MainLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a className="text-xl font-bold">Admin Mode</a>
            </div>
            <nav className="hidden md:flex space-x-4">
              <NavItem href="/" label="Home" />
              <NavItem href="/about" label="About" />
              <NavItem href="/game" label="Game" />
              <NavItem href="/gallery" label="Gallery" />
              <NavItem href="/contact" label="Contact" />
              <NavItem href="/social" label="Social" />
              <NavItem href="/phone" label="Phone" />
              <NavItem href="/settings" label="Settings" />
              <NavItem href="/logout" label="Logout" />
            </nav>
            <MobileMenu />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          © {new Date().getFullYear()} Wanted Games. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 