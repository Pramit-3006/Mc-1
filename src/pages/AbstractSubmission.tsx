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
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AbstractSubmission() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    methodology: "",
    expectedOutcomes: "",
  });

  const [projectInfo, setProjectInfo] = useState({
    facultyName: "Dr. Sarah Johnson",
    projectType: "RESEARCH_PAPER",
    collaborationType: "own_idea",
  });

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
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
    if (!formData.title.trim()) {
      setError("Project title is required");
      return;
    }

    if (!formData.abstract.trim() || formData.abstract.length < 100) {
      setError("Abstract must be at least 100 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would make an API call to submit the abstract
      console.log("Submitting abstract:", formData);

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit abstract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      // In production, handle file upload here
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
              Abstract Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your abstract has been submitted to {projectInfo.facultyName}.
              You'll receive feedback within 3-5 business days.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Return to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/my-projects")}
                className="w-full"
              >
                View My Projects
              </Button>
            </div>
          </CardContent>
        </Card>
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
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Submit Abstract
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Submit Your Project Abstract
              </h2>
              <p className="text-gray-600">
                Provide detailed information about your research proposal
              </p>
            </div>
          </div>

          {/* Project Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">
                    Collaborating with {projectInfo.facultyName}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Computer Science Department
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {projectInfo.projectType.replace("_", " ")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    {projectInfo.collaborationType === "own_idea"
                      ? "Your Idea"
                      : "Collaboration"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Project Title */}
          <Card>
            <CardHeader>
              <CardTitle>Project Title</CardTitle>
              <CardDescription>
                Provide a clear and descriptive title for your research project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Machine Learning Approaches for Early Disease Detection"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-lg"
                required
              />
            </CardContent>
          </Card>

          {/* Abstract */}
          <Card>
            <CardHeader>
              <CardTitle>Project Abstract</CardTitle>
              <CardDescription>
                Describe your research objectives, methodology, and expected
                outcomes (minimum 100 words)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Provide a comprehensive overview of your research project, including the problem statement, proposed methodology, expected results, and potential impact..."
                value={formData.abstract}
                onChange={(e) => handleInputChange("abstract", e.target.value)}
                className="min-h-[200px]"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {formData.abstract.length} characters (
                  {Math.max(0, 100 - formData.abstract.length)} more needed)
                </p>
                {formData.abstract.length >= 100 && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
              <CardDescription>
                Enter relevant keywords separated by commas (e.g., machine
                learning, healthcare, AI)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="machine learning, healthcare, artificial intelligence, data analysis"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card>
            <CardHeader>
              <CardTitle>Research Methodology</CardTitle>
              <CardDescription>
                Describe the approach and methods you plan to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Outline your research approach, data collection methods, analysis techniques, tools and technologies you plan to use..."
                value={formData.methodology}
                onChange={(e) =>
                  handleInputChange("methodology", e.target.value)
                }
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Expected Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Outcomes</CardTitle>
              <CardDescription>
                What do you expect to achieve with this research?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the expected results, potential applications, contributions to the field, and how this research might impact the academic community or industry..."
                value={formData.expectedOutcomes}
                onChange={(e) =>
                  handleInputChange("expectedOutcomes", e.target.value)
                }
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents (Optional)</CardTitle>
              <CardDescription>
                Upload any relevant documents, preliminary research, or
                references
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Supported formats: PDF, DOC, DOCX (max 10MB)
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" size="sm" type="button">
                    Choose Files
                  </Button>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-8">
              {isSubmitting ? "Submitting..." : "Submit Abstract"}
            </Button>
          </div>
        </form>

        {/* Guidelines */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Submission Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Abstract should be comprehensive yet concise (100-500 words)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Include clear research objectives and methodology</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Provide realistic timelines and expected outcomes</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                Faculty will review and provide feedback within 3-5 business
                days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
