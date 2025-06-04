import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Users,
  FileText,
  Lightbulb,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect with Faculty",
      description:
        "Find and collaborate with experienced faculty members in your field of interest.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Research Papers",
      description:
        "Get guidance and mentorship for writing high-quality research papers.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Project Development",
      description:
        "Work on innovative projects with faculty supervision and support.",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Patent Filing",
      description:
        "Learn the patent process and file patents for your innovative ideas.",
    },
  ];

  const benefits = [
    "First-come, first-serve matching system",
    "AI-powered faculty profile matching using LangChain",
    "Real-time collaboration tracking",
    "Comprehensive project management",
    "Abstract submission and feedback system",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  AcademicHub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/login?signup=true">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              🚀 Empowering Academic Collaboration
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect Students with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Faculty Excellence
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              AcademicHub bridges the gap between ambitious students and
              experienced faculty members, facilitating collaborative research,
              innovative projects, and patent development.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link to="/dashboard" className="flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="text-lg px-8 py-3">
                  <Link
                    to="/login?signup=true"
                    className="flex items-center gap-2"
                  >
                    Join as Student
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="text-lg px-8 py-3"
                >
                  <Link to="/login?signup=true&role=faculty">
                    Join as Faculty
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Expert Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                200+
              </div>
              <div className="text-gray-600">Successful Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Academic Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools and features to
              facilitate meaningful academic collaborations between students and
              faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose AcademicHub?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform is designed to streamline academic collaboration
                with intelligent matching, efficient workflows, and
                comprehensive project management tools.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Sign Up & Choose</h4>
                      <p className="text-sm text-gray-600">
                        Register as student or faculty and select your interests
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Browse & Connect</h4>
                      <p className="text-sm text-gray-600">
                        Find matching faculty or student collaborators
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Collaborate</h4>
                      <p className="text-sm text-gray-600">
                        Work together on projects, papers, and patents
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Academic Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and faculty already collaborating on
            AcademicHub
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-lg px-8 py-3"
              >
                <Link to="/login?signup=true">Join as Student</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <Link to="/login?signup=true&role=faculty">
                  Join as Faculty
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AcademicHub</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering academic collaboration between students and faculty
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 AcademicHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
