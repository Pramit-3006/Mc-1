import React from "react";
import { Faculty } from "../lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, BookOpen, Users, Award, Star } from "lucide-react";

interface FacultyCardProps {
  faculty: Faculty;
  onConnect?: (facultyId: string) => void;
  onViewProfile?: (facultyId: string) => void;
  showConnectButton?: boolean;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({
  faculty,
  onConnect,
  onViewProfile,
  showConnectButton = true,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={faculty.avatar} alt={faculty.name} />
            <AvatarFallback className="text-lg">
              {getInitials(faculty.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">
              {faculty.name}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {faculty.position}
            </CardDescription>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {faculty.department}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {faculty.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {faculty.bio}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Specialization</h4>
            <div className="flex flex-wrap gap-1">
              {faculty.specialization.slice(0, 3).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {faculty.specialization.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{faculty.specialization.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {faculty.researchAreas && faculty.researchAreas.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Research Areas</h4>
              <div className="flex flex-wrap gap-1">
                {faculty.researchAreas.slice(0, 2).map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
                {faculty.researchAreas.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{faculty.researchAreas.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>{faculty.publications || 0} Publications</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{faculty.activeProjects || 0} Active Projects</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>{faculty.experience} years experience</span>
          </div>
        </div>

        {(showConnectButton || onViewProfile) && (
          <div className="flex gap-2 pt-2">
            {onViewProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(faculty.id)}
                className="flex-1"
              >
                View Profile
              </Button>
            )}
            {showConnectButton && onConnect && (
              <Button
                size="sm"
                onClick={() => onConnect(faculty.id)}
                className="flex-1"
              >
                Connect
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
