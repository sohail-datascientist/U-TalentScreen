import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ProcessedResult {
  name: string;
  similarity: string;
  university: string;
  email: string;
  skills: string;
  soft_skills: string;
  experience: string;
  location: string;
}

// Simple text extraction from PDF (basic implementation)
async function extractTextFromPDF(file: File): Promise<string> {
  // For a production implementation, you'd use a proper PDF parsing library
  // This is a simplified version that works with text-based PDFs
  const arrayBuffer = await file.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);
  
  // Basic text extraction - in production, use proper PDF parsing
  return text.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Extract text from various file formats
async function extractText(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    return new TextDecoder().decode(arrayBuffer);
  }
  
  throw new Error(`Unsupported file format: ${fileName}`);
}

// Simple text similarity calculation
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Extract information from resume text using pattern matching
function extractResumeInfo(resumeText: string, jdText: string): Omit<ProcessedResult, 'similarity'> {
  const text = resumeText.toLowerCase();
  
  // Extract name (first line or after "name:" pattern)
  const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m) || 
                   resumeText.match(/name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/i);
  const name = nameMatch ? nameMatch[1] : 'N/A';
  
  // Extract email
  const emailMatch = resumeText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : 'N/A';
  
  // Extract university
  const universityPatterns = [
    /university of ([^,\n]+)/i,
    /([^,\n]+ university)/i,
    /([^,\n]+ college)/i,
    /(mit|stanford|harvard|berkeley|caltech)/i
  ];
  
  let university = 'N/A';
  for (const pattern of universityPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      university = match[1] || match[0];
      break;
    }
  }
  
  // Extract experience
  const expPatterns = [
    /(\d+)\s*years?\s*(of\s*)?experience/i,
    /experience[:\s]*(\d+)\s*years?/i,
    /(fresh graduate|entry level|new grad)/i
  ];
  
  let experience = 'N/A';
  for (const pattern of expPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      if (match[0].toLowerCase().includes('fresh') || match[0].toLowerCase().includes('entry')) {
        experience = 'Fresh Graduate';
      } else {
        experience = `${match[1]} years`;
      }
      break;
    }
  }
  
  // Extract location
  const locationPatterns = [
    /([A-Z][a-z]+,\s*[A-Z]{2})/g, // City, State
    /([A-Z][a-z]+,\s*[A-Z][a-z]+)/g, // City, Country
  ];
  
  let location = 'N/A';
  for (const pattern of locationPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      location = match[1];
      break;
    }
  }
  
  // Extract technical skills
  const techSkillsKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'typescript', 'html', 'css',
    'sql', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes', 'git', 'linux',
    'angular', 'vue.js', 'express', 'django', 'flask', 'spring', 'c++', 'c#',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'tensorflow', 'pytorch'
  ];
  
  const foundSkills = techSkillsKeywords.filter(skill => 
    text.includes(skill.toLowerCase())
  );
  
  const skills = foundSkills.slice(0, 5).join(', ') || 'N/A';
  
  // Extract soft skills
  const softSkillsKeywords = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'creative', 'adaptable', 'organized', 'detail oriented', 'time management',
    'critical thinking', 'collaboration', 'innovation', 'mentoring', 'project management'
  ];
  
  const foundSoftSkills = softSkillsKeywords.filter(skill => 
    text.includes(skill.toLowerCase())
  );
  
  const soft_skills = foundSoftSkills.slice(0, 5).join(', ') || 'N/A';
  
  return {
    name,
    university,
    email,
    skills,
    soft_skills,
    experience,
    location
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const jdFile = formData.get('jd_file') as File
    const resumeFiles = formData.getAll('resume_files') as File[]

    if (!jdFile || resumeFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please upload both a job description and resumes.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract job description text
    const jdText = await extractText(jdFile)
    
    const results: ProcessedResult[] = []

    // Process each resume
    for (const resumeFile of resumeFiles) {
      try {
        const resumeText = await extractText(resumeFile)
        
        // Calculate similarity
        const similarity = calculateSimilarity(jdText, resumeText)
        const similarityPercentage = `${Math.round(similarity * 100)}%`
        
        // Extract resume information
        const resumeInfo = extractResumeInfo(resumeText, jdText)
        
        results.push({
          ...resumeInfo,
          similarity: similarityPercentage
        })
      } catch (error) {
        console.error(`Error processing ${resumeFile.name}:`, error)
        // Continue processing other files
      }
    }

    // Sort by similarity score
    results.sort((a, b) => {
      const aScore = parseInt(a.similarity.replace('%', ''))
      const bScore = parseInt(b.similarity.replace('%', ''))
      return bScore - aScore
    })

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing resumes:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process files. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})