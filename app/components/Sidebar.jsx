'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/inventory', label: 'Inventory', icon: 'package' },
    { path: '/vendors', label: 'Vendors', icon: 'truck' },
    { path: '/sales', label: 'Sales', icon: 'shopping-cart' },
    { path: '/reports', label: 'Reports', icon: 'bar-chart-2' }
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen p-4 fixed shadow-sm">
      <div className="mb-8 mt-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg mb-2">
          <h1 className="text-xl font-bold text-center">Construction</h1>
          <p className="text-center text-blue-100 text-sm">Inventory Management</p>
        </div>
      </div>
      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              href={item.path}
              key={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`mr-3 ${isActive ? 'text-blue-600' : ''}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon === 'home' && (
                    <>
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </>
                  )}
                  {item.icon === 'package' && (
                    <>
                      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </>
                  )}
                  {item.icon === 'truck' && (
                    <>
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </>
                  )}
                  {item.icon === 'shopping-cart' && (
                    <>
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </>
                  )}
                  {item.icon === 'bar-chart-2' && (
                    <>
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </>
                  )}
                </svg>
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Pakistan Inventory System</h3>
          <p className="text-xs text-gray-600">Specialized construction materials management for Pakistani businesses.</p>
        </div>
      </div>
    </div>
  );
} 