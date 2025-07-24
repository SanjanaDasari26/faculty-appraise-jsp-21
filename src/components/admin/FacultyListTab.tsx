import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";

const FacultyListTab = () => {
  const [facultyList, setFacultyList] = useState<any[]>([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const faculty = users.filter((user: any) => user.userType === "faculty");
    setFacultyList(faculty);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Registered Faculty ({facultyList.length})</h3>
      </div>
      
      {facultyList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No faculty members registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {facultyList.map((faculty) => (
            <Card key={faculty.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{faculty.name}</span>
                  <Badge variant="secondary">{faculty.designation || "Faculty"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{faculty.email}</span>
                  </div>
                  {faculty.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{faculty.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Department: </span>
                    <span>{faculty.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Joined: </span>
                    <span>{new Date(faculty.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyListTab;