import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { TestCase, TestStatus, TestRunReport, Defect } from '../types';
import { generateTestPlan } from '../services/geminiService';
import { Loader2, CheckCircle2, XCircle, Terminal, Globe, AlertTriangle } from 'lucide-react';

interface TestRunnerProps {
  onComplete: (report: TestRunReport) => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ onComplete }) => {
  const [url, setUrl] = useState('https://');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startPlanning = async () => {
    if (!url || url === 'https://') {
      alert("Please enter a valid URL");
      return;
    }

    setStatus(TestStatus.PLANNING);
    addLog(`Connecting to Gemini 2.5... analyzing ${url}`);
    
    // Simulate initial scan delay
    setTimeout(async () => {
      const plan = await generateTestPlan(url, description);
      
      const cases: TestCase[] = plan.map((p, i) => ({
        ...p,
        id: `tc-${i}`,
        status: 'pending',
        logs: []
      }));

      setTestCases(cases);
      addLog(`Generated ${cases.length} test scenarios.`);
      setStatus(TestStatus.RUNNING);
      setCurrentTestIndex(0);
    }, 1500);
  };

  // The Simulation Loop
  useEffect(() => {
    if (status !== TestStatus.RUNNING || currentTestIndex === -1 || currentTestIndex >= testCases.length) {
      if (status === TestStatus.RUNNING && currentTestIndex >= testCases.length) {
        finishRun();
      }
      return;
    }

    const currentCase = testCases[currentTestIndex];
    let stepCount = 0;
    
    // Mark current as running
    setTestCases(prev => prev.map((tc, i) => i === currentTestIndex ? { ...tc, status: 'running' } : tc));
    addLog(`STARTED: ${currentCase.name}`);

    const intervalId = setInterval(() => {
      stepCount++;
      const randomAction = [
        "Locating element via XPath...",
        "Waiting for network idle...",
        "Simulating click event...",
        "Verifying computed styles...",
        "Checking console for errors...",
        "Taking screenshot..."
      ];
      
      addLog(`  > ${randomAction[Math.floor(Math.random() * randomAction.length)]}`);

      if (stepCount > 4) {
        clearInterval(intervalId);
        completeTestCase(currentTestIndex);
      }
    }, 800);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTestIndex, status]);

  const completeTestCase = (index: number) => {
    // 20% chance of failure for demo purposes
    const isSuccess = Math.random() > 0.2; 
    
    setTestCases(prev => prev.map((tc, i) => {
      if (i === index) {
        return { 
          ...tc, 
          status: isSuccess ? 'pass' : 'fail',
          duration: Math.floor(Math.random() * 2000) + 500
        };
      }
      return tc;
    }));

    addLog(isSuccess ? `PASSED: ${testCases[index].name}` : `FAILED: ${testCases[index].name}`);
    setCurrentTestIndex(prev => prev + 1);
  };

  const finishRun = () => {
    setStatus(TestStatus.COMPLETED);
    addLog("Test run completed. Generating report...");
    
    // Generate Report Data
    const failedCases = testCases.filter(tc => tc.status === 'fail');
    const defects: Defect[] = failedCases.map((tc, i) => ({
      id: `bug-${i}`,
      severity: i % 2 === 0 ? 'high' : 'medium',
      title: `Assertion failed in ${tc.name}`,
      description: "Element expected to be visible but was obscured by modal overlay.",
      location: "Line 42: Login Component",
      screenshotUrl: `https://picsum.photos/400/300?random=${i}`
    }));

    const report: TestRunReport = {
      id: `run-${Date.now()}`,
      url: url,
      timestamp: new Date(),
      score: Math.round((testCases.filter(t => t.status === 'pass').length / testCases.length) * 100),
      passedCount: testCases.filter(t => t.status === 'pass').length,
      failedCount: failedCases.length,
      duration: 15, // fake duration
      cases: testCases,
      defects
    };

    setTimeout(() => onComplete(report), 1000);
  };

  if (status === TestStatus.IDLE) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">New Test Run</h2>
          <p className="text-slate-500">Configure your autonomous agent parameters.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Context / Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              rows={3}
              placeholder="E.g. This is an e-commerce site. Focus on the checkout flow and user login."
            />
          </div>

          <div className="pt-4">
            <Button onClick={startPlanning} className="w-full" size="lg">
              Initialize Test Agent
            </Button>
            <p className="text-xs text-slate-400 text-center mt-3">
              Requires Gemini API Key configured in Environment
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-brand-dark text-slate-300 rounded-t-xl p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-brand-green" />
          <span className="font-mono text-sm">TestPilot Agent v2.5.0</span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
           <span>Target: {url}</span>
           <span className={`${status === TestStatus.RUNNING ? 'text-brand-green animate-pulse' : 'text-slate-400'}`}>
             {status}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 bg-white rounded-b-xl shadow-xl overflow-hidden min-h-[500px]">
        {/* Left: Test List */}
        <div className="lg:col-span-1 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto max-h-[600px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Test Plan</h3>
          <div className="space-y-3">
            {testCases.map((tc) => (
              <div key={tc.id} className={`p-3 rounded-lg border transition-all ${
                tc.status === 'running' ? 'bg-white border-brand-blue shadow-md' :
                tc.status === 'pending' ? 'bg-slate-100 border-transparent opacity-60' :
                'bg-white border-slate-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-dark mb-1">{tc.name}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{tc.description}</p>
                  </div>
                  <div className="ml-2 mt-1">
                    {tc.status === 'running' && <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />}
                    {tc.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-brand-green" />}
                    {tc.status === 'fail' && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
              </div>
            ))}
            {testCases.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Plan...
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Logs */}
        <div className="lg:col-span-2 bg-[#1e1e1e] p-4 font-mono text-sm overflow-hidden flex flex-col">
           <div ref={logContainerRef} className="log-scroll flex-1 overflow-y-auto space-y-1 pb-4">
             {logs.map((log, i) => (
               <div key={i} className={`
                 ${log.includes('PASSED') ? 'text-brand-green' : 
                   log.includes('FAILED') ? 'text-red-400' : 
                   log.includes('STARTED') ? 'text-blue-400 font-bold mt-2' : 
                   'text-slate-400'}
               `}>
                 {log}
               </div>
             ))}
             {status === TestStatus.RUNNING && (
               <div className="flex items-center text-slate-500 mt-2">
                 <span className="w-2 h-4 bg-brand-green animate-pulse mr-1"></span>
                 _
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};