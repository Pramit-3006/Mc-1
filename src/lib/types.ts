export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "faculty";
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: "student";
  year?: string;
  department?: string;
  interests?: string[];
}

export interface Faculty extends User {
  role: "faculty";
  department: string;
  position: string;
  specialization: string[];
  experience: number;
  resumeUrl?: string;
  bio?: string;
  researchAreas?: string[];
  publications?: number;
  activeProjects?: number;
}

export type ProjectType = "PROJECT" | "PATENT" | "RESEARCH_PAPER";

export type IdeaType = "own_idea" | "collaborate";

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  facultyId: string;
  faculty?: Faculty;
  requiredSkills?: string[];
  duration?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  maxStudents: number;
  currentStudents: number;
  createdAt: Date;
}

export interface ProjectRequest {
  id: string;
  studentId: string;
  student?: Student;
  facultyId: string;
  faculty?: Faculty;
  projectType: ProjectType;
  ideaType: IdeaType;
  title: string;
  description: string;
  abstract?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date;
  respondedAt?: Date;
  projectIdeaId?: string;
}

export interface AbstractSubmission {
  id: string;
  projectRequestId: string;
  studentId: string;
  title: string;
  content: string;
  fileUrl?: string;
  submittedAt: Date;
  feedback?: string;
  status: "submitted" | "approved" | "needs_revision";
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: "student" | "faculty",
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
