import { ProcessedResult } from '../types';

const SUPABASE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-resumes`;

export const processResumes = async (jdFile: File, resumeFiles: File[]): Promise<ProcessedResult[]> => {
  const formData = new FormData();
  formData.append('jd_file', jdFile);
  
  resumeFiles.forEach((file) => {
    formData.append('resume_files', file);
  });

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.results || [];
    } else {
      throw new Error(data.error || 'Processing failed');
    }
  } catch (error) {
    console.error('Error processing resumes:', error);
    throw error;
  }
};

export const saveFilteredResults = async (results: ProcessedResult[]): Promise<void> => {
  try {
    // Create CSV content
    const csvContent = [
      ['Name', 'Similarity', 'University', 'Email', 'Skills', 'Soft Skills', 'Experience', 'Location'],
      ...results.map(result => [
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

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving filtered results:', error);
    throw new Error('Failed to save filtered results.');
  }
};