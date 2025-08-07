'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function MobileNavigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/inventory', label: 'Inventory', icon: 'package' },
    { path: '/vendors', label: 'Vendors', icon: 'truck' },
    { path: '/sales', label: 'Sales', icon: 'shopping-cart' },
    { path: '/reports', label: 'Reports', icon: 'bar-chart-2' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-600 shadow-lg p-2 z-20">
      <div className="flex justify-between items-center">
        <div className="flex justify-around flex-grow">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                href={item.path}
                key={item.path}
                className={`flex flex-col items-center p-2 rounded-md ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                }`}
              >
                <div className={`p-1.5 rounded-full mb-1 ${isActive ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
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
                </div>
                <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                {isActive && <div className="h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-1"></div>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}