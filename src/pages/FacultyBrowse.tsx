import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAllFaculty } from "../lib/auth";
import { Faculty, ProjectType } from "../lib/types";

export default function FacultyBrowse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allFaculty] = useState<Faculty[]>(getAllFaculty());
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>(allFaculty);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/dashboard");
      return;
    }

    // Get selected types from previous steps
    const storedTypes = localStorage.getItem("selectedProjectTypes");
    if (storedTypes) {
      setSelectedTypes(JSON.parse(storedTypes));
    }
  }, [user, navigate]);

  useEffect(() => {
    let filtered = allFaculty;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faculty.specialization.some((spec) =>
            spec.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          faculty.researchAreas?.some((area) =>
            area.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          faculty.department.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (faculty) => faculty.department === selectedDepartment,
      );
    }

    // Filter by experience
    if (selectedExperience !== "all") {
      const expRange = selectedExperience.split("-").map(Number);
      filtered = filtered.filter((faculty) => {
        if (expRange.length === 2) {
          return (
            faculty.experience >= expRange[0] &&
            faculty.experience <= expRange[1]
          );
        } else if (selectedExperience === "15+") {
          return faculty.experience >= 15;
        }
        return true;
      });
    }

    setFilteredFaculty(filtered);
  }, [searchTerm, selectedDepartment, selectedExperience, allFaculty]);

  const departments = [...new Set(allFaculty.map((f) => f.department))];

  const handleConnectWithFaculty = (facultyId: string) => {
    // Store the selected faculty for the request
    localStorage.setItem("selectedFacultyId", facultyId);
    navigate("/project-request");
  };

  const handleViewProfile = (facultyId: string) => {
    navigate(`/faculty-profile/${facultyId}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedExperience("all");
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
              Browse Faculty
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Find Your Perfect Faculty Mentor
              </h2>
              <p className="text-gray-600">
                Connect with faculty members who can guide your research journey
              </p>
            </div>
          </div>

          {/* Selected Types Display */}
          {selectedTypes.length > 0 && (
            <Card className="bg-blue-50 border-blue-200 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Looking for guidance in:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {getProjectTypeName(type)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Faculty
            </CardTitle>
            <CardDescription>
              Find faculty members that match your specific needs and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Department Filter */}
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Experience Filter */}
              <Select
                value={selectedExperience}
                onValueChange={setSelectedExperience}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="0-5">0-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="15+">15+ years</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredFaculty.length} of {allFaculty.length} faculty
            members
          </p>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="experience">
                Experience (High to Low)
              </SelectItem>
              <SelectItem value="publications">
                Publications (High to Low)
              </SelectItem>
              <SelectItem value="projects">Active Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No faculty found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more
                  results.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                onConnect={handleConnectWithFaculty}
                onViewProfile={handleViewProfile}
                showConnectButton={true}
              />
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              Tips for Connecting with Faculty
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">Be Specific</h4>
                <p>
                  Clearly describe your project idea and how it aligns with
                  their research.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Show Initiative</h4>
                <p>
                  Demonstrate that you've researched their work and understand
                  their expertise.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Be Professional</h4>
                <p>
                  Write a compelling project proposal that highlights your
                  commitment.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Follow Up</h4>
                <p>
                  Be patient but persistent. Faculty receive many requests
                  daily.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
