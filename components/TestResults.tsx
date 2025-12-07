import React from 'react';
import { TestRunReport, Defect } from '../types';
import { Button } from './Button';
import { ArrowLeft, Download, AlertOctagon, CheckCircle, Bug, Share2 } from 'lucide-react';

interface Props {
  report: TestRunReport;
  onBack: () => void;
}

export const TestResults: React.FC<Props> = ({ report, onBack }) => {
  
  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'TestPilot Report',
      text: `Test Run Results for ${report.url}\nScore: ${report.score}%\nPassed: ${report.passedCount}\nFailed: ${report.failedCount}\nDefects: ${report.defects.length}`,
      url: window.location.href, // In a real app, this would be a permalink to the report
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Report summary copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print:animate-none">
      {/* Header - Hidden when printing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <button onClick={onBack} className="text-slate-500 hover:text-brand-blue flex items-center mb-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-brand-dark">Test Run Report</h1>
          <p className="text-slate-500">ID: {report.id} • {report.timestamp.toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-brand-dark">TestPilot AI - Test Report</h1>
        <div className="flex justify-between mt-2 text-sm text-slate-600">
           <p>Target: <span className="font-mono">{report.url}</span></p>
           <p>Date: {report.timestamp.toLocaleString()}</p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
           <div className="text-4xl font-bold text-brand-blue mb-1">{report.score}%</div>
           <div className="text-xs text-slate-500 uppercase tracking-wide">Health Score</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
           <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 print:border print:border-green-200">
             <CheckCircle className="w-6 h-6" />
           </div>
           <div>
             <div className="text-2xl font-bold text-brand-dark">{report.passedCount}</div>
             <div className="text-sm text-slate-500">Tests Passed</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
           <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-4 print:border print:border-red-200">
             <AlertOctagon className="w-6 h-6" />
           </div>
           <div>
             <div className="text-2xl font-bold text-brand-dark">{report.failedCount}</div>
             <div className="text-sm text-slate-500">Tests Failed</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
           <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4 print:border print:border-orange-200">
             <Bug className="w-6 h-6" />
           </div>
           <div>
             <div className="text-2xl font-bold text-brand-dark">{report.defects.length}</div>
             <div className="text-sm text-slate-500">Defects Logged</div>
           </div>
        </div>
      </div>

      {/* Defects Section */}
      {report.defects.length > 0 && (
        <div className="break-inside-avoid">
          <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
            <Bug className="w-5 h-5 mr-2 text-red-500" />
            Critical Defects Found
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {report.defects.map((defect) => (
              <div key={defect.id} className="bg-white border-l-4 border-red-500 rounded-r-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 print:border print:border-slate-200 print:border-l-red-500">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded uppercase print:border print:border-red-200">
                      {defect.severity}
                    </span>
                    <span className="text-slate-400 text-sm font-mono">{defect.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{defect.title}</h3>
                  <p className="text-slate-600">{defect.description}</p>
                </div>
                <div className="md:w-48 shrink-0">
                  {defect.screenshotUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 break-inside-avoid">
                      <img src={defect.screenshotUrl} alt="Defect screenshot" className="w-full h-32 object-cover" />
                      <div className="bg-slate-50 px-2 py-1 text-xs text-center text-slate-500">Screenshot Evidence</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden break-inside-avoid">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-brand-dark">Execution Log</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Test Case</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.cases.map((tc) => (
              <tr key={tc.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{tc.name}</div>
                  <div className="text-slate-500 text-xs">{tc.description}</div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono">
                  {tc.duration ? `${(tc.duration / 1000).toFixed(2)}s` : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tc.status === 'pass' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {tc.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};