import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, GraduationCap, MapPin, Trophy } from 'lucide-react';
import { ProcessedResult } from '../types';

interface AnalyticsProps {
  results: ProcessedResult[];
}

const Analytics: React.FC<AnalyticsProps> = ({ results }) => {
  // Process data for charts
  const experienceData = results.reduce((acc, result) => {
    const exp = result.experience === 'Fresh Graduate' ? '0' : result.experience.split(' ')[0];
    const category = exp === '0' ? 'Fresh Graduate' : 
                    parseInt(exp) <= 2 ? '1-2 years' :
                    parseInt(exp) <= 5 ? '3-5 years' :
                    '5+ years';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const experienceChartData = Object.entries(experienceData).map(([name, value]) => ({
    name, value
  }));

  const skillsData = results.flatMap(r => r.skills.split(', '))
    .reduce((acc, skill) => {
      if (skill && skill !== 'N/A') {
        acc[skill] = (acc[skill] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

  const topSkills = Object.entries(skillsData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const universityData = results.reduce((acc, result) => {
    if (result.university && result.university !== 'N/A') {
      acc[result.university] = (acc[result.university] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topUniversities = Object.entries(universityData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const similarityDistribution = results.map((result, index) => ({
    candidate: `C${index + 1}`,
    similarity: parseFloat(result.similarity.replace('%', ''))
  })).sort((a, b) => b.similarity - a.similarity);

  const colors = ['#FFCC00', '#032136', '#059669', '#DC2626', '#7C3AED', '#EA580C'];

  // Calculate summary stats
  const totalCandidates = results.length;
  const freshGraduates = results.filter(r => r.experience === 'Fresh Graduate').length;
  const experiencedCandidates = totalCandidates - freshGraduates;
  const totalUniversities = Object.keys(universityData).length;
  const topCandidate = results.reduce((top, current) => 
    parseFloat(current.similarity.replace('%', '')) > parseFloat(top.similarity.replace('%', '')) ? current : top
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">Analytics Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Comprehensive insights and statistics from your resume screening results
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-3xl font-bold text-navy-900">{totalCandidates}</p>
            </div>
            <Users className="h-12 w-12 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Match</p>
              <p className="text-lg font-bold text-navy-900">{topCandidate.name}</p>
              <p className="text-sm text-green-600 font-semibold">{topCandidate.similarity}</p>
            </div>
            <Trophy className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fresh Graduates</p>
              <p className="text-3xl font-bold text-navy-900">{freshGraduates}</p>
              <p className="text-sm text-gray-500">{Math.round((freshGraduates/totalCandidates)*100)}% of total</p>
            </div>
            <GraduationCap className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Universities</p>
              <p className="text-3xl font-bold text-navy-900">{totalUniversities}</p>
            </div>
            <MapPin className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Experience Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Experience Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={experienceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFCC00" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Skills */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Most In-Demand Skills</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSkills} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#032136" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* University Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Top Universities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topUniversities}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {topUniversities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Similarity Score Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Similarity Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={similarityDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="candidate" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Similarity Score']} />
              <Line 
                type="monotone" 
                dataKey="similarity" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-navy-900 to-navy-700 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Average similarity score: {(similarityDistribution.reduce((sum, item) => sum + item.similarity, 0) / similarityDistribution.length).toFixed(1)}%</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Most common skill: {topSkills[0]?.name || 'N/A'}</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Experience vs Fresh: {Math.round((experiencedCandidates/totalCandidates)*100)}% vs {Math.round((freshGraduates/totalCandidates)*100)}%</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-navy-900 mb-4">Top Performing Candidates</h3>
          <div className="space-y-3">
            {similarityDistribution.slice(0, 5).map((candidate, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-navy-900' : 
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-navy-900 font-medium">
                    {results.find(r => r.similarity === `${candidate.similarity}%`)?.name || candidate.candidate}
                  </span>
                </div>
                <span className="text-green-600 font-semibold">{candidate.similarity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;