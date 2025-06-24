import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { GraduationCap, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser, loading, setLoading } = useAuth(); // assuming context
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "faculty",
  });

  const isSignupParam = searchParams.get("signup") === "true";
  const roleParam = searchParams.get("role") as "student" | "faculty";
  const [activeTab, setActiveTab] = useState(isSignupParam ? "signup" : "login");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    if (roleParam) setSignupData(ds => ({ ...ds, role: roleParam }));
  }, [roleParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsProcessing(true);

    try {
      const res = await axios.post("/api/auth/login", loginData);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (signupData.password !== signupData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsProcessing(true);
    try {
      const send = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role,
      };
      const res = await axios.post("/api/auth/signup", send);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen ...">
        {/* loading spinner */}
      </div>
    );
  }

  return (
    <div className="min-h-screen ...">
      <div className="max-w-md mx-auto">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {activeTab === "login" ? "Welcome Back" : "Join MentorsConnect"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  {/* email and password */}
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  {/* name, email, password, confirm, role radio */}
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm ...">
              <Link to="/">← Back to home</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
