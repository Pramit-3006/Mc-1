import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { FacultyCard } from "../components/FacultyCard";
import { ProjectCard } from "../components/ProjectCard";
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getAllFaculty } from "../lib/auth";
import { Faculty, ProjectIdea, ProjectRequest } from "../lib/types";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Mock data - in production this would come from your backend
  const [featuredProjects] = useState<ProjectIdea[]>([
    {
      id: "1",
      title: "AI-Powered Healthcare Diagnosis System",
      description:
        "Develop a machine learning system to assist doctors in early disease detection using medical imaging and patient data.",
      type: "PROJECT",
      facultyId: "2",
      faculty: {
        id: "2",
        name: "Dr. Sarah Johnson",
        email: "dr.johnson@university.edu",
        role: "faculty",
        department: "Computer Science",
        position: "Associate Professor",
        specialization: ["Machine Learning", "Data Science", "AI"],
        experience: 8,
        createdAt: new Date("2024-01-10"),
      },
      requiredSkills: [
        "Python",
        "TensorFlow",
        "Computer Vision",
        "Medical Imaging",
      ],
      duration: "6 months",
      difficulty: "advanced",
      maxStudents: 3,
      currentStudents: 1,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      title: "Smart Campus IoT Network",
      description:
        "Design and implement an IoT network for smart campus management including energy monitoring and automation.",
      type: "PROJECT",
      facultyId: "3",
      faculty: {
        id: "3",
        name: "Prof. Michael Williams",
        email: "prof.williams@university.edu",
        role: "faculty",
        department: "Electrical Engineering",
        position: "Professor",
        specialization: ["IoT", "Embedded Systems", "Robotics"],
        experience: 15,
        createdAt: new Date("2024-01-05"),
      },
      requiredSkills: ["Arduino", "Raspberry Pi", "C++", "Networking"],
      duration: "4 months",
      difficulty: "intermediate",
      maxStudents: 4,
      currentStudents: 2,
      createdAt: new Date("2024-01-18"),
    },
  ]);

  const [myProjects] = useState<ProjectRequest[]>([
    {
      id: "1",
      studentId: "1",
      facultyId: "2",
      faculty: {
        id: "2",
        name: "Dr. Sarah Johnson",
        email: "dr.johnson@university.edu",
        role: "faculty",
        department: "Computer Science",
        position: "Associate Professor",
        specialization: ["Machine Learning", "Data Science", "AI"],
        experience: 8,
        createdAt: new Date("2024-01-10"),
      },
      projectType: "RESEARCH_PAPER",
      ideaType: "own_idea",
      title: "Natural Language Processing in Healthcare",
      description:
        "Research on improving patient-doctor communication through AI-powered language understanding.",
      status: "accepted",
      createdAt: new Date("2024-01-15"),
      respondedAt: new Date("2024-01-16"),
    },
  ]);

  const topFaculty = getAllFaculty().slice(0, 3);

  const stats = [
    {
      title: "Active Projects",
      value: myProjects.filter((p) => p.status === "accepted").length,
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Pending Requests",
      value: myProjects.filter((p) => p.status === "pending").length,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
    },
    {
      title: "Completed",
      value: myProjects.filter((p) => p.status === "completed").length,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Faculty Connections",
      value: new Set(myProjects.map((p) => p.facultyId)).size,
      icon: <Users className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mb-4">
          Ready to explore new research opportunities and collaborate with
          faculty?
        </p>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link to="/project-selection" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Start New Project
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-blue-300 text-white hover:bg-blue-500"
            asChild
          >
            <Link to="/browse-faculty">Browse Faculty</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Projects */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Projects
              </CardTitle>
              <CardDescription>
                Track your ongoing collaborations and project status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myProjects.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No projects yet</p>
                  <Button asChild>
                    <Link to="/project-selection">
                      Start Your First Project
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {project.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            with {project.faculty?.name} •{" "}
                            {project.faculty?.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {project.projectType.replace("_", " ")}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Featured Opportunities
              </CardTitle>
              <CardDescription>
                Discover exciting projects posted by faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onApply={(id) => console.log("Apply to project:", id)}
                    onViewDetails={(id) => console.log("View project:", id)}
                  />
                ))}
              </div>

              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link to="/browse-projects">View All Projects</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link
                  to="/project-selection"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Project Request
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link to="/browse-faculty" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Browse Faculty
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link to="/my-abstracts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Abstracts
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Top Faculty */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Faculty</CardTitle>
              <CardDescription>
                Connect with highly rated faculty members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topFaculty.map((faculty) => (
                <div key={faculty.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {faculty.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{faculty.name}</h4>
                      <p className="text-xs text-gray-600">
                        {faculty.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {faculty.specialization.slice(0, 2).map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full" asChild>
                <Link to="/browse-faculty">View All Faculty</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
