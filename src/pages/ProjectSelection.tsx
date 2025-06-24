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
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
      return;
    }

    fetch("/api/project-types")
      .then((res) => res.json())
      .then((data) => setProjectTypes(data))
      .catch((err) => console.error("Failed to load project types", err));
  }, [user, navigate]);

  const handleTypeToggle = (type: ProjectType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleContinue = async () => {
    if (selectedTypes.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/project-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, selectedTypes }),
      });

      if (!response.ok) throw new Error("Failed to save selection");

      navigate("/idea-selection");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">Select Project Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {projectTypes.map((type) => {
            const isSelected = selectedTypes.includes(type.code);
            return (
              <Card
                key={type.code}
                onClick={() => handleTypeToggle(type.code)}
                className={`cursor-pointer ${
                  isSelected ? "ring-2 ring-blue-500" : "hover:ring-1"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{type.name}</CardTitle>
                    <Checkbox checked={isSelected} readOnly />
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{type.skills}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={selectedTypes.length === 0 || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>}
          </Button>
        </div>
      </div>
    </div>
  );
}
