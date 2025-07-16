import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/solid';

const ActionMenu = ({ teacher, onRollingStudents, onViewDetail, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <DotsVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-0 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              onRollingStudents(teacher);
              closeMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Rolling Siswa
          </button>
          <button
            onClick={() => {
              onViewDetail(teacher);
              closeMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Detail
          </button>
          <button
            onClick={() => {
              onEdit(teacher);
              closeMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(teacher.id);
              closeMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
