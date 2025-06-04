import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "../components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { ProjectType } from "../lib/types";

export default function ProjectSelection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const projectTypes = [
    {
      type: "PROJECT" as ProjectType,
      title: "Project Development",
      description:
        "Work on innovative software, hardware, or research projects with faculty guidance. Build practical solutions and gain hands-on experience.",
      icon: <Lightbulb className="h-8 w-8" />,
      features: [
        "Hands-on development experience",
        "Real-world problem solving",
        "Portfolio building opportunity",
        "Industry-relevant skills",
        "Teamwork and collaboration",
      ],
      duration: "3-6 months",
      commitment: "Medium to High",
      skills: "Programming, Design, Analysis",
    },
    {
      type: "PATENT" as ProjectType,
      title: "Patent Filing",
      description:
        "Learn the patent process and file patents for your innovative ideas. Get guidance on intellectual property protection and commercialization.",
      icon: <FileText className="h-8 w-8" />,
      features: [
        "Intellectual property protection",
        "Innovation documentation",
        "Legal process understanding",
        "Commercialization potential",
        "Professional patent writing",
      ],
      duration: "4-8 months",
      commitment: "High",
      skills: "Research, Writing, Innovation",
    },
    {
      type: "RESEARCH_PAPER" as ProjectType,
      title: "Research Paper",
      description:
        "Conduct academic research and publish papers in reputable journals or conferences. Develop research methodology and academic writing skills.",
      icon: <BookOpen className="h-8 w-8" />,
      features: [
        "Academic publication opportunity",
        "Research methodology training",
        "Literature review skills",
        "Data analysis experience",
        "Academic writing development",
      ],
      duration: "6-12 months",
      commitment: "High",
      skills: "Research, Analysis, Writing",
    },
  ];

  const handleTypeToggle = (type: ProjectType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedTypes.length === 0) {
      return;
    }

    setIsSubmitting(true);

    // Store selections in localStorage for the next step
    localStorage.setItem("selectedProjectTypes", JSON.stringify(selectedTypes));

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    navigate("/idea-selection");
  };

  const getTypeColor = (type: ProjectType) => {
    switch (type) {
      case "PROJECT":
        return "from-blue-500 to-cyan-500";
      case "PATENT":
        return "from-purple-500 to-pink-500";
      case "RESEARCH_PAPER":
        return "from-emerald-500 to-teal-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

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
              Project Selection
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Choose Type
              </span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Select Approach
              </span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Find Faculty</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What would you like to work on?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select one or more areas you're interested in exploring. You can
            choose multiple types to maximize your collaboration opportunities.
          </p>
        </div>

        {/* Project Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {projectTypes.map((projectType) => {
            const isSelected = selectedTypes.includes(projectType.type);

            return (
              <Card
                key={projectType.type}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "hover:ring-1 hover:ring-gray-300"
                }`}
                onClick={() => handleTypeToggle(projectType.type)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${getTypeColor(projectType.type)} text-white`}
                    >
                      {projectType.icon}
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleTypeToggle(projectType.type)}
                      className="mt-2"
                    />
                  </div>

                  <CardTitle className="text-xl">{projectType.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {projectType.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      Key Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {projectType.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <Badge variant="secondary">{projectType.duration}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Commitment:</span>
                      <Badge variant="outline">{projectType.commitment}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Skills:</span>
                      <span className="text-xs text-gray-600 text-right">
                        {projectType.skills}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedTypes.length > 0 && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">
                  You've selected {selectedTypes.length} type
                  {selectedTypes.length > 1 ? "s" : ""}:
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {projectTypes.find((pt) => pt.type === type)?.title}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-blue-700 mt-3">
                Great choice! You'll have access to opportunities in all
                selected areas and can work with faculty across multiple
                disciplines.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>

          <Button
            onClick={handleContinue}
            disabled={selectedTypes.length === 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help choosing? You can select multiple types and explore
            different opportunities. You can always modify your preferences
            later in your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
