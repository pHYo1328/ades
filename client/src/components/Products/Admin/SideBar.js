import React from 'react';
export default function SideBar({ activeTab, setActiveTab }) {
  return (
    <nav className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <ul className="space-y-2 font-medium">
        <li>
          {[
            { label: 'Overview', value: 'home' },
            { label: 'Products', value: 'products' },
            { label: 'Brands', value: 'brands' },
            { label: 'Categories', value: 'categories' },
            { label: 'Users', value: 'users' },
            { label: 'Orders', value: 'orders' },
            { label: 'Refunds', value: 'refunds' },
          ].map(({ label, value }) => (
            <button
              className={`w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                activeTab === value ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActiveTab(value)}
            >
              {label}
            </button>
          ))}
        </li>
      </ul>
    </nav>
  );
}
