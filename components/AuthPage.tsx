
import React, { useState } from 'react';
import { Button } from './Button';
import { Mail, Lock, User, ArrowLeft, Rocket } from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
  onBack: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onBack, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic Validation
    if (!email.includes('@') || password.length < 6) {
      setError('Please enter a valid email and a password of at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      let user;
      if (mode === 'signup') {
        user = await registerUser(name, email, password);
      } else {
        user = await loginUser(email, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-blue p-3 rounded-xl shadow-lg">
            <Rocket className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }} 
            className="font-medium text-brand-blue hover:text-blue-500 transition-colors"
          >
            {mode === 'login' ? 'start your 14-day free trial' : 'sign in to existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-slate-300 rounded-lg p-2.5 border"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-slate-300 rounded-lg p-2.5 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-slate-300 rounded-lg p-2.5 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full justify-center" size="lg" isLoading={isLoading}>
                {mode === 'login' ? 'Sign in' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  <button onClick={onBack} className="flex items-center hover:text-slate-800">
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back to Home
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
           Note: Authentication tries to reach local backend at port 5000. <br/>
           If unreachable, it falls back to demo mode.
        </p>
      </div>
    </div>
  );
};
