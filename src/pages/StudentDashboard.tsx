import React, { useState, useEffect } from "react";
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
import { Faculty, ProjectIdea, ProjectRequest } from "../lib/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState<ProjectRequest[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectIdea[]>([]);
  const [topFaculty, setTopFaculty] = useState<Faculty[]>([]);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`/api/dashboard/student/${user.id}`);
        const data = await res.json();
        setMyProjects(data.myProjects);
        setFeaturedProjects(data.featuredProjects);
        setTopFaculty(data.topFaculty);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboardData();
  }, [user]);

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
      case "accepted": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mb-4">Ready to explore new research opportunities?</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link to="/project-selection" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Start New Project
            </Link>
          </Button>
          <Button variant="outline" className="border-blue-300 text-white hover:bg-blue-500" asChild>
            <Link to="/browse-faculty">Browse Faculty</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
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

      {/* Project Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> My Projects
              </CardTitle>
              <CardDescription>Track your ongoing collaborations</CardDescription>
            </CardHeader>
            <CardContent>
              {myProjects.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No projects yet</p>
                  <Button asChild>
                    <Link to="/project-selection">Start Your First Project</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            with {project.faculty?.name} • {project.faculty?.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{project.projectType.replace("_", " ")}</Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Featured Opportunities
              </CardTitle>
              <CardDescription>Discover exciting projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onApply={() => {}} onViewDetails={() => {}} />
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start">
                <Link to="/project-selection" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> New Project Request
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/browse-faculty" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Browse Faculty
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/my-abstracts" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> My Abstracts
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Faculty</CardTitle>
              <CardDescription>Connect with top faculty members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topFaculty.map((faculty) => (
                <FacultyCard key={faculty.id} faculty={faculty} />
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
