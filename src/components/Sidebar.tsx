import React from 'react';
import { Home, Upload, BarChart3, FileText, LogOut, User } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: 'dashboard' | 'upload' | 'results' | 'analytics') => void;
  hasResults: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, hasResults }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'results', label: 'Results', icon: FileText, disabled: !hasResults },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, disabled: !hasResults },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-navy-900 text-white shadow-2xl z-50">
      <div className="p-6 border-b border-navy-700">
        <h1 className="text-2xl font-bold text-yellow-400">ResumeAI</h1>
        <p className="text-gray-300 text-sm mt-1">Intelligent Resume Screening</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isDisabled = item.disabled;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => !isDisabled && onViewChange(item.id as any)}
                  disabled={isDisabled}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-400 text-navy-900 font-semibold shadow-lg'
                      : isDisabled
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-gray-300 hover:bg-navy-700 hover:text-white hover:scale-105'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-8 border-t border-navy-700">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-navy-700 hover:text-white transition-all duration-200">
            <User size={20} />
            <span>Profile</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 mt-2">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;