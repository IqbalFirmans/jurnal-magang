import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import sidebarNavItems from '../../config/sidebarNav'; 
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user); 
  const userRole = user ? user.role : null;

  const filterNavItemsByRole = (role) => {
    if (!role) {
      return []; 
    }

    return sidebarNavItems.map(category => {
      const filteredItems = category.items.filter(item => {
        if (item.roles) {
          return item.roles.includes(role);
        }
        return role === 'admin';
      });

      if (filteredItems.length > 0) {
        return {
          ...category,
          items: filteredItems
        };
      }
      return null; 
    }).filter(Boolean); 
  };

  const visibleNavItems = filterNavItemsByRole(userRole);

  return (
    <aside className="sticky top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
      <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-extrabold text-red-600 dark:text-red-400">
          Jurnal Sekolah
        </h1>
        {user && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Masuk sebagai: <span className="font-semibold">{user.name}</span>
          </p>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {visibleNavItems.map(category => (
          <div key={category.id} className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 px-3">
              {category.label}
            </h3>
            <ul>
              {category.items.map(item => (
                <li key={item.id} className="mb-1">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900 transition duration-150 ease-in-out
                      ${isActive ? 'bg-red-500 text-white dark:bg-red-700 dark:text-white' : ''}`
                    }
                  >
                    <i className={`${item.iconClass} w-5 h-5 mr-3`}></i>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;