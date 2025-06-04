import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Separator } from "../components/ui/separator";
import { ProjectCard } from "../components/ProjectCard";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  BookOpen,
  Users,
  Star,
  MessageSquare,
  Send,
  Calendar,
  Building,
  GraduationCap,
} from "lucide-react";
import { getFacultyById } from "../lib/auth";
import { Faculty, ProjectIdea } from "../lib/types";

export default function FacultyProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock faculty projects - in production this would come from your backend
  const [facultyProjects] = useState<ProjectIdea[]>([
    {
      id: "1",
      title: "AI-Powered Healthcare Diagnosis System",
      description:
        "Develop a machine learning system to assist doctors in early disease detection using medical imaging and patient data.",
      type: "PROJECT",
      facultyId: id || "",
      requiredSkills: [
        "Python",
        "TensorFlow",
        "Computer Vision",
        "Medical Imaging",
      ],
      duration: "6 months",
      difficulty: "advanced",
      maxStudents: 3,
      currentStudents: 2,
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      title: "Natural Language Processing for Healthcare",
      description:
        "Research on improving patient-doctor communication through AI-powered language understanding and medical text analysis.",
      type: "RESEARCH_PAPER",
      facultyId: id || "",
      requiredSkills: [
        "NLP",
        "Python",
        "Healthcare Informatics",
        "Machine Learning",
      ],
      duration: "8 months",
      difficulty: "advanced",
      maxStudents: 2,
      currentStudents: 1,
      createdAt: new Date("2024-01-15"),
    },
  ]);

  useEffect(() => {
    if (!id) {
      navigate("/faculty-browse");
      return;
    }

    // Get faculty information
    const facultyData = getFacultyById(id);
    if (facultyData) {
      setFaculty(facultyData);
    } else {
      navigate("/faculty-browse");
    }
    setLoading(false);
  }, [id, navigate]);

  const handleConnectWithFaculty = () => {
    if (!faculty) return;

    // Store the selected faculty for the request
    localStorage.setItem("selectedFacultyId", faculty.id);
    navigate("/project-request");
  };

  const handleMessageFaculty = () => {
    // In production, this would open a messaging interface
    console.log("Opening message dialog with faculty:", faculty?.id);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading faculty profile...</p>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Faculty Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The faculty profile you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => navigate("/faculty-browse")}>
              Browse Faculty
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
              onClick={() => navigate("/faculty-browse")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Faculty Browse
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              Faculty Profile
            </h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={faculty.avatar} alt={faculty.name} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(faculty.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {faculty.name}
                    </h1>
                    <p className="text-xl text-gray-600 mb-3">
                      {faculty.position}
                    </p>

                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {faculty.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {faculty.experience} years experience
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {faculty.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {user?.role === "student" && (
                        <>
                          <Button
                            onClick={handleConnectWithFaculty}
                            className="flex items-center gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Request Collaboration
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleMessageFaculty}
                            className="flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            {faculty.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{faculty.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Research Areas */}
            {faculty.researchAreas && faculty.researchAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Research Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {faculty.researchAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Opportunities
                </CardTitle>
                <CardDescription>
                  Current research projects looking for student collaborators
                </CardDescription>
              </CardHeader>
              <CardContent>
                {facultyProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No current opportunities available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {facultyProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onApply={(id) => {
                          localStorage.setItem("selectedProjectId", id);
                          handleConnectWithFaculty();
                        }}
                        onViewDetails={(id) =>
                          console.log("View project details:", id)
                        }
                        showApplyButton={user?.role === "student"}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{faculty.email}</span>
                </div>

                {/* Mock contact details - in production these would come from faculty data */}
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">
                    Office: Engineering Bldg, Room 401
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Personal Website
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Academic Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Academic Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Publications</span>
                  <span className="font-medium">
                    {faculty.publications || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="font-medium">
                    {faculty.activeProjects || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Years Teaching</span>
                  <span className="font-medium">{faculty.experience}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Student Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-medium text-green-600">95%</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">
                      Published new research paper
                    </p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">
                      Started new project opportunity
                    </p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">
                      Accepted 2 new student collaborators
                    </p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {user?.role === "student" && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={handleConnectWithFaculty}
                    className="w-full justify-start"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Collaboration Request
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleMessageFaculty}
                    className="w-full justify-start"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link to="/faculty-browse">
                      <Users className="h-4 w-4 mr-2" />
                      Browse More Faculty
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
