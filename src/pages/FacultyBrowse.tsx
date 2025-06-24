import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { FacultyCard } from "../components/FacultyCard";
import { ArrowLeft, Search, Filter, Users, Star } from "lucide-react";
import { Faculty, ProjectType } from "../lib/types";

export default function FacultyBrowse() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
      return;
    }
    // Load faculty from backend
    axios
      .get("/api/faculty")
      .then((res) => {
        setAllFaculty(res.data);
        setFilteredFaculty(res.data);
      })
      .catch(console.error);

    const types = localStorage.getItem("selectedProjectTypes");
    if (types) setSelectedTypes(JSON.parse(types));
  }, [user, navigate]);

  useEffect(() => {
    let filtered = [...allFaculty];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.specialization.some((s) => s.toLowerCase().includes(term)) ||
          f.researchAreas?.some((r) => r.toLowerCase().includes(term)) ||
          f.department.toLowerCase().includes(term)
      );
    }
    if (selectedDepartment !== "all")
      filtered = filtered.filter((f) => f.department === selectedDepartment);

    if (selectedExperience !== "all") {
      filtered = filtered.filter((f) => {
        const exp = f.experience || 0;
        if (selectedExperience === "15+") return exp >= 15;
        const [low, high] = selectedExperience.split("-").map(Number);
        return exp >= low && exp <= high;
      });
    }

    setFilteredFaculty(filtered);
  }, [searchTerm, selectedDepartment, selectedExperience, allFaculty]);

  const departments = Array.from(new Set(allFaculty.map((f) => f.department)));

  const handleConnectWithFaculty = async (facultyId: string) => {
    try {
      await axios.post("/api/project-requests", {
        studentId: user!.id,
        facultyId,
        projectType: selectedTypes[0] || "PROJECT",
        ideaType: "collaborate",
      });
      navigate("/project-request");
    } catch (err) {
      console.error("Failed to request connection", err);
    }
  };

  const getProjectTypeName = (type: ProjectType) => {
    if (type === "PROJECT") return "Project";
    if (type === "PATENT") return "Patent";
    if (type === "RESEARCH_PAPER") return "Research Paper";
    return type;
  };

  return (
    <>
      {/* Navigation, Filters and Brands */}
      <div>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1>Browse Faculty</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Faculty</CardTitle>
          <CardDescription>Filter by criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Search className="absolute-left-addon" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger><SelectValue placeholder="Department"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger><SelectValue placeholder="Experience"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0-5">0–5 yrs</SelectItem>
                <SelectItem value="6-10">6–10 yrs</SelectItem>
                <SelectItem value="11-15">11–15 yrs</SelectItem>
                <SelectItem value="15+">15+ yrs</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("all");
              setSelectedExperience("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-gray-600 mb-4">
        Showing {filteredFaculty.length} of {allFaculty.length}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filteredFaculty.length === 0 && (
          <div className="flex flex-col items-center">
            <Users className="h-12 w-12 text-gray-400" />
            <div className="font-medium mb-4">No faculty found</div>
            <Button onClick={() => setFilteredFaculty(allFaculty)}>
              Clear Filters
            </Button>
          </div>
        )}
        {filteredFaculty.map((faculty) => (
          <FacultyCard
            key={faculty.id}
            faculty={faculty}
            showConnectButton={true}
            onConnect={() => handleConnectWithFaculty(faculty.id)}
            onViewProfile={() => navigate(`/faculty-profile/${faculty.id}`)}
          />
        ))}
      </div>
    </>
  );
}
