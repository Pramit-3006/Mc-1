import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  ArrowLeft,
  Send,
  User,
  FileText,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import { getFacultyById } from "../lib/auth";
import { Faculty, ProjectType, IdeaType } from "../lib/types";

export default function ProjectRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);
  const [ideaType, setIdeaType] = useState<IdeaType>("own_idea");

  const [formData, setFormData] = useState({
    projectType: "" as ProjectType | "",
    title: "",
    description: "",
    objectives: "",
    methodology: "",
    timeline: "",
    expectedOutcomes: "",
    personalMotivation: "",
    relevantExperience: "",
    questions: "",
  });

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
      return;
    }

    // Get selected faculty from localStorage
    const facultyId = localStorage.getItem("selectedFacultyId");
    if (facultyId) {
      const faculty = getFacultyById(facultyId);
      setSelectedFaculty(faculty);
    }

    // Get selected project types and idea type from previous steps
    const storedTypes = localStorage.getItem("selectedProjectTypes");
    if (storedTypes) {
      setSelectedTypes(JSON.parse(storedTypes));
    }

    const storedIdeaType = localStorage.getItem("selectedIdeaType");
    if (storedIdeaType) {
      setIdeaType(storedIdeaType as IdeaType);
    }

    // If no faculty selected, redirect to faculty browse
    if (!facultyId) {
      navigate("/faculty-browse");
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.projectType) {
      setError("Please select a project type");
      return;
    }

    if (!formData.title.trim()) {
      setError("Project title is required");
      return;
    }

    if (!formData.description.trim() || formData.description.length < 100) {
      setError("Project description must be at least 100 characters");
      return;
    }

    if (!formData.personalMotivation.trim()) {
      setError("Please explain your motivation for this project");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would make an API call to submit the project request
      const requestData = {
        ...formData,
        facultyId: selectedFaculty?.id,
        studentId: user?.id,
        ideaType,
        submittedAt: new Date(),
      };

      console.log("Submitting project request:", requestData);

      // Clear stored data
      localStorage.removeItem("selectedFacultyId");
      localStorage.removeItem("selectedProjectTypes");
      localStorage.removeItem("selectedIdeaType");

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Request Sent Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your collaboration request has been sent to{" "}
              {selectedFaculty?.name}. You'll receive a response within 2-3
              business days.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Return to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/faculty-browse")}
                className="w-full"
              >
                Browse More Faculty
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedFaculty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading faculty information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/faculty-browse")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Faculty Browse
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Submit Collaboration Request
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Send className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Request Collaboration
              </h2>
              <p className="text-gray-600">
                Submit a detailed proposal to work with this faculty member
              </p>
            </div>
          </div>

          {/* Faculty Info Card */}
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedFaculty.avatar}
                    alt={selectedFaculty.name}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedFaculty.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">
                    {selectedFaculty.name}
                  </h3>
                  <p className="text-blue-700 mb-2">
                    {selectedFaculty.position}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-blue-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedFaculty.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {selectedFaculty.experience} years experience
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.specialization
                      .slice(0, 3)
                      .map((spec, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          {spec}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Preferences Summary */}
          {(selectedTypes.length > 0 || ideaType) && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-green-900 mb-2">
                  Your Preferences:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      {getProjectTypeName(type)}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className="border-green-300 text-green-700"
                  >
                    {ideaType === "own_idea"
                      ? "Your Own Idea"
                      : "Collaboration"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Project Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Project Type</CardTitle>
              <CardDescription>
                Select the type of collaboration you're interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.projectType}
                onValueChange={(value) =>
                  handleInputChange("projectType", value)
                }
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="PROJECT" id="project" />
                    <div className="flex-1">
                      <Label
                        htmlFor="project"
                        className="font-medium cursor-pointer"
                      >
                        Project Development
                      </Label>
                      <p className="text-sm text-gray-600">
                        Build practical solutions with hands-on development
                        experience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="RESEARCH_PAPER" id="research" />
                    <div className="flex-1">
                      <Label
                        htmlFor="research"
                        className="font-medium cursor-pointer"
                      >
                        Research Paper
                      </Label>
                      <p className="text-sm text-gray-600">
                        Conduct academic research and publish in reputable
                        journals
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="PATENT" id="patent" />
                    <div className="flex-1">
                      <Label
                        htmlFor="patent"
                        className="font-medium cursor-pointer"
                      >
                        Patent Filing
                      </Label>
                      <p className="text-sm text-gray-600">
                        Develop and patent innovative ideas with IP protection
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Provide comprehensive information about your proposed project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., AI-powered Healthcare Diagnosis System"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of your project idea, including the problem you want to solve, your approach, and why this project interests you..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="min-h-[120px]"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.description.length}/100 characters minimum
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="objectives">Research Objectives</Label>
                  <Textarea
                    id="objectives"
                    placeholder="What specific goals do you want to achieve?"
                    value={formData.objectives}
                    onChange={(e) =>
                      handleInputChange("objectives", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="methodology">Proposed Methodology</Label>
                  <Textarea
                    id="methodology"
                    placeholder="How do you plan to approach this project?"
                    value={formData.methodology}
                    onChange={(e) =>
                      handleInputChange("methodology", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Expected Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 6 months, 1 year"
                    value={formData.timeline}
                    onChange={(e) =>
                      handleInputChange("timeline", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="expectedOutcomes">Expected Outcomes</Label>
                  <Input
                    id="expectedOutcomes"
                    placeholder="What results do you expect?"
                    value={formData.expectedOutcomes}
                    onChange={(e) =>
                      handleInputChange("expectedOutcomes", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Motivation & Experience</CardTitle>
              <CardDescription>
                Help the faculty understand your background and motivation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="personalMotivation">
                  Why are you interested in this project?
                </Label>
                <Textarea
                  id="personalMotivation"
                  placeholder="Explain your personal motivation, how this aligns with your career goals, and why you want to work with this specific faculty member..."
                  value={formData.personalMotivation}
                  onChange={(e) =>
                    handleInputChange("personalMotivation", e.target.value)
                  }
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="relevantExperience">
                  Relevant Experience & Skills
                </Label>
                <Textarea
                  id="relevantExperience"
                  placeholder="Describe any relevant coursework, projects, internships, or skills that make you a good fit for this project..."
                  value={formData.relevantExperience}
                  onChange={(e) =>
                    handleInputChange("relevantExperience", e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="questions">
                  Questions for Faculty (Optional)
                </Label>
                <Textarea
                  id="questions"
                  placeholder="Any specific questions you'd like to ask about the research area, methodology, or collaboration expectations?"
                  value={formData.questions}
                  onChange={(e) =>
                    handleInputChange("questions", e.target.value)
                  }
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/faculty-browse")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-8">
              {isSubmitting ? "Submitting Request..." : "Submit Request"}
            </Button>
          </div>
        </form>

        {/* Guidelines */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Request Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Be specific about your project goals and methodology</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Demonstrate genuine interest in the faculty's research area
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Highlight relevant skills and experience</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Faculty typically respond within 2-3 business days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
