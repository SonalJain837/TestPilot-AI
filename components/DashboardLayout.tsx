import React, { useState } from 'react';
import { LayoutDashboard, PlayCircle, History, Settings, LogOut, Menu, X, Rocket } from 'lucide-react';
import { Button } from './Button';

interface User {
  name: string;
  email: string;
}

interface Props {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  apiKeySet: boolean;
  onSetApiKey: () => void;
  user: User;
}

export const DashboardLayout: React.FC<Props> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  onLogout,
  apiKeySet,
  onSetApiKey,
  user
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'run', label: 'New Test Run', icon: PlayCircle },
    { id: 'history', label: 'Test History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white rounded-lg shadow-md">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-brand-dark text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-700 flex items-center space-x-2">
            <div className="bg-brand-blue p-2 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-sans tracking-tight">TestPilot AI</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-brand-blue text-white shadow-lg' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700">
             {!apiKeySet && (
               <div className="mb-4 bg-yellow-500/10 border border-yellow-500/50 rounded p-3">
                 <p className="text-xs text-yellow-500 mb-2">API Key missing</p>
                 <Button size="sm" variant="outline" className="w-full text-xs" onClick={onSetApiKey}>Set Key</Button>
               </div>
             )}
            <button onClick={onLogout} className="flex items-center space-x-2 text-slate-400 hover:text-white w-full px-4 py-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-8">
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-900 capitalize">{user.name}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden">
               {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};