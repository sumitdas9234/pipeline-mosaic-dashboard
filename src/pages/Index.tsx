
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
