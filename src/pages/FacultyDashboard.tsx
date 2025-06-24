import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  BookOpen,
  Users,
  FileText,
  Plus,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
} from "lucide-react";
import { ProjectRequest, ProjectIdea, Student } from "../lib/types";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const facultyId = user?.id;

  const [pendingRequests, setPendingRequests] = useState<ProjectRequest[]>([]);
  const [myProjects, setMyProjects] = useState<ProjectIdea[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<ProjectRequest[]>([]);

  useEffect(() => {
    if (!facultyId) return;
    axios.get(`/api/faculty/${facultyId}/requests`).then(res =>
      setPendingRequests(res.data)
    );
    axios.get(`/api/faculty/${facultyId}/projects`).then(res =>
      setMyProjects(res.data)
    );
    axios.get(`/api/faculty/${facultyId}/active-collaborations`).then(res =>
      setActiveCollaborations(res.data)
    );
  }, [facultyId]);

  const handleAcceptRequest = (requestId: string) => {
    axios.post(`/api/faculty/requests/${requestId}/accept`).then(() =>
      setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    );
  };

  const handleRejectRequest = (requestId: string) => {
    axios.post(`/api/faculty/requests/${requestId}/reject`).then(() =>
      setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    );
  };

  const getInitials = (name: string) => name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const stats = [
    { title: "Pending Requests", value: pendingRequests.length, icon: <Clock className="h-4 w-4" />, color: "text-yellow-600" },
    { title: "Active Projects", value: activeCollaborations.length, icon: <BookOpen className="h-4 w-4" />, color: "text-blue-600" },
    { title: "Posted Opportunities", value: myProjects.length, icon: <FileText className="h-4 w-4" />, color: "text-green-600" },
    { title: "Total Students", value: myProjects.reduce((acc, p) => acc + p.currentStudents, 0), icon: <Users className="h-4 w-4" />, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* header, stats, content... */}
      {/* Replace your JSX with the implementation you already have */}
    </div>
  );
}
