import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  BookOpen,
  FileText,
  Users,
} from "lucide-react";

export const UserNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/login?signup=true">Sign Up</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden md:flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        {user.role === "student" && (
          <Button variant="ghost" asChild>
            <Link to="/browse-faculty" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Browse Faculty
            </Link>
          </Button>
        )}

        {user.role === "faculty" && (
          <Button variant="ghost" asChild>
            <Link to="/my-projects" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Projects
            </Link>
          </Button>
        )}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                {user.role}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
