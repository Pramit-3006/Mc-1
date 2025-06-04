import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { ProjectCard } from "../components/ProjectCard";
import {
  ArrowLeft,
  Plus,
  FileText,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
} from "lucide-react";
import { ProjectIdea } from "../lib/types";

export default function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in production this would come from your backend
  const [myProjects] = useState<ProjectIdea[]>([
    {
      id: "1",
      title: "AI-Powered Healthcare Diagnosis System",
      description:
        "Develop a machine learning system to assist doctors in early disease detection using medical imaging and patient data.",
      type: "PROJECT",
      facultyId: user?.id || "2",
      requiredSkills: [
        "Python",
        "TensorFlow",
        "Computer Vision",
        "Medical Imaging",
      ],
      duration: "6 months",
      difficulty: "advanced",
      maxStudents: 3,
      currentStudents: 2,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      title: "Blockchain for Supply Chain Management",
      description:
        "Research and develop a blockchain-based solution for transparent and secure supply chain tracking.",
      type: "RESEARCH_PAPER",
      facultyId: user?.id || "2",
      requiredSkills: [
        "Blockchain",
        "Smart Contracts",
        "Solidity",
        "Supply Chain",
      ],
      duration: "8 months",
      difficulty: "intermediate",
      maxStudents: 2,
      currentStudents: 1,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      title: "Novel Drug Delivery System Patent",
      description:
        "Develop and patent a new nanotechnology-based drug delivery system for targeted cancer treatment.",
      type: "PATENT",
      facultyId: user?.id || "2",
      requiredSkills: [
        "Nanotechnology",
        "Biomedical Engineering",
        "Research",
        "Patent Writing",
      ],
      duration: "12 months",
      difficulty: "advanced",
      maxStudents: 1,
      currentStudents: 1,
      createdAt: new Date("2024-01-10"),
    },
  ]);

  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "draft"
  >("all");

  const stats = [
    {
      title: "Total Projects",
      value: myProjects.length,
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Active Students",
      value: myProjects.reduce((acc, p) => acc + p.currentStudents, 0),
      icon: <Users className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Available Spots",
      value: myProjects.reduce(
        (acc, p) => acc + (p.maxStudents - p.currentStudents),
        0,
      ),
      icon: <Plus className="h-4 w-4" />,
      color: "text-orange-600",
    },
    {
      title: "Completion Rate",
      value: "85%",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ];

  const handleEditProject = (projectId: string) => {
    console.log("Edit project:", projectId);
    // Navigate to edit page
  };

  const handleDeleteProject = (projectId: string) => {
    console.log("Delete project:", projectId);
    // Show confirmation dialog and delete
  };

  const handleViewDetails = (projectId: string) => {
    console.log("View project details:", projectId);
    // Navigate to project details page
  };

  const getStatusBadge = (project: ProjectIdea) => {
    if (project.currentStudents === 0) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Draft
        </Badge>
      );
    } else if (project.currentStudents < project.maxStudents) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Active
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Full
        </Badge>
      );
    }
  };

  const filteredProjects = myProjects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "active")
      return (
        project.currentStudents > 0 &&
        project.currentStudents < project.maxStudents
      );
    if (filter === "completed")
      return project.currentStudents === project.maxStudents;
    if (filter === "draft") return project.currentStudents === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">My Projects</h1>
            <Button asChild>
              <Link to="/create-project" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Research Projects
              </h2>
              <p className="text-gray-600">
                Manage your posted opportunities and track student engagement
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "All Projects" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Full" },
              { key: "draft", label: "Draft" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === "all"
                    ? "No projects yet"
                    : `No ${filter} projects`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filter === "all"
                    ? "Create your first project to start collaborating with students."
                    : `You don't have any ${filter} projects at the moment.`}
                </p>
                <Button asChild>
                  <Link to="/create-project">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">
                          {project.title}
                        </CardTitle>
                        {getStatusBadge(project)}
                        <Badge variant="secondary" className="text-xs">
                          {project.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        Created on{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(project.createdAt)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(project.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(project.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Team Progress
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            Students: {project.currentStudents}/
                            {project.maxStudents}
                          </span>
                          <span>
                            {Math.round(
                              (project.currentStudents / project.maxStudents) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (project.currentStudents / project.maxStudents) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {project.duration}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </h4>
                      <Badge
                        variant="outline"
                        className={
                          project.difficulty === "beginner"
                            ? "border-green-200 text-green-700"
                            : project.difficulty === "intermediate"
                              ? "border-yellow-200 text-yellow-700"
                              : "border-red-200 text-red-700"
                        }
                      >
                        {project.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills?.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Students
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>

                    <Button onClick={() => handleViewDetails(project.id)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                asChild
              >
                <Link to="/create-project">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create New Project</div>
                    <div className="text-sm text-gray-600">
                      Post a new research opportunity
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-gray-600">
                    Track project performance
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                asChild
              >
                <Link to="/enhanced-profile">
                  <Settings className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">AI-Enhanced Profile</div>
                    <div className="text-sm text-gray-600">
                      Use LangChain to enhance your profile
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
