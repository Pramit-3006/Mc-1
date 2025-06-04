import React from "react";
import { ProjectIdea } from "../lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";

interface ProjectCardProps {
  project: ProjectIdea;
  onApply?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
  showApplyButton?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onApply,
  onViewDetails,
  showApplyButton = true,
}) => {
  const progressPercentage =
    (project.currentStudents / project.maxStudents) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PROJECT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PATENT":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "RESEARCH_PAPER":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight line-clamp-2">
              {project.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {project.faculty?.name} • {project.faculty?.department}
            </CardDescription>
          </div>

          <div className="flex flex-col gap-1">
            <Badge
              variant="outline"
              className={`text-xs ${getTypeColor(project.type)}`}
            >
              {project.type.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${getDifficultyColor(project.difficulty)}`}
            >
              {project.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {project.requiredSkills && project.requiredSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-1">
              {project.requiredSkills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.requiredSkills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.requiredSkills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Team Progress</span>
            <span className="font-medium">
              {project.currentStudents}/{project.maxStudents} students
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Posted {formatDate(project.createdAt)}</span>
          </div>

          {project.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{project.duration}</span>
            </div>
          )}
        </div>

        {(showApplyButton || onViewDetails) && (
          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(project.id)}
                className="flex-1"
              >
                View Details
              </Button>
            )}
            {showApplyButton &&
              onApply &&
              project.currentStudents < project.maxStudents && (
                <Button
                  size="sm"
                  onClick={() => onApply(project.id)}
                  className="flex-1"
                >
                  Apply
                </Button>
              )}
            {project.currentStudents >= project.maxStudents && (
              <Button size="sm" disabled className="flex-1">
                Team Full
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
