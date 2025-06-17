export interface ProcessedResult {
  name: string;
  similarity: string;
  university: string;
  email: string;
  skills: string;
  soft_skills: string;
  experience: string;
  location: string;
}

export interface AnalyticsData {
  totalCandidates: number;
  totalUniversities: number;
  topCandidates: Array<{ name: string; similarity: string }>;
  totalFreshmen: number;
  totalExperienced: number;
}

export interface FileUploadState {
  jdFile: File | null;
  resumeFiles: File[];
  isValid: boolean;
}