import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserNav } from "../components/UserNav";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import axios from "axios";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const res = await axios.get(`/api/users/${user.id}`);
          setUserData(res.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                MentorsConnect Dashboard
              </h1>
            </div>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {userData.role === "student" ? (
          <StudentDashboard studentData={userData} />
        ) : (
          <FacultyDashboard facultyData={userData} />
        )}
      </main>
    </div>
  );
}
