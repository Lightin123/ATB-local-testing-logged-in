import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function PrivateLayout() {
  return (
    <div className="grid grid-cols-[250px_minmax(0,1fr)] h-screen bg-white">
      <Sidebar />
      <main className="min-w-0 w-full flex-1 bg-white overflow-auto p-6 text-lg">
        <Outlet />
      </main>
    </div>
  );
}
