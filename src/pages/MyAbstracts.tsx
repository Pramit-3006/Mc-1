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
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { AbstractSubmission, ProjectRequest } from "../lib/types";

export default function MyAbstracts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [abstracts, setAbstracts] = useState<(AbstractSubmission & { project: ProjectRequest })[]>([]);
  const [filter, setFilter] = useState<"all" | "submitted" | "approved" | "needs_revision">("all");

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:3001/api/abstracts/${user.id}`)
        .then((res) => setAbstracts(res.data))
        .catch((err) => console.error("Error fetching abstracts:", err));
    }
  }, [user?.id]);

  // ...rest of your unchanged component (filteredAbstracts, getStatusIcon, etc.)
}

  const [filter, setFilter] = useState<
    "all" | "submitted" | "approved" | "needs_revision"
  >("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "needs_revision":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs_revision":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredAbstracts = abstracts.filter((abstract) => {
    if (filter === "all") return true;
    return abstract.status === filter;
  });

  const stats = [
    {
      title: "Total Abstracts",
      value: abstracts.length,
      icon: <FileText className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Approved",
      value: abstracts.filter((a) => a.status === "approved").length,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      title: "Under Review",
      value: abstracts.filter((a) => a.status === "submitted").length,
      icon: <Clock className="h-4 w-4" />,
      color: "text-blue-600",
    },
    {
      title: "Need Revision",
      value: abstracts.filter((a) => a.status === "needs_revision").length,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-yellow-600",
    },
  ];

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
            <h1 className="text-lg font-semibold text-gray-900">
              My Abstracts
            </h1>
            <Button asChild>
              <Link to="/abstract-submission">
                <FileText className="h-4 w-4 mr-2" />
                New Abstract
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
                My Project Abstracts
              </h2>
              <p className="text-gray-600">
                Track the status of your submitted research proposals
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
              { key: "all", label: "All Abstracts" },
              { key: "submitted", label: "Under Review" },
              { key: "approved", label: "Approved" },
              { key: "needs_revision", label: "Need Revision" },
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

        {/* Abstracts List */}
        {filteredAbstracts.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === "all"
                    ? "No abstracts yet"
                    : `No ${filter.replace("_", " ")} abstracts`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filter === "all"
                    ? "Submit your first abstract to start your research journey."
                    : `You don't have any ${filter.replace("_", " ")} abstracts at the moment.`}
                </p>
                <Button asChild>
                  <Link to="/abstract-submission">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Abstract
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAbstracts.map((abstract) => (
              <Card
                key={abstract.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">
                          {abstract.title}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(abstract.status)}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(abstract.status)}`}
                          >
                            {abstract.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Submitted{" "}
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(abstract.submittedAt)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {abstract.project.projectType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Faculty Info */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={abstract.project.faculty?.avatar} />
                      <AvatarFallback>
                        {getInitials(abstract.project.faculty?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {abstract.project.faculty?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {abstract.project.faculty?.department}
                      </p>
                    </div>
                  </div>

                  {/* Abstract Preview */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Abstract Preview
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {abstract.content}
                    </p>
                  </div>

                  {/* Feedback */}
                  {abstract.feedback && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Faculty Feedback
                      </h4>
                      <p className="text-sm text-blue-800">
                        {abstract.feedback}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full
                      </Button>
                      {abstract.status === "needs_revision" && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Revise
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Faculty
                      </Button>
                      {abstract.status === "approved" && (
                        <Button>Continue Project</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Abstract Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">Clear Objectives</h4>
                <p>State your research goals and expected outcomes clearly.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Methodology</h4>
                <p>Describe your approach and methods in detail.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Timeline</h4>
                <p>Provide realistic timelines for project milestones.</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Impact</h4>
                <p>
                  Explain the potential impact and contribution to the field.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
