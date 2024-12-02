interface NavItemProps {
  href: string
  label: string
}

export function NavItem({ href, label }: NavItemProps) {
  return (
    <a href={href} className="block py-2 px-4 text-sm hover:bg-gray-700">
      {label}
    </a>
  )
}

