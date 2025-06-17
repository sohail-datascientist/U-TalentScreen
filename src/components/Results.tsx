import React, { useState } from 'react';
import { Download, Filter, Search, Star } from 'lucide-react';
import { ProcessedResult } from '../types';

interface ResultsProps {
  results: ProcessedResult[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ProcessedResult>('similarity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredResults = results.filter((result) =>
    Object.values(result).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === 'similarity') {
      const aNum = parseFloat(aValue.replace('%', ''));
      const bNum = parseFloat(bValue.replace('%', ''));
      return sortDirection === 'desc' ? bNum - aNum : aNum - bNum;
    }
    
    return sortDirection === 'desc' 
      ? bValue.localeCompare(aValue)
      : aValue.localeCompare(bValue);
  });

  const handleSort = (field: keyof ProcessedResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Similarity', 'University', 'Email', 'Skills', 'Soft Skills', 'Experience', 'Location'],
      ...sortedResults.map(result => [
        result.name,
        result.similarity,
        result.university,
        result.email,
        result.skills,
        result.soft_skills,
        result.experience,
        result.location
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume_screening_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getScoreColor = (similarity: string) => {
    const score = parseFloat(similarity.replace('%', ''));
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">Processing Results</h1>
        <p className="text-gray-600 text-lg">
          {results.length} candidates analyzed and ranked by similarity score
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-navy-900 text-white sticky top-0 z-10">
                <tr>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'similarity', label: 'Match Score' },
                    { key: 'university', label: 'University' },
                    { key: 'email', label: 'Email' },
                    { key: 'skills', label: 'Technical Skills' },
                    { key: 'soft_skills', label: 'Soft Skills' },
                    { key: 'experience', label: 'Experience' },
                    { key: 'location', label: 'Location' }
                  ].map((column) => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key as keyof ProcessedResult)}
                      className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-navy-700 transition-colors whitespace-nowrap"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          <span className="text-yellow-400">
                            {sortDirection === 'desc' ? '↓' : '↑'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy-900 sticky left-0 bg-white">
                      <div className="flex items-center space-x-2">
                        {index < 3 && <Star className="h-4 w-4 text-yellow-400" />}
                        <span className="truncate max-w-32">{result.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(result.similarity)}`}>
                        {result.similarity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-32 truncate">{result.university}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-40 truncate">{result.email}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-48 truncate" title={result.skills}>
                      {result.skills}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-48 truncate" title={result.soft_skills}>
                      {result.soft_skills}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{result.experience}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-32 truncate">{result.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {sortedResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found matching your search criteria.</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Showing {sortedResults.length} of {results.length} candidates
      </div>
    </div>
  );
};

export default Results;