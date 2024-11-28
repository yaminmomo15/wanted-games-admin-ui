import './App.css'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { GamePage } from './components/pages/game'
import { HomePage } from './components/pages/home'
import { AboutPage } from './components/pages/about'
import { GalleryPage } from './components/pages/gallery'
import { ContactPage } from './components/pages/contact'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* Navigation Tabs */}
        <nav className="bg-gray-800 p-4">
          <div className="flex gap-4">
            <NavLink to="/" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              Home
            </NavLink>
            <NavLink to="/game" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              Game
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              Gallery
            </NavLink>
            {/* <NavLink to="/settings" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              Settings
            </NavLink> */}
            <NavLink to="/about" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              Contact
            </NavLink>
            {/* <NavLink to="/login" className={({ isActive }) => 
              `px-3 py-2 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }>
              Login
            </NavLink> */}
          </div>
        </nav>

        {/* Routes */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
