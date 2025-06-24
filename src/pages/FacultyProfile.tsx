import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { ProjectCard } from "../components/ProjectCard";
import {
  ArrowLeft, MapPin, Mail, Phone, Globe, Award, BookOpen,
  Users, Star, MessageSquare, Send, Building, GraduationCap
} from "lucide-react";
import { Faculty, ProjectIdea } from "../lib/types";

export default function FacultyProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [facultyProjects, setFacultyProjects] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return navigate("/faculty-browse");

    Promise.all([
      axios.get(`/api/faculty/${id}`),
      axios.get(`/api/faculty/${id}/projects`)
    ]).then(([resF, resP]) => {
      setFaculty(resF.data);
      setFacultyProjects(resP.data);
    }).catch(() => {
      navigate("/faculty-browse");
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleConnectWithFaculty = async () => {
    if (!faculty || !user) return;
    await axios.post("/api/project-requests", {
      studentId: user.id,
      facultyId: faculty.id,
      projectType: "collaborate",
      ideaType: "collaborate",
    });
    navigate("/project-request");
  };

  const handleMessageFaculty = () => {
    // Add chat functionality later
  };

  const getInitials = (name: string) =>
    name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!faculty) {
    return (
      <Card><CardContent>Faculty not found. <Button onClick={() => navigate("/faculty-browse")}>Back</Button></CardContent></Card>
    );
  }

  return (
    <div>
      <nav>
        <Button variant="ghost" onClick={() => navigate("/faculty-browse")}>
          <ArrowLeft /> Browse
        </Button>
      </nav>

      <Card>
        <CardContent>
          <Avatar><AvatarFallback>{getInitials(faculty.name)}</AvatarFallback></Avatar>
          <h1>{faculty.name}</h1>
          <p>{faculty.position}, {faculty.department}</p>
          <div>
            {faculty.specialization.map((s, i) => <Badge key={i}>{s}</Badge>)}
          </div>
          {user?.role === "student" && (
            <>
              <Button onClick={handleConnectWithFaculty}><Send /> Request</Button>
              <Button variant="outline" onClick={handleMessageFaculty}><MessageSquare /> Message</Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Opportunities</CardTitle></CardHeader>
        <CardContent>
          {facultyProjects.length === 0 ? "No available projects" :
            facultyProjects.map(p =>
              <ProjectCard key={p.id} project={p}
                onApply={() => handleConnectWithFaculty()}
              />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
