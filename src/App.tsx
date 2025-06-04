import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectSelection from "./pages/ProjectSelection";
import IdeaSelection from "./pages/IdeaSelection";
import FacultyBrowse from "./pages/FacultyBrowse";
import MyProjects from "./pages/MyProjects";
import MyAbstracts from "./pages/MyAbstracts";
import AbstractSubmission from "./pages/AbstractSubmission";
import ProfileSetup from "./pages/ProfileSetup";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project-selection" element={<ProjectSelection />} />
            <Route path="/idea-selection" element={<IdeaSelection />} />
            <Route path="/faculty-browse" element={<FacultyBrowse />} />
            <Route path="/browse-faculty" element={<FacultyBrowse />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/my-abstracts" element={<MyAbstracts />} />
            <Route
              path="/abstract-submission"
              element={<AbstractSubmission />}
            />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
