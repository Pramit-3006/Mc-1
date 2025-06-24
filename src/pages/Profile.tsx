import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
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

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [profileCompleteness, setProfileCompleteness] = useState(75);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${user.id}`);
        const data = await res.json();
        setProfileData(data.profile);
        setUserProjects(data.projects);
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Unknown";
    try {
      const dateObj = new Date(date);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return "Unknown";
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
              <Link to={isFaculty ? "/enhanced-profile" : "/settings"}>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Profile Data Rendering */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(user?.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.name || "Unknown"}
                </h1>
                {isFaculty ? (
                  <>
                    <p className="text-xl text-gray-600 mb-2">
                      {profileData?.position || "Faculty Member"}
                    </p>
                    <div className="flex items-center gap-3 text-gray-600 mb-2">
                      <Building className="h-4 w-4" />
                      {profileData?.department}
                      <GraduationCap className="h-4 w-4" />
                      {profileData?.experience || 0} yrs
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(profileData?.specialization || []).map((s: string) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xl text-gray-600 mb-2">Student</p>
                    <div className="flex items-center gap-3 text-gray-600 mb-2">
                      <Building className="h-4 w-4" />
                      {profileData?.department}
                      <GraduationCap className="h-4 w-4" />
                      {profileData?.year}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(profileData?.interests || []).map((i: string) => (
                        <Badge key={i}>{i}</Badge>
                      ))}
                    </div>
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{isFaculty ? "My Projects" : "My Collaborations"}</CardTitle>
            <CardDescription>
              {isFaculty ? "Projects I'm offering" : "Projects I'm part of"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProjects.length > 0 ? (
              <ul className="space-y-4">
                {userProjects.map((project, index) => (
                  <li key={index} className="border p-4 rounded-lg">
                    <h4 className="text-lg font-semibold">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
