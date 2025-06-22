// LangChain Resume Processing Service
// In production, this would connect to your actual LangChain backend

export interface ResumeAnalysis {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  education: {
    degree?: string;
    institution?: string;
    year?: string;
    gpa?: string;
  }[];
  experience: {
    position?: string;
    company?: string;
    duration?: string;
    description?: string;
  }[];
  skills: string[];
  research: {
    areas?: string[];
    publications?: string[];
    projects?: string[];
    patents?: string[];
  };
  achievements: string[];
  languages: string[];
  certifications: string[];
}

export interface ProcessingResult {
  success: boolean;
  analysis?: ResumeAnalysis;
  error?: string;
  confidence: number;
}

// Mock LangChain processing function
import { OpenAI } from 'langchain/llms/openai';
import { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { RunnableSequence } from 'langchain/schema/runnable';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import type { ProcessingResult, ResumeAnalysis } from './types';

export const processResumeWithLangChain = async (
  file: File,
): Promise<ProcessingResult> => {
  try {
    // Save uploaded file to a temp location
    const tempPath = path.join(os.tmpdir(), file.name);
    await fs.writeFile(tempPath, Buffer.from(await file.arrayBuffer()));

    // Load PDF using LangChain
    const loader = new PDFLoader(tempPath);
    const docs: Document[] = await loader.load();

    // Split content
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // Prepare prompt with system & user messages
    const llm = new OpenAI({
      modelName: 'gpt-4', // or gpt-3.5-turbo
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY, // ensure this is set
    });

    const resumeText = splitDocs.map((doc) => doc.pageContent).join('\n\n');

    const chain = RunnableSequence.from([
      async (input: string) => `Extract structured resume data from the following text in JSON format with keys: personalInfo, education, experience, skills, research, achievements, languages, certifications.\n\nResume:\n${input}`,
      llm,
      async (output: string) => {
        try {
          const data: ResumeAnalysis = JSON.parse(output);
          return {
            success: true,
            analysis: data,
            confidence: 0.9,
          };
        } catch (e) {
          return {
            success: false,
            error: 'Failed to parse resume analysis output.',
            confidence: 0,
          };
        }
      },
    ]);

    const result = await chain.invoke(resumeText);
    return result as ProcessingResult;
  } catch (error) {
    console.error('LangChain processing error:', error);
    return {
      success: false,
      error: 'Resume processing failed with LangChain API.',
      confidence: 0,
    };
  }
};
    // Simulate file size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File size too large. Please upload files smaller than 5MB.",
        confidence: 0,
      };
    }

    // Mock analysis result based on file name patterns
    // In production, this would be actual LangChain processing
    const mockAnalysis: ResumeAnalysis = generateMockAnalysis(file.name);

    return {
      success: true,
      analysis: mockAnalysis,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
    };
  } catch (error) {
    console.error("Resume processing error:", error);
    return {
      success: false,
      error: "Failed to process resume. Please try again.",
      confidence: 0,
    };
  }
};

// Generate mock analysis for demonstration
// In production, this would be replaced by actual LangChain extraction
const generateMockAnalysis = (fileName: string): ResumeAnalysis => {
  const samples = [
    {
      personalInfo: {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
      },
      education: [
        {
          degree: "Ph.D. in Computer Science",
          institution: "Stanford University",
          year: "2016",
          gpa: "3.9",
        },
        {
          degree: "M.S. in Computer Science",
          institution: "MIT",
          year: "2012",
        },
      ],
      experience: [
        {
          position: "Associate Professor",
          company: "University of California",
          duration: "2019 - Present",
          description:
            "Leading research in machine learning and AI applications in healthcare",
        },
        {
          position: "Research Scientist",
          company: "Google Research",
          duration: "2016 - 2019",
          description: "Developed AI algorithms for healthcare diagnostics",
        },
      ],
      skills: [
        "Machine Learning",
        "Python",
        "TensorFlow",
        "PyTorch",
        "Data Science",
        "AI",
        "Healthcare Informatics",
      ],
      research: {
        areas: [
          "Machine Learning",
          "Healthcare AI",
          "Computer Vision",
          "Natural Language Processing",
        ],
        publications: [
          "AI-Powered Diagnosis Systems in Healthcare (Nature, 2023)",
          "Machine Learning Applications in Medical Imaging (IEEE, 2022)",
          "Deep Learning for Drug Discovery (Science, 2021)",
        ],
        projects: [
          "NIH Grant: AI for Early Disease Detection ($500K)",
          "NSF Grant: Healthcare ML Framework ($300K)",
        ],
        patents: [
          "US Patent 11,234,567: AI-based Medical Diagnosis System",
          "US Patent 11,345,678: Machine Learning Drug Discovery Platform",
        ],
      },
      achievements: [
        "Best Paper Award - ICML 2022",
        "Young Researcher Award - IEEE 2021",
        "Outstanding Teaching Award 2020",
      ],
      languages: [
        "English (Native)",
        "Spanish (Fluent)",
        "French (Intermediate)",
      ],
      certifications: [
        "AWS Certified Machine Learning",
        "Google Cloud Professional ML Engineer",
      ],
    },
    {
      personalInfo: {
        name: "Prof. Michael Williams",
        email: "michael.williams@university.edu",
        phone: "+1 (555) 987-6543",
        location: "Boston, MA",
      },
      education: [
        {
          degree: "Ph.D. in Electrical Engineering",
          institution: "MIT",
          year: "2009",
        },
        {
          degree: "M.S. in Electrical Engineering",
          institution: "University of Michigan",
          year: "2005",
        },
      ],
      experience: [
        {
          position: "Professor",
          company: "MIT",
          duration: "2015 - Present",
          description: "Research in IoT, embedded systems, and robotics",
        },
        {
          position: "Senior Engineer",
          company: "Intel Corporation",
          duration: "2009 - 2015",
          description: "Led development of embedded system architectures",
        },
      ],
      skills: [
        "IoT",
        "Embedded Systems",
        "Robotics",
        "C++",
        "Python",
        "FPGA",
        "Circuit Design",
      ],
      research: {
        areas: [
          "Internet of Things",
          "Embedded Systems",
          "Robotics",
          "Smart Cities",
        ],
        publications: [
          "IoT Architecture for Smart Cities (IEEE IoT Journal, 2023)",
          "Embedded AI for Autonomous Systems (ACM, 2022)",
        ],
        projects: [
          "Smart City IoT Infrastructure Project ($1.2M)",
          "Autonomous Robot Navigation System ($800K)",
        ],
        patents: ["US Patent 11,456,789: Smart IoT Device Architecture"],
      },
      achievements: [
        "IEEE Fellow 2020",
        "Best Paper Award - IoT Conference 2022",
        "Industry Collaboration Award 2021",
      ],
      languages: ["English (Native)", "German (Fluent)"],
      certifications: ["Certified IoT Professional", "Embedded Systems Expert"],
    },
  ];

  // Return a random sample for demo purposes
  return samples[Math.floor(Math.random() * samples.length)];
};

