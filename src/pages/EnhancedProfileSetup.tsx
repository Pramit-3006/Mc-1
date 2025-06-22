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
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Upload, User, BookOpen, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import {
  processResumeWithLangChain,
  suggestProfileImprovements,
  calculateProfileScore,
  ResumeAnalysis,
} from "../lib/langchain";

export default function EnhancedProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [profileScore, setProfileScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: "",
    position: "",
    experience: "",
    bio: "",
    researchAreas: [] as string[],
    specialization: [] as string[],
    publications: "",
    currentProjects: "",
    phone: "",
    skills: [] as string[],
    languages: [] as string[],
    certifications: [] as string[],
  });

  const [newSpecialization, setNewSpecialization] = useState("");
  const [newResearchArea, setNewResearchArea] = useState("");
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (!user || user.role !== "faculty") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (resumeAnalysis) {
      const score = calculateProfileScore(resumeAnalysis);
      setProfileScore(score);
      setSuggestions(suggestProfileImprovements(resumeAnalysis));
    }
  }, [resumeAnalysis]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingProgress(0);
    setError("");

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // Process resume with LangChain
      const result = await processResumeWithLangChain(file);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (result.success && result.analysis) {
        setResumeAnalysis(result.analysis);

        // Auto-populate form fields from analysis
        populateFormFromAnalysis(result.analysis);

        // Show success message
        setTimeout(() => {
          setIsProcessing(false);
        }, 1000);
      } else {
        setError(result.error || "Failed to process resume");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Failed to process resume. Please try again.");
      setIsProcessing(false);
    }
  };

  const populateFormFromAnalysis = (analysis: ResumeAnalysis) => {
    setFormData((prev) => ({
      ...prev,
      name: analysis.personalInfo.name || prev.name,
      email: analysis.personalInfo.email || prev.email,
      phone: analysis.personalInfo.phone || prev.phone,
      bio: analysis.summary || prev.bio,
      publications: analysis.research.publications?.toString() || prev.publications,
      currentProjects: analysis.research.projects?.toString() || prev.currentProjects,
      researchAreas: analysis.research.areas || prev.researchAreas,
      specialization: analysis.specializations || prev.specialization,
      skills: analysis.skills || prev.skills,
      languages: analysis.languages || prev.languages,
      certifications: analysis.certifications || prev.certifications,
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specialization.includes(newSpecialization.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialization: [...prev.specialization, newSpecialization.trim()],
      }));
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index),
    }));
  };

  const addResearchArea = () => {
    if (newResearchArea.trim() && !formData.researchAreas.includes(newResearchArea.trim())) {
      setFormData((prev) => ({
        ...prev,
        researchAreas: [...prev.researchAreas, newResearchArea.trim()],
      }));
      setNewResearchArea("");
    }
  };

  const removeResearchArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      researchAreas: prev.researchAreas.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.department) {
      setError("Department is required");
      return;
    }

    if (!formData.position) {
      setError("Position is required");
      return;
    }

    if (!formData.experience) {
      setError("Years of experience is required");
      return;
    }

    if (formData.specialization.length === 0) {
      setError("At least one specialization is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        ...formData,
        resumeAnalysis,
        profileScore,
        lastUpdated: new Date().toISOString(),
      };

      console.log("Saving enhanced profile:", profileData);
      setSuccess(true);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Enhanced Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your faculty profile has been updated with AI-powered insights.
              Profile score:{" "}
              <span className="font-bold text-green-600">{profileScore}%</span>
            </p>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
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
              AI-Enhanced Profile Setup
            </h1>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">
                Powered by LangChain
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <User  className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                AI-Enhanced Faculty Profile
              </h2>
              <p className="text-gray-600">
                Upload your resume for intelligent profile completion using
                LangChain
              </p>
            </div>
          </div>

          {/* Profile Score */}
          {profileScore > 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-green-900">
                    Profile Completeness
                  </h3>
                  <span className="text-2xl font-bold text-green-600">
                    {profileScore}%
                  </span>
                </div>
                <Progress value={profileScore} className="h-2 mb-2" />
                <p className="text-sm text-green-700">
                  {profileScore >= 80
                    ? "Excellent! Your profile is comprehensive."
                    : profileScore >= 60
                      ? "Good progress! Consider adding more details."
                      : "Getting started. Upload your resume for instant improvements."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Resume Upload */}
              <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    AI-Powered Resume Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload your resume and let our LangChain AI extract and
                    populate your profile automatically
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isProcessing && !resumeAnalysis && (
                    <div className="text-center p-8">
                      <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <p className="text-lg font-medium text-blue-900 mb-2">
                        Upload Your Resume
                      </p>
                      <p className="text-sm text-blue-700 mb-4">
                        Our AI will analyze your resume and auto-fill your
                        profile
                      </p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="resume-upload"
                      />
                      <Label htmlFor="resume-upload">
                        <Button
                          variant="default"
                          size="lg"
                          type="button"
                          className="cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Resume File
                        </Button>
                      </Label>
                      <p className="text-xs text-gray-500 mt-2">
                        Supports PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-blue-900 mb-2">
                        Processing Resume with AI...
                      </p>
                      <p className="text-sm text-blue-700 mb-4">
                        Extracting information and analyzing content
                      </p>
                      <Progress
                        value={processingProgress}
                        className="w-full max-w-xs mx-auto"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {processingProgress.toFixed(0)}% complete
                      </p>
                    </div>
                  )}

                  {resumeAnalysis && uploadedFile && (
                    <div className="bg-white rounded-lg p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-medium text-green-900">
                            Resume Processed Successfully!
                          </h3>
                          <p className="text-sm text-green-700">
                            File: {uploadedFile.name}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {resumeAnalysis.skills.length}
                          </p>
                          <p className="text-xs text-green-700">
                            Skills Extracted
                          </p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {resumeAnalysis.research.areas?.length || 0}
                          </p>
                          <p className="text-xs text-blue-700">
                            Research Areas
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Analysis
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-process
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User  className="h-5 w-5" />
                    Basic Information
                    {resumeAnalysis && (
                      <Badge variant="secondary" className="ml-2">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Enhanced
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleInputChange("department", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="Electrical Engineering">
                            Electrical Engineering
                          </SelectItem>
                          <SelectItem value="Mechanical Engineering">
                            Mechanical Engineering
                          </SelectItem>
                          <SelectItem value="Biomedical Engineering">
                            Biomedical Engineering
                          </SelectItem>
                          <SelectItem value="Mathematics">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
