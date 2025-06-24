import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
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

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      await axios.post("/api/student/abstracts", {
        studentId: user!.id,
        ...formData,
      });
      setSubmitted(true);
    } catch {
      setError("Failed to submit abstract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Abstract Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thanks for your submission. You will be notified soon.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="w-full mb-2">
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate("/my-projects")} className="w-full">
            View My Submissions
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* form content same as before, but onSubmit triggers real data call */}
      {/* ... keep form JSX here ... */}
    </div>
  );
}
