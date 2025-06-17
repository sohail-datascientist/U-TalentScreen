import React from 'react';
import { Upload, Users, TrendingUp, FileText } from 'lucide-react';

interface DashboardProps {
  onStartUpload: () => void;
  resultsCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartUpload, resultsCount }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">
          Welcome to ResumeAI Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Streamline your hiring process with AI-powered resume screening and intelligent candidate matching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processed</p>
              <p className="text-3xl font-bold text-navy-900">{resultsCount}</p>
            </div>
            <Users className="h-12 w-12 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-navy-900">98%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Match Score</p>
              <p className="text-3xl font-bold text-navy-900">85%</p>
            </div>
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center">
          <Upload className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy-900 mb-4">
            Start Processing Resumes
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload your job description and candidate resumes to begin the AI-powered screening process.
          </p>
          <button
            onClick={onStartUpload}
            className="bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Upload Files
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-xl font-bold mb-4">How it Works</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-400 text-navy-900 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span>Upload job description and resumes</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-400 text-navy-900 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span>AI extracts and analyzes candidate data</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-yellow-400 text-navy-900 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span>Get similarity scores and insights</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Last processing session</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Candidates analyzed</span>
              <span className="text-sm text-navy-900 font-semibold">{resultsCount}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Best match score</span>
              <span className="text-sm text-green-600 font-semibold">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;