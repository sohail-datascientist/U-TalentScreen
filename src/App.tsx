import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import Results from './components/Results';
import Analytics from './components/Analytics';
import { ProcessedResult } from './types';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'upload' | 'results' | 'analytics'>('dashboard');
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessingComplete = (results: ProcessedResult[]) => {
    setProcessedResults(results);
    setActiveView('results');
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        hasResults={processedResults.length > 0}
      />
      
      <main className="flex-1 ml-80 p-8 overflow-auto">
        {activeView === 'dashboard' && (
          <Dashboard 
            onStartUpload={() => setActiveView('upload')}
            resultsCount={processedResults.length}
          />
        )}
        
        {activeView === 'upload' && (
          <Upload 
            onProcessingStart={handleProcessingStart}
            onProcessingComplete={handleProcessingComplete}
            isProcessing={isProcessing}
          />
        )}
        
        {activeView === 'results' && (
          <Results results={processedResults} />
        )}
        
        {activeView === 'analytics' && (
          <Analytics results={processedResults} />
        )}
      </main>
    </div>
  );
}

export default App;