// Helper function to extract text from PDF (mock implementation)
// In production, use actual PDF parsing libraries
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // This would use libraries like pdf-parse or pdf2pic in production
  // For now, return mock text
  return `
    Dr. Sarah Johnson
    Associate Professor, Computer Science
    University of California
    
    EDUCATION
    Ph.D. in Computer Science, Stanford University, 2016
    M.S. in Computer Science, MIT, 2012
    
    EXPERIENCE
    Associate Professor, UC (2019-Present)
    Research Scientist, Google Research (2016-2019)
    
    RESEARCH AREAS
    Machine Learning, Healthcare AI, Computer Vision
    
    PUBLICATIONS
    - AI-Powered Diagnosis Systems in Healthcare (Nature, 2023)
    - Machine Learning Applications in Medical Imaging (IEEE, 2022)
    
    SKILLS
    Python, TensorFlow, PyTorch, Machine Learning, Data Science
  `;
};

// Function to suggest profile improvements based on analysis
export const suggestProfileImprovements = (
  analysis: ResumeAnalysis,
): string[] => {
  const suggestions: string[] = [];

  if (!analysis.research.areas || analysis.research.areas.length < 3) {
    suggestions.push(
      "Consider adding more research areas to attract diverse student interests",
    );
  }

  if (
    !analysis.research.publications ||
    analysis.research.publications.length < 5
  ) {
    suggestions.push(
      "Highlight recent publications to showcase active research",
    );
  }

  if (!analysis.skills || analysis.skills.length < 10) {
    suggestions.push("Add more technical skills to improve student matching");
  }

  if (!analysis.research.projects || analysis.research.projects.length < 2) {
    suggestions.push(
      "Include current research projects to show funding and active work",
    );
  }

  return suggestions;
};

// Function to calculate profile completeness score
export const calculateProfileScore = (analysis: ResumeAnalysis): number => {
  let score = 0;
  const maxScore = 100;

  // Personal info (20 points)
  if (analysis.personalInfo.name) score += 5;
  if (analysis.personalInfo.email) score += 5;
  if (analysis.personalInfo.phone) score += 5;
  if (analysis.personalInfo.location) score += 5;

  // Education (15 points)
  if (analysis.education.length > 0) score += 15;

  // Experience (20 points)
  if (analysis.experience.length >= 2) score += 20;
  else if (analysis.experience.length === 1) score += 10;

  // Skills (15 points)
  if (analysis.skills.length >= 10) score += 15;
  else if (analysis.skills.length >= 5) score += 10;
  else if (analysis.skills.length > 0) score += 5;

  // Research (20 points)
  if (analysis.research.areas && analysis.research.areas.length >= 3)
    score += 5;
  if (
    analysis.research.publications &&
    analysis.research.publications.length >= 5
  )
    score += 5;
  if (analysis.research.projects && analysis.research.projects.length >= 2)
    score += 5;
  if (analysis.research.patents && analysis.research.patents.length > 0)
    score += 5;

  // Achievements (10 points)
  if (analysis.achievements.length > 0) score += 10;

  return Math.min(score, maxScore);
};

// Export types for use in components
export type { ResumeAnalysis, ProcessingResult };
