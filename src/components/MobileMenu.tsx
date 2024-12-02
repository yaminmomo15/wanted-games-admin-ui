'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavItem } from './NavItem'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="md:hidden">
      <button onClick={toggleMenu} className="mobile-menu-button p-2" aria-label="Toggle menu">
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-800 z-50">
          <nav className="px-2 pt-2 pb-3 space-y-1">
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
        </div>
      )}
    </div>
  )
}

