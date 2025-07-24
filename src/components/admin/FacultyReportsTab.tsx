import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFacultyReport, downloadPDF } from "@/lib/pdfGenerator";

const FacultyReportsTab = () => {
  const [facultyReports, setFacultyReports] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFacultyReports();
  }, []);

  const loadFacultyReports = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const faculty = users.filter((user: any) => user.userType === "faculty");
    
    const reports = faculty.map((member) => {
      const publications = JSON.parse(localStorage.getItem(`publications_${member.id}`) || "[]");
      const seminars = JSON.parse(localStorage.getItem(`seminars_${member.id}`) || "[]");
      const events = JSON.parse(localStorage.getItem(`events_${member.id}`) || "[]");
      const lectures = JSON.parse(localStorage.getItem(`lectures_${member.id}`) || "[]");
      const projects = JSON.parse(localStorage.getItem(`projects_${member.id}`) || "[]");
      
      return {
        ...member,
        stats: {
          publications: publications.length,
          seminars: seminars.length,
          events: events.length,
          lectures: lectures.length,
          projects: projects.length,
        }
      };
    });
    
    setFacultyReports(reports);
  };

  const handleDownloadReport = (facultyId: string, facultyName: string) => {
    const faculty = facultyReports.find(f => f.id === facultyId);
    if (!faculty) return;
    
    const pdf = generateFacultyReport(faculty, faculty.stats);
    downloadPDF(pdf, `${facultyName}_Faculty_Report.pdf`);
    
    toast({
      title: "Download Complete",
      description: `Report for ${facultyName} has been downloaded`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Faculty Reports Overview</h3>
      </div>
      
      {facultyReports.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No faculty reports available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {facultyReports.map((faculty) => (
            <Card key={faculty.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span>{faculty.name}</span>
                    <p className="text-sm text-muted-foreground font-normal">
                      {faculty.department} | {faculty.designation || "Faculty"}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownloadReport(faculty.id, faculty.name)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Publications: {faculty.stats.publications}
                  </Badge>
                  <Badge variant="outline">
                    Seminars: {faculty.stats.seminars}
                  </Badge>
                  <Badge variant="outline">
                    Events: {faculty.stats.events}
                  </Badge>
                  <Badge variant="outline">
                    Lectures: {faculty.stats.lectures}
                  </Badge>
                  <Badge variant="outline">
                    Projects: {faculty.stats.projects}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyReportsTab;