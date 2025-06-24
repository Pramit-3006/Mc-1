import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft, ArrowRight, Lightbulb, Users, FileText, CheckCircle,
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

    const fetchSelection = async () => {
      try {
        const res = await axios.get(`/api/student-project-selection/${user.id}`);
        setSelectedTypes(res.data.projectTypes || []);
        setIdeaType(res.data.ideaType || "");
        if (!res.data.projectTypes?.length) {
          navigate("/project-selection");
        }
      } catch (err) {
        navigate("/project-selection");
      }
    };

    fetchSelection();
  }, [user, navigate]);

  const handleContinue = async () => {
    if (!ideaType || !user) return;

    setIsSubmitting(true);
    try {
      await axios.post("/api/student-project-selection", {
        studentId: user.id,
        projectTypes: selectedTypes,
        ideaType,
      });

      navigate(ideaType === "own_idea" ? "/faculty-browse" : "/browse-projects");
    } catch (err) {
      console.error("Error saving selection", err);
    } finally {
      setIsSubmitting(false);
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

  const ideaOptions = [
    {
      type: "own_idea" as IdeaType,
      title: "I have my own idea",
      description: "Share your idea and find faculty to guide you.",
      icon: <Lightbulb className="h-8 w-8" />,
      nextStep: "Describe your idea and find matching faculty",
    },
    {
      type: "collaborate" as IdeaType,
      title: "I want to collaborate on existing ideas",
      description: "Join exciting faculty-led research projects.",
      icon: <Users className="h-8 w-8" />,
      nextStep: "Browse available faculty projects",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/project-selection")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Choose Your Approach</h1>
            <div />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How would you like to approach your project?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Choose whether you want to develop your own innovative idea or collaborate on existing faculty-led research.
          </p>
          <div className="flex justify-center mb-4">
            {selectedTypes.map((type) => (
              <Badge key={type} className="bg-blue-100 text-blue-800 mx-1">
                {getProjectTypeName(type)}
              </Badge>
            ))}
          </div>
        </div>

        <RadioGroup value={ideaType} onValueChange={(value) => setIdeaType(value as IdeaType)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideaOptions.map((option) => {
              const isSelected = ideaType === option.type;
              return (
                <Card
                  key={option.type}
                  onClick={() => setIdeaType(option.type)}
                  className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:ring-1 hover:ring-gray-300"}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-lg ${isSelected ? "bg-blue-600" : "bg-gradient-to-br from-indigo-500 to-purple-600"} text-white`}>
                        {option.icon}
                      </div>
                      <RadioGroupItem value={option.type} id={option.type} />
                    </div>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Next Step:</span> {option.nextStep}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </RadioGroup>

        {ideaType && (
          <Card className="my-6 bg-green-50 border-green-200">
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  You're all set to {ideaType === "own_idea" ? "present your idea" : "collaborate with faculty"}.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/project-selection")}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!ideaType || isSubmitting}>
            {isSubmitting ? "Saving..." : <>Continue <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
