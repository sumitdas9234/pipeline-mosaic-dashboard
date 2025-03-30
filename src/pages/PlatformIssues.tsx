
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PlatformIssuesDashboard } from '@/components/platform-issues/PlatformIssuesDashboard';

const PlatformIssues = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full">
        <PlatformIssuesDashboard />
      </main>
    </div>
  );
};

export default PlatformIssues;
