import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Progress } from "../components/ui/progress";
import { ProjectCard } from "../components/ProjectCard";
import {
  ArrowLeft,
  User,
  Edit,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Award,
  BookOpen,
  Users,
  Star,
  Building,
  GraduationCap,
  FileText,
  Settings,
  Zap,
} from "lucide-react";
import { getFacultyById, getAllFaculty } from "../lib/auth";
import { Faculty, Student, ProjectIdea, ProjectRequest } from "../lib/types";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<Faculty | Student | null>(
    null,
  );
  const [userProjects, setUserProjects] = useState<
    ProjectIdea[] | ProjectRequest[]
  >([]);
  const [profileCompleteness, setProfileCompleteness] = useState(75);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load user profile data
    if (user.role === 'faculty') {
      const facultyData = getFacultyById(user.id);
      if (facultyData) {
        setProfileData(facultyData);
      } else {
        // If no faculty data found, use basic user data
        setProfileData(user as Faculty);
      }

      // Mock faculty projects
      setUserProjects([
        {
          id: '1',
          title: 'AI-Powered Healthcare Diagnosis System',
          description: 'Develop a machine learning system to assist doctors in early disease detection using medical imaging and patient data.',
          type: 'PROJECT',
          facultyId: user.id,
          requiredSkills: ['Python', 'TensorFlow', 'Computer Vision', 'Medical Imaging'],
          duration: '6 months',
          difficulty: 'advanced',
          maxStudents: 3,
          currentStudents: 2,
          createdAt: new Date('2024-01-20T00:00:00Z'),
        } as ProjectIdea
      ]);
    } else {
      // Student profile
      setProfileData(user as Student);

      // Mock student projects
      setUserProjects([
        {
          id: '1',
          studentId: user.id,
          facultyId: '2',
          projectType: 'RESEARCH_PAPER',
          ideaType: 'own_idea',
          title: 'Natural Language Processing in Healthcare',
          description: 'Research on improving patient-doctor communication through AI-powered language understanding.',
          status: 'accepted',
          createdAt: new Date('2024-01-15T00:00:00Z'),
        } as ProjectRequest
      ]);
    }
            "Medical Imaging",
          ],
          duration: "6 months",
          difficulty: "advanced",
          maxStudents: 3,
          currentStudents: 2,
          createdAt: new Date("2024-01-20"),
        } as ProjectIdea,
      ]);
    } else {
      // Student profile
      setProfileData(user as Student);

      // Mock student projects
      setUserProjects([
        {
          id: "1",
          studentId: user.id,
          facultyId: "2",
          projectType: "RESEARCH_PAPER",
          ideaType: "own_idea",
          title: "Natural Language Processing in Healthcare",
          description:
            "Research on improving patient-doctor communication through AI-powered language understanding.",
          status: "accepted",
          createdAt: new Date("2024-01-15"),
        } as ProjectRequest,
      ]);
    }
  }, [user, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) {
      return 'Unknown';
    }

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Unknown';
      }

      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Unknown';
    }
  };

  if (!user || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isFaculty = user.role === "faculty";
  const facultyData = isFaculty ? (profileData as Faculty) : null;
  const studentData = !isFaculty ? (profileData as Student) : null;

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
            <h1 className="text-lg font-semibold text-gray-900">My Profile</h1>
            <Button asChild>
              <Link
                to={isFaculty ? "/enhanced-profile" : "/settings"}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
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
                    <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user?.name || 'Unknown User')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user?.name || 'Unknown User'}
                    </h1>

                    {isFaculty ? (
                      <>
                        <p className="text-xl text-gray-600 mb-3">
                          {facultyData?.position}
                        </p>
                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {facultyData?.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {facultyData?.experience} years experience
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {facultyData?.specialization.map((spec, index) => (
                            <Badge key={index} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xl text-gray-600 mb-3">Student</p>
                        <div className="flex items-center gap-4 text-gray-600 mb-4">
                          {studentData?.department && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {studentData.department}
                            </div>
                          )}
                          {studentData?.year && (
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              {studentData.year}
                            </div>
                          )}
                        </div>

                        {studentData?.interests && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {studentData.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Member since {formatDate(user?.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            {(facultyData?.bio || studentData) && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isFaculty ? (
                    <p className="text-gray-700 leading-relaxed">
                      {facultyData?.bio ||
                        "No bio available. Update your profile to add a professional bio."}
                    </p>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      I'm a {studentData?.year || ""} student in{" "}
                      {studentData?.department || "the university"}, passionate
                      about research and innovation. Looking for opportunities
                      to collaborate with faculty members on exciting projects.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Research Areas (Faculty only) */}
            {isFaculty &&
              facultyData?.researchAreas &&
              facultyData.researchAreas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Research Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {facultyData.researchAreas.map((area, index) => (
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

            {/* Projects/Collaborations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {isFaculty ? "My Projects" : "My Collaborations"}
                </CardTitle>
                <CardDescription>
                  {isFaculty
                    ? "Research projects and opportunities I'm offering"
                    : "Current and past project collaborations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {isFaculty
                        ? "No projects posted yet"
                        : "No collaborations yet"}
                    </p>
                    <Button asChild>
                      <Link
                        to={isFaculty ? "/my-projects" : "/project-selection"}
                      >
                        {isFaculty ? "Create Project" : "Find Opportunities"}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProjects.slice(0, 2).map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        {isFaculty ? (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {(project as ProjectIdea).title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {(project as ProjectIdea).description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">
                                {(project as ProjectIdea).type.replace(
                                  "_",
                                  " ",
                                )}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {(project as ProjectIdea).currentStudents}/
                                {(project as ProjectIdea).maxStudents} students
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {(project as ProjectRequest).title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {(project as ProjectRequest).description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">
                                {(
                                  project as ProjectRequest
                                ).projectType.replace("_", " ")}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                {(project as ProjectRequest).status}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link to={isFaculty ? "/my-projects" : "/my-abstracts"}>
                          View All {isFaculty ? "Projects" : "Collaborations"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {profileCompleteness >= 80
                      ? "Your profile looks great!"
                      : "Complete your profile to attract more collaborations"}
                  </p>
                </div>

                {profileCompleteness < 100 && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link to={isFaculty ? "/enhanced-profile" : "/settings"}>
                        <Edit className="h-4 w-4 mr-2" />
                        Complete Profile
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{user?.email || 'No email provided'}</span>
                </div>

                {isFaculty && (
                  <>
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
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Personal Website
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Academic Stats (Faculty) */}
            {isFaculty && (
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
                      {facultyData?.publications || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Active Projects
                    </span>
                    <span className="font-medium">
                      {facultyData?.activeProjects || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Years Teaching
                    </span>
                    <span className="font-medium">
                      {facultyData?.experience}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Student Rating
                    </span>
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
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isFaculty ? (
                  <>
                    <Button asChild className="w-full justify-start">
                      <Link
                        to="/enhanced-profile"
                        className="flex items-center gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        AI-Enhanced Profile
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link
                        to="/my-projects"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Manage Projects
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full justify-start">
                      <Link
                        to="/project-selection"
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        Find Opportunities
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link
                        to="/faculty-browse"
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Browse Faculty
                      </Link>
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start"
                >
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}