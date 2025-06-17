import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { ProcessedResult } from '../types';
import { processResumes } from '../services/api';

interface UploadProps {
  onProcessingStart: () => void;
  onProcessingComplete: (results: ProcessedResult[]) => void;
  isProcessing: boolean;
}

const Upload: React.FC<UploadProps> = ({ onProcessingStart, onProcessingComplete, isProcessing }) => {
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const { getRootProps: getJdRootProps, getInputProps: getJdInputProps, isDragActive: isJdDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setJdFile(acceptedFiles[0]);
        setError(''); // Clear any previous errors
      }
    }
  });

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps, isDragActive: isResumeDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setResumeFiles(prev => [...prev, ...acceptedFiles]);
      setError(''); // Clear any previous errors
    }
  });

  const removeResumeFile = (index: number) => {
    setResumeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!jdFile || resumeFiles.length === 0) {
      setError('Please upload both a job description and at least one resume.');
      return;
    }

    setError('');
    onProcessingStart();

    try {
      const results = await processResumes(jdFile, resumeFiles);
      onProcessingComplete(results);
    } catch (err) {
      setError('Failed to process files. Please try again.');
      console.error('Processing error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">Upload Files</h1>
        <p className="text-gray-600 text-lg">
          Upload your job description and candidate resumes to begin the AI-powered screening process.
        </p>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>Real Processing:</strong> Your files will be processed using actual text extraction and similarity analysis. 
            Supported formats: PDF, DOC, DOCX, TXT.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Job Description Upload */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Job Description</h2>
          
          <div
            {...getJdRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isJdDragActive
                ? 'border-yellow-400 bg-yellow-50'
                : jdFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
            }`}
          >
            <input {...getJdInputProps()} />
            
            {jdFile ? (
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-700">{jdFile.name}</p>
                  <p className="text-sm text-gray-500">{(jdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div>
                <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isJdDragActive ? 'Drop the file here' : 'Upload Job Description'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag & drop or click to select PDF, DOC, DOCX, or TXT
                </p>
              </div>
            )}
          </div>
          
          {jdFile && (
            <button
              onClick={() => setJdFile(null)}
              className="mt-3 text-red-500 hover:text-red-700 text-sm flex items-center space-x-1"
            >
              <X size={16} />
              <span>Remove file</span>
            </button>
          )}
        </div>

        {/* Resume Upload */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Resumes ({resumeFiles.length})
          </h2>
          
          <div
            {...getResumeRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isResumeDragActive
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
            }`}
          >
            <input {...getResumeInputProps()} />
            <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isResumeDragActive ? 'Drop the files here' : 'Upload Resumes'}
            </p>
            <p className="text-sm text-gray-500">
              Drag & drop or click to select multiple files
            </p>
          </div>
          
          {resumeFiles.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {resumeFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeResumeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Process Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !jdFile || resumeFiles.length === 0}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-navy-900 font-semibold px-12 py-4 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:hover:scale-100 flex items-center space-x-3 mx-auto"
        >
          {isProcessing ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <UploadIcon className="h-5 w-5" />
              <span>Process Resumes</span>
            </>
          )}
        </button>
        
        {isProcessing && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-2 bg-yellow-400 rounded-full mb-4"></div>
              </div>
              <p className="text-gray-600">
                AI is analyzing resumes and computing similarity scores...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Processing your actual files with text extraction and similarity analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;