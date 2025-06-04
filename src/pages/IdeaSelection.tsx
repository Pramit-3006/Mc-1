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
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Users,
  FileText,
  CheckCircle,
} from "lucide-react";
import { ProjectType, IdeaType } from "../lib/types";

export default function IdeaSelection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);
  const [ideaType, setIdeaType] = useState<IdeaType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
      return;
    }

    // Get selected types from previous step
    const storedTypes = localStorage.getItem("selectedProjectTypes");
    if (storedTypes) {
      setSelectedTypes(JSON.parse(storedTypes));
    } else {
      // If no types selected, go back to project selection
      navigate("/project-selection");
    }
  }, [user, navigate]);

  const ideaOptions = [
    {
      type: "own_idea" as IdeaType,
      title: "I have my own idea",
      description:
        "Share your innovative concept and find faculty members who can guide and mentor you in developing it further.",
      icon: <Lightbulb className="h-8 w-8" />,
      features: [
        "Present your original concept",
        "Get expert guidance and feedback",
        "Develop your idea with faculty support",
        "Maintain ownership of your innovation",
        "Access to resources and facilities",
      ],
      benefits: [
        "Full creative control",
        "Personal investment in outcome",
        "Unique portfolio addition",
        "Potential for patent/publication",
      ],
      nextStep: "Describe your idea and find matching faculty",
    },
    {
      type: "collaborate" as IdeaType,
      title: "I want to collaborate on existing ideas",
      description:
        "Browse and join exciting projects and research opportunities that faculty members have already proposed.",
      icon: <Users className="h-8 w-8" />,
      features: [
        "Join ongoing research projects",
        "Work with established teams",
        "Learn from experienced researchers",
        "Contribute to existing innovations",
        "Build collaborative skills",
      ],
      benefits: [
        "Immediate project availability",
        "Proven research direction",
        "Team learning experience",
        "Faster project initiation",
      ],
      nextStep: "Browse available faculty projects",
    },
  ];

  const handleContinue = async () => {
    if (!ideaType) {
      return;
    }

    setIsSubmitting(true);

    // Store the idea type selection
    localStorage.setItem("selectedIdeaType", ideaType);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);

    // Navigate based on selection
    if (ideaType === "own_idea") {
      navigate("/faculty-browse");
    } else {
      navigate("/browse-projects");
    }
  };

  const getProjectTypeName = (type: ProjectType) => {
    switch (type) {
      case "PROJECT":
        return "Project Development";
      case "PATENT":
        return "Patent Filing";
      case "RESEARCH_PAPER":
        return "Research Paper";
      default:
        return type;
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
              onClick={() => navigate("/project-selection")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Choose Your Approach
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Choose Type
              </span>
            </div>
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
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
            How would you like to approach your project?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Choose whether you want to develop your own innovative idea or
            collaborate on existing faculty-led research.
          </p>

          {/* Selected Types Summary */}
          <div className="flex justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-2">
                You're interested in:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {getProjectTypeName(type)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Idea Type Selection */}
        <RadioGroup
          value={ideaType}
          onValueChange={(value) => setIdeaType(value as IdeaType)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {ideaOptions.map((option) => {
              const isSelected = ideaType === option.type;

              return (
                <Card
                  key={option.type}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected
                      ? "ring-2 ring-blue-500 shadow-lg bg-blue-50"
                      : "hover:ring-1 hover:ring-gray-300"
                  }`}
                  onClick={() => setIdeaType(option.type)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-lg ${isSelected ? "bg-blue-600" : "bg-gradient-to-br from-indigo-500 to-purple-600"} text-white`}
                      >
                        {option.icon}
                      </div>
                      <RadioGroupItem value={option.type} id={option.type} />
                    </div>

                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {option.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">
                        What you'll do:
                      </h4>
                      <ul className="space-y-1">
                        {option.features.map((feature, index) => (
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

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">
                        Key Benefits:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {option.benefits.map((benefit, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Next step:</span>{" "}
                        {option.nextStep}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </RadioGroup>

        {/* Selection Summary */}
        {ideaType && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">
                  Perfect! You've chosen to{" "}
                  {ideaType === "own_idea"
                    ? "develop your own idea"
                    : "collaborate on existing projects"}
                  .
                </h3>
              </div>
              <p className="text-sm text-green-700">
                {ideaType === "own_idea"
                  ? "You'll be able to present your concept to faculty members and find the perfect mentor to guide your innovation."
                  : "You'll browse exciting opportunities posted by faculty and join projects that match your interests and skills."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/project-selection")}
          >
            Back
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!ideaType || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                Continue to{" "}
                {ideaType === "own_idea" ? "Faculty Browse" : "Project Browse"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't worry - you can always switch between approaches later. Both
            paths offer valuable learning experiences and networking
            opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
