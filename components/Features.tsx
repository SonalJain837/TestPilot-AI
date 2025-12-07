import React from 'react';
import { Eye, MousePointer, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: MousePointer,
      title: "Automated Interaction",
      desc: "Simulates real user behavior including clicks, inputs, scrolls, and drag-and-drop actions."
    },
    {
      icon: Eye,
      title: "Visual AI",
      desc: "Detects visual regressions, broken layouts, and overlapping elements with computer vision."
    },
    {
      icon: ShieldAlert,
      title: "Edge Case Discovery",
      desc: "Automatically tests negative flows like invalid inputs, network timeouts, and 404s."
    },
    {
      icon: Zap,
      title: "Instant Setup",
      desc: "No code required. Just provide a URL and our Gemini-powered agent creates the test plan."
    },
    {
      icon: Layers,
      title: "Cross-Browser",
      desc: "Simulate tests across Chrome, Firefox, and Safari viewports simultaneously."
    },
    {
      icon: RefreshCw,
      title: "Self-Healing Tests",
      desc: "If a selector changes, our AI finds the element by context, reducing flaky tests."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            Complete Coverage. <span className="text-brand-blue">Zero Scripting.</span>
          </h2>
          <p className="mt-4 text-xl text-slate-500">
            The only QA platform that thinks like a human tester but works at the speed of AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="relative p-8 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow border border-slate-100">
                <div className="absolute top-8 left-8 bg-white p-3 rounded-lg shadow-sm">
                  <Icon className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};