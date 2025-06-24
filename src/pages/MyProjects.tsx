import React, { useEffect, useState } from "react";
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
import axios from "axios";

export default function MyProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "draft">("all");

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:3001/api/projects/faculty/${user.id}`)
        .then((res) => setProjects(res.data))
        .catch((err) => console.error("Failed to fetch projects:", err));
    }
  }, [user]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const getStatusBadge = (project: ProjectIdea) => {
    if (project.currentStudents === 0) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Draft</Badge>;
    } else if (project.currentStudents < project.maxStudents) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
    } else {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Full</Badge>;
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "active") return project.currentStudents > 0 && project.currentStudents < project.maxStudents;
    if (filter === "completed") return project.currentStudents === project.maxStudents;
    if (filter === "draft") return project.currentStudents === 0;
    return true;
  });

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Active Students",
      value: projects.reduce((acc, p) => acc + p.currentStudents, 0),
      icon: <Users className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Available Spots",
      value: projects.reduce((acc, p) => acc + (p.maxStudents - p.currentStudents), 0),
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
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

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Research Projects</h2>
              <p className="text-gray-600">Manage your posted opportunities and track student engagement</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {["all", "active", "completed", "draft"].map((key) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as any)}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {filter === "all" ? "projects yet" : `${filter} projects`}
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
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        {getStatusBadge(project)}
                        <Badge variant="secondary" className="text-xs">
                          {project.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        Created on {new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(project.createdAt))}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/project/${project.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/edit-project/${project.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Team Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Students: {project.currentStudents}/{project.maxStudents}</span>
                          <span>{Math.round((project.currentStudents / project.maxStudents) * 100)}%</span>
                        </div>
                        <Progress
                          value={(project.currentStudents / project.maxStudents) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Duration</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {project.duration}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h4>
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
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills?.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
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
                    <Button onClick={() => navigate(`/project/${project.id}`)}>View Details</Button>
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
              <Button variant="outline" className="justify-start h-auto p-4" asChild>
                <Link to="/create-project">
                  <Plus className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create New Project</div>
                    <div className="text-sm text-gray-600">Post a new research opportunity</div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-gray-600">Track project performance</div>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4" asChild>
                <Link to="/enhanced-profile">
                  <Settings className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">AI-Enhanced Profile</div>
                    <div className="text-sm text-gray-600">Use LangChain to enhance your profile</div>
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
