import React from 'react';

const DashboardPage = () => {
  return (
    <>
        <div className="p-4 sm:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white shadow-md rounded-md p-6 transform hover:scale-105 transition-transform duration-200 dark:bg-gray-800 dark:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-700 text-lg font-medium dark:text-gray-300">Total Users</div>
            <i className="fas fa-users text-2xl text-blue-500"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">1,250</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-green-500 font-semibold"><i className="fas fa-arrow-up mr-1"></i> 12%</span> last month
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white shadow-md rounded-md p-6 transform hover:scale-105 transition-transform duration-200 dark:bg-gray-800 dark:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-700 text-lg font-medium dark:text-gray-300">Total Orders</div>
            <i className="fas fa-shopping-cart text-2xl text-green-500"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">560</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-red-500 font-semibold"><i className="fas fa-arrow-down mr-1"></i> 5%</span> last month
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white shadow-md rounded-md p-6 transform hover:scale-105 transition-transform duration-200 dark:bg-gray-800 dark:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-700 text-lg font-medium dark:text-gray-300">Revenue</div>
            <i className="fas fa-dollar-sign text-2xl text-indigo-500"></i>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Rp 15,000,000</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="text-green-500 font-semibold"><i className="fas fa-arrow-up mr-1"></i> 8%</span> last month
          </div>
        </div>
      </section>

      {/* Section 2: Recent Activity */}
      <section className="bg-white shadow-md rounded-md p-6 mb-8 dark:bg-gray-800 dark:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">Recent Activity</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-user-plus text-green-500 mr-3"></i>
              <p className="text-gray-700 dark:text-gray-300">New user <span className="font-medium">John Doe</span> registered</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">5 minutes ago</span>
          </li>
          <li className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-shopping-basket text-blue-500 mr-3"></i>
              <p className="text-gray-700 dark:text-gray-300">Order <span className="font-medium">#12345</span> placed by Jane Smith</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">15 minutes ago</span>
          </li>
          <li className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-star text-yellow-500 mr-3"></i>
              <p className="text-gray-700 dark:text-gray-300">New review submitted for product <span className="font-medium">Smartwatch Pro</span></p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">30 minutes ago</span>
          </li>
          <li className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-file-invoice-dollar text-purple-500 mr-3"></i>
              <p className="text-gray-700 dark:text-gray-300">Invoice <span className="font-medium">#2024001</span> marked as paid</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
          </li>
        </ul>
      </section>

      {/* Section 3: User Statistics Placeholder */}
      <section className="bg-white shadow-md rounded-md p-6 dark:bg-gray-800 dark:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-gray-100">User Statistics</h2>
        <div className="text-center py-10 text-gray-600 border border-dashed border-gray-300 rounded-md dark:text-gray-400 dark:border-gray-600">
          <i className="fas fa-chart-bar text-4xl mb-4 text-gray-400"></i>
          <p className="text-lg">Placeholder for a chart or graph displaying user statistics.</p>
          <p className="text-sm text-gray-500 mt-2">You can integrate charting libraries like Chart.js or D3.js here.</p>
        </div>
      </section>
      </div>
    </>
  );
};

export default DashboardPage;