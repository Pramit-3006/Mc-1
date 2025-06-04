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
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
} from "lucide-react";
import { ProjectRequest, Student, ProjectIdea } from "../lib/types";

export default function FacultyDashboard() {
  const { user } = useAuth();

  // Mock data - in production this would come from your backend
  const [pendingRequests] = useState<ProjectRequest[]>([
    {
      id: "1",
      studentId: "1",
      student: {
        id: "1",
        name: "John Smith",
        email: "john.student@university.edu",
        role: "student",
        year: "3rd Year",
        department: "Computer Science",
        interests: ["Machine Learning", "Web Development"],
        createdAt: new Date("2024-01-15"),
      },
      facultyId: "2",
      projectType: "RESEARCH_PAPER",
      ideaType: "own_idea",
      title: "AI-powered Code Generation Tools",
      description:
        "Research on developing intelligent code generation tools using large language models for software development automation.",
      status: "pending",
      createdAt: new Date("2024-01-22"),
    },
    {
      id: "2",
      studentId: "4",
      student: {
        id: "4",
        name: "Emily Chen",
        email: "emily.chen@university.edu",
        role: "student",
        year: "4th Year",
        department: "Computer Science",
        interests: ["Data Science", "AI Ethics"],
        createdAt: new Date("2024-01-12"),
      },
      facultyId: "2",
      projectType: "PROJECT",
      ideaType: "collaborate",
      title: "Healthcare AI Ethics Framework",
      description:
        "Collaborate on developing ethical guidelines and frameworks for AI applications in healthcare systems.",
      status: "pending",
      createdAt: new Date("2024-01-21"),
    },
  ]);

  const [myProjects] = useState<ProjectIdea[]>([
    {
      id: "1",
      title: "AI-Powered Healthcare Diagnosis System",
      description:
        "Develop a machine learning system to assist doctors in early disease detection using medical imaging and patient data.",
      type: "PROJECT",
      facultyId: "2",
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
  ]);

  const [activeCollaborations] = useState<ProjectRequest[]>([
    {
      id: "3",
      studentId: "5",
      student: {
        id: "5",
        name: "Alex Rodriguez",
        email: "alex.rodriguez@university.edu",
        role: "student",
        year: "3rd Year",
        department: "Computer Science",
        interests: ["Machine Learning", "Computer Vision"],
        createdAt: new Date("2024-01-10"),
      },
      facultyId: "2",
      projectType: "RESEARCH_PAPER",
      ideaType: "own_idea",
      title: "Computer Vision in Autonomous Vehicles",
      description:
        "Research on improving object detection and recognition algorithms for autonomous vehicle navigation systems.",
      status: "accepted",
      createdAt: new Date("2024-01-15"),
      respondedAt: new Date("2024-01-16"),
    },
  ]);

  const stats = [
    {
      title: "Pending Requests",
      value: pendingRequests.length,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
    },
    {
      title: "Active Projects",
      value: activeCollaborations.length,
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Posted Opportunities",
      value: myProjects.length,
      icon: <FileText className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Total Students",
      value: myProjects.reduce((acc, p) => acc + p.currentStudents, 0),
      icon: <Users className="h-4 w-4" />,
      color: "text-purple-600",
    },
  ];

  const handleAcceptRequest = (requestId: string) => {
    console.log("Accept request:", requestId);
    // In production, this would make an API call
  };

  const handleRejectRequest = (requestId: string) => {
    console.log("Reject request:", requestId);
    // In production, this would make an API call
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-indigo-100 mb-4">
          Manage your research collaborations and guide the next generation of
          researchers.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link to="/create-project" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Post New Opportunity
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-indigo-300 text-white hover:bg-indigo-500"
            asChild
          >
            <Link to="/profile-setup">Update Profile</Link>
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
        {/* Pending Requests */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pending Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="secondary">{pendingRequests.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Review and respond to student collaboration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No pending requests</p>
                  <p className="text-sm text-gray-500">
                    New collaboration requests will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.student?.avatar} />
                          <AvatarFallback>
                            {getInitials(request.student?.name || "")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {request.student?.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {request.student?.year} •{" "}
                                {request.student?.department}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {request.projectType.replace("_", " ")}
                            </Badge>
                          </div>

                          <h5 className="font-medium text-gray-900 mb-2">
                            {request.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {request.description}
                          </p>

                          {request.student?.interests && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {request.student.interests.map(
                                (interest, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {interest}
                                  </Badge>
                                ),
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              Requested{" "}
                              {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }).format(request.createdAt)}
                            </p>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptRequest(request.id)}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Collaborations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Collaborations
              </CardTitle>
              <CardDescription>Ongoing projects with students</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCollaborations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No active collaborations</p>
                  <p className="text-sm text-gray-500">
                    Accepted projects will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCollaborations.map((collaboration) => (
                    <div
                      key={collaboration.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={collaboration.student?.avatar} />
                          <AvatarFallback>
                            {getInitials(collaboration.student?.name || "")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {collaboration.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                with {collaboration.student?.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(collaboration.status)}
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50 text-green-800 border-green-200"
                              >
                                Active
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {collaboration.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {collaboration.projectType.replace("_", " ")}
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Message
                              </Button>
                              <Button size="sm">View Progress</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <Link to="/create-project" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Post New Opportunity
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link to="/my-projects" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Manage Projects
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link to="/profile-setup" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* My Posted Projects */}
          <Card>
            <CardHeader>
              <CardTitle>My Opportunities</CardTitle>
              <CardDescription>
                Projects you've posted for students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">
                    {project.title}
                  </h4>

                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {project.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {project.currentStudents}/{project.maxStudents} students
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.requiredSkills?.slice(0, 2).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Manage
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full" asChild>
                <Link to="/create-project">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-medium">124</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project Inquiries</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Student Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
