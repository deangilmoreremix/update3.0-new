import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Target, Settings, Brain, Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Pipeline', href: '/pipeline', icon: Target },
  { name: 'AI Tools', href: '/ai-tools', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Smart CRM</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
