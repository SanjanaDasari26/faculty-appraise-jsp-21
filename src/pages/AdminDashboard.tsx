import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAllFacultyReports, downloadPDF } from "@/lib/pdfGenerator";
import FacultyReportsTab from "@/components/admin/FacultyReportsTab";
import FacultyListTab from "@/components/admin/FacultyListTab";

const AdminDashboard = () => {
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
    if (userData.userType !== "admin") {
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

  const handleDownloadAllReports = () => {
    const pdf = generateAllFacultyReports();
    downloadPDF(pdf, `All_Faculty_Reports_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Download Complete",
      description: "All faculty reports have been generated and downloaded",
    });
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
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Faculty Appraisal Management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadAllReports}>
              <Download className="w-4 h-4 mr-2" />
              Download All Reports
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
              <Users className="w-5 h-5" />
              Faculty Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="faculty-list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faculty-list">Faculty List</TabsTrigger>
                <TabsTrigger value="reports">All Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="faculty-list">
                <FacultyListTab />
              </TabsContent>
              
              <TabsContent value="reports">
                <FacultyReportsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;