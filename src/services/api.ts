import { ProcessedResult } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Adjust based on your Django backend URL

export const processResumes = async (jdFile: File, resumeFiles: File[]): Promise<ProcessedResult[]> => {
  const formData = new FormData();
  formData.append('jd_file', jdFile);
  
  resumeFiles.forEach((file) => {
    formData.append('resume_files', file);
  });

  try {
    const response = await fetch(`${API_BASE_URL}/process_resumes/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      // Assuming the Django backend returns results in the session or directly
      // You might need to adjust this based on your actual Django response format
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
    const response = await fetch(`${API_BASE_URL}/save_filtered_results/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ results }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.message) {
      throw new Error('Failed to save filtered results');
    }
  } catch (error) {
    console.error('Error saving filtered results:', error);
    throw error;
  }
};