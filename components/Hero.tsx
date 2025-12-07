import React from 'react';
import { Button } from './Button';
import { PlayCircle, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-brand-bg pt-16 pb-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-brand-blue mb-8">
          <span className="flex h-2 w-2 rounded-full bg-brand-blue mr-2"></span>
          Now powered by Gemini 2.5 Flash
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-dark mb-6">
          Test Websites Automatically <br />
          <span className="text-brand-blue">With AI Intelligence</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
          Replace hours of manual QA with TestPilot. Our AI agent explores your site, 
          identifies bugs, validates workflows, and generates detailed reports in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button size="lg" onClick={onStart}>
            <PlayCircle className="w-5 h-5 mr-2" />
            Start Automated Test
          </Button>
          <Button variant="outline" size="lg">
            View Sample Report
          </Button>
        </div>

        {/* Abstract UI representation */}
        <div className="mt-16 relative w-full max-w-5xl mx-auto rounded-xl shadow-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 bg-white px-3 py-1 text-xs text-slate-400 rounded-md w-64">testpilot.ai/dashboard</div>
          </div>
          <div className="p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
             <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-brand-blue mb-4">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-brand-dark">Auto-Discovery</h3>
                <p className="text-sm text-slate-500 mt-2">AI crawls your sitemap and identifies critical paths automatically.</p>
             </div>
             <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-brand-dark">Visual Regression</h3>
                <p className="text-sm text-slate-500 mt-2">Pixel-perfect comparison to detect unwanted UI shifts.</p>
             </div>
             <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                 <div className="text-4xl font-bold text-brand-dark">99.9%</div>
                 <div className="text-sm text-slate-500">Coverage Reliability</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};