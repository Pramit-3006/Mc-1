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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  Upload,
  User,
  BookOpen,
  Award,
  Plus,
  X,
  CheckCircle,
} from "lucide-react";

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    department: "",
    position: "",
    experience: "",
    bio: "",
    researchAreas: [] as string[],
    specialization: [] as string[],
    publications: "",
    currentProjects: "",
    office: "",
    phone: "",
    website: "",
  });

  const [newSpecialization, setNewSpecialization] = useState("");
  const [newResearchArea, setNewResearchArea] = useState("");

  useEffect(() => {
    if (!user || user.role !== "faculty") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biomedical Engineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Business Administration",
    "Economics",
    "Psychology",
    "Other",
  ];

  const positions = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Distinguished Professor",
    "Lecturer",
    "Senior Lecturer",
    "Research Fellow",
    "Principal Investigator",
    "Department Head",
    "Dean",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const addSpecialization = () => {
    if (
      newSpecialization.trim() &&
      !formData.specialization.includes(newSpecialization.trim())
    ) {
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
    if (
      newResearchArea.trim() &&
      !formData.researchAreas.includes(newResearchArea.trim())
    ) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
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
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would make an API call to save the profile
      console.log("Saving profile:", formData);

      setSuccess(true);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Resume uploaded:", file.name);
      // In production, handle resume upload and processing with LangChain
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
              Profile Updated Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your faculty profile has been saved. Students can now discover and
              connect with you.
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
              Faculty Profile Setup
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Complete Your Faculty Profile
              </h2>
              <p className="text-gray-600">
                Help students find and connect with you for research
                opportunities
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide your basic academic and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
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
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) =>
                      handleInputChange("position", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="office">Office Location</Label>
                  <Input
                    id="office"
                    placeholder="e.g., Building A, Room 301"
                    value={formData.office}
                    onChange={(e) =>
                      handleInputChange("office", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Personal Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-website.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a brief bio that describes your research interests, background, and what you're looking for in student collaborators..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Academic Information
              </CardTitle>
              <CardDescription>
                Details about your research and academic achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Specializations */}
              <div>
                <Label>Areas of Specialization</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add specialization (e.g., Machine Learning)"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addSpecialization())
                    }
                  />
                  <Button type="button" onClick={addSpecialization} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialization.map((spec, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialization(index)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Research Areas */}
              <div>
                <Label>Research Areas</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add research area (e.g., Healthcare AI)"
                    value={newResearchArea}
                    onChange={(e) => setNewResearchArea(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addResearchArea())
                    }
                  />
                  <Button type="button" onClick={addResearchArea} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.researchAreas.map((area, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removeResearchArea(index)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publications">Number of Publications</Label>
                  <Input
                    id="publications"
                    type="number"
                    min="0"
                    value={formData.publications}
                    onChange={(e) =>
                      handleInputChange("publications", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="currentProjects">
                    Current Active Projects
                  </Label>
                  <Input
                    id="currentProjects"
                    type="number"
                    min="0"
                    value={formData.currentProjects}
                    onChange={(e) =>
                      handleInputChange("currentProjects", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Resume Upload
              </CardTitle>
              <CardDescription>
                Upload your resume for AI-powered profile enhancement using
                LangChain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload your resume to auto-populate profile details
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Supported formats: PDF, DOC, DOCX (max 5MB)
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                />
                <Label htmlFor="resume-upload">
                  <Button variant="outline" size="sm" type="button">
                    Choose Resume File
                  </Button>
                </Label>
              </div>
              <Alert className="mt-4">
                <AlertDescription>
                  Our AI system will process your resume to enhance your profile
                  with relevant details, making it easier for students to find
                  and connect with you.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-8">
              {isSubmitting ? "Saving Profile..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
