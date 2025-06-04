import { User, Student, Faculty } from "./types";

// Mock data for demonstration - in production, this would connect to a real backend
const mockUsers: User[] = [
  {
    id: "1",
    email: "john.student@university.edu",
    name: "John Smith",
    role: "student",
    createdAt: new Date("2024-01-15T00:00:00Z"),
    department: "Computer Science",
    year: "3rd Year",
    interests: ["Machine Learning", "Web Development", "AI"],
  } as Student,
  {
    id: "2",
    email: "dr.johnson@university.edu",
    name: "Dr. Sarah Johnson",
    role: "faculty",
    department: "Computer Science",
    position: "Associate Professor",
    specialization: ["Machine Learning", "Data Science", "AI"],
    experience: 8,
    bio: "Experienced researcher in AI and Machine Learning with focus on healthcare applications.",
    researchAreas: [
      "Healthcare AI",
      "Computer Vision",
      "Natural Language Processing",
    ],
    publications: 45,
    activeProjects: 3,
    createdAt: new Date("2024-01-10T00:00:00Z"),
  } as Faculty,
  {
    id: "3",
    email: "prof.williams@university.edu",
    name: "Prof. Michael Williams",
    role: "faculty",
    department: "Electrical Engineering",
    position: "Professor",
    specialization: ["IoT", "Embedded Systems", "Robotics"],
    experience: 15,
    bio: "Leading expert in IoT and embedded systems with extensive industry collaboration.",
    researchAreas: ["Smart Cities", "Industrial IoT", "Autonomous Systems"],
    publications: 78,
    activeProjects: 5,
    createdAt: new Date("2024-01-05T00:00:00Z"),
  } as Faculty,
];

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simple mock authentication - in production, use proper authentication
  const user = mockUsers.find((u) => u.email === email);
  if (user && password.length > 0) {
    return user;
  }

  throw new Error("Invalid credentials");
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "student" | "faculty",
): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
    createdAt: new Date(),
  };

  mockUsers.push(newUser);
  return newUser;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem("currentUser");
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    // Ensure createdAt is a proper Date object
    if (user.createdAt) {
      user.createdAt = new Date(user.createdAt);
    }
    return user;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
};

export const getAllFaculty = (): Faculty[] => {
  return mockUsers.filter((user) => user.role === "faculty") as Faculty[];
};

export const getFacultyById = (id: string): Faculty | null => {
  const user = mockUsers.find((u) => u.id === id && u.role === "faculty");
  return (user as Faculty) || null;
};
