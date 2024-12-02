import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';
import { Settings } from 'lucide-react';

export function MainLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/game"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Game
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Gallery
            </NavLink>
			<NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/social"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              Social
            </NavLink>
            <NavLink
              to="/phone"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
              }
            >
              Phone
            </NavLink>	
          </div>
          
          {/* Settings and Logout Buttons */}
          <div className="flex gap-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md flex items-center ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </NavLink>
            <Button
              variant="ghost"
              className="text-gray-300 hover:bg-gray-700"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
} 