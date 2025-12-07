
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DashboardLayout } from './components/DashboardLayout';
import { TestRunner } from './components/TestRunner';
import { TestResults } from './components/TestResults';
import { AnalyticsChart } from './components/AnalyticsChart';
import { TestRunReport, AnalyticsData } from './types';
import { Button } from './components/Button';
import { AuthPage } from './components/AuthPage';
import { ChatBot } from './components/ChatBot';

// Mock Data for Dashboard
const MOCK_ANALYTICS: AnalyticsData[] = [
  { name: 'Mon', pass: 12, fail: 2 },
  { name: 'Tue', pass: 15, fail: 1 },
  { name: 'Wed', pass: 8, fail: 4 },
  { name: 'Thu', pass: 20, fail: 0 },
  { name: 'Fri', pass: 18, fail: 2 },
  { name: 'Sat', pass: 5, fail: 0 },
  { name: 'Sun', pass: 8, fail: 1 },
];

interface User {
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [dashTab, setDashTab] = useState('overview');
  const [currentReport, setCurrentReport] = useState<TestRunReport | null>(null);
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');

  // Persist API Key to process.env for the service to read
  useEffect(() => {
    if (apiKey) {
      process.env.API_KEY = apiKey;
    }
  }, [apiKey]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAuthMode(null);
    setDashTab('overview');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentReport(null);
    setDashTab('overview');
  };

  const handleTestComplete = (report: TestRunReport) => {
    setCurrentReport(report);
  };

  const renderDashboardContent = () => {
    if (currentReport) {
      return <TestResults report={currentReport} onBack={() => {
        setCurrentReport(null);
        setDashTab('overview');
      }} />;
    }

    switch (dashTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium uppercase">Total Runs</h3>
                <p className="text-3xl font-bold text-brand-dark mt-2">142</p>
                <span className="text-green-500 text-xs font-medium">↑ 12% this week</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium uppercase">Pass Rate</h3>
                <p className="text-3xl font-bold text-brand-dark mt-2">88.5%</p>
                <span className="text-red-500 text-xs font-medium">↓ 1.2% this week</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium uppercase">Critical Bugs</h3>
                <p className="text-3xl font-bold text-brand-dark mt-2">3</p>
                <span className="text-slate-400 text-xs font-medium">Open tickets</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-brand-dark mb-6">Test Reliability Trend</h3>
              <AnalyticsChart data={MOCK_ANALYTICS} />
            </div>
          </div>
        );
      case 'run':
        return <TestRunner onComplete={handleTestComplete} />;
      case 'history':
        return (
          <div className="text-center py-20 text-slate-500">
            <h2 className="text-xl">Test History</h2>
            <p>Historical data mocked for demo.</p>
          </div>
        );
      case 'settings':
         return (
          <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter API Key"
            />
            <Button onClick={() => alert("Saved!")}>Save Configuration</Button>
          </div>
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <>
      {user ? (
        <DashboardLayout 
          activeTab={dashTab} 
          onTabChange={(t) => {
            setDashTab(t);
            setCurrentReport(null);
          }}
          onLogout={handleLogout}
          apiKeySet={!!apiKey}
          onSetApiKey={() => setDashTab('settings')}
          user={user}
        >
          {renderDashboardContent()}
        </DashboardLayout>
      ) : authMode ? (
        <AuthPage 
          initialMode={authMode} 
          onLogin={handleLogin} 
          onBack={() => setAuthMode(null)} 
        />
      ) : (
        <>
          <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-blue p-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-brand-dark tracking-tight">TestPilot AI</span>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setAuthMode('login')} className="text-slate-600 hover:text-brand-blue font-medium text-sm">Log In</button>
                <Button size="sm" onClick={() => setAuthMode('signup')}>Get Started</Button>
              </div>
            </div>
          </nav>
          <Hero onStart={() => setAuthMode('signup')} />
          <Features />
          <footer className="bg-brand-dark text-slate-400 py-12 text-center">
            <p>© 2024 TestPilot AI. All rights reserved.</p>
          </footer>
        </>
      )}
      
      {/* Global ChatBot - Always visible unless in Auth page to avoid clutter */}
      {!authMode && <ChatBot />}
    </>
  );
};

export default App;
