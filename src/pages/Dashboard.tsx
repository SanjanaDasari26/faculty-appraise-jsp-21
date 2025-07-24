import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PublicationsTab from "@/components/faculty/PublicationsTab";
import SeminarsTab from "@/components/faculty/SeminarsTab";
import EventsTab from "@/components/faculty/EventsTab";
import LecturesTab from "@/components/faculty/LecturesTab";
import ProjectsTab from "@/components/faculty/ProjectsTab";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.userType !== "faculty") {
      navigate("/login");
      return;
    }
    
    setCurrentUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report is being generated...",
    });
    // PDF generation would be implemented here
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Faculty Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {currentUser.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Faculty Self-Appraisal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="publications" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="seminars">Seminars</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="lectures">Lectures</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="publications">
                <PublicationsTab />
              </TabsContent>
              
              <TabsContent value="seminars">
                <SeminarsTab />
              </TabsContent>
              
              <TabsContent value="events">
                <EventsTab />
              </TabsContent>
              
              <TabsContent value="lectures">
                <LecturesTab />
              </TabsContent>
              
              <TabsContent value="projects">
                <ProjectsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;