
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Settings, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
  userInitials?: string;
  userName?: string;
}

export function Navbar({ 
  className,
  userInitials = "SD",
  userName = "Sumit Das"
}: NavbarProps) {
  return (
    <nav className={cn(
      'w-full bg-white border-b border-gray-100 py-3 px-4 flex items-center justify-between',
      className
    )}>
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-crystal-primary rounded mr-2">
            <span className="text-white text-lg font-semibold">C</span>
          </div>
          <span className="text-xl font-semibold">
            Crystal<span className="text-crystal-primary">Pipeline</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
            Pipelines
          </Button>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
            Services
          </Button>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
            Security
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative max-w-md w-72 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-10 h-9 bg-gray-50 border-gray-100 focus-visible:ring-crystal-primary"
            placeholder="Search pipelines..." 
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-500 px-1 text-xs rounded">
            ⌘ K
          </div>
        </div>
        
        <Button size="icon" variant="ghost" className="text-gray-500">
          <Sun className="h-5 w-5" />
        </Button>
        
        <Button size="icon" variant="ghost" className="text-gray-500">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button size="icon" variant="ghost" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-crystal-primary font-medium rounded-full">
            {userInitials}
          </div>
          <span className="text-sm font-medium hidden md:inline-block">{userName}</span>
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </nav>
  );
}
