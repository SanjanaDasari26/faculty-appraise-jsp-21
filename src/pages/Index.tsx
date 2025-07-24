import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Faculty Appraisal System</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/register")}>
              Register
            </Button>
            <Button onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Digital Faculty Self-Appraisal
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Streamline faculty evaluation with our comprehensive digital platform. 
            Track research, seminars, events, lectures, and projects all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/register")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Comprehensive Tracking</CardTitle>
              <CardDescription>
                Manage all your academic activities including publications, seminars, events, lectures, and projects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <CardTitle>Faculty Dashboard</CardTitle>
              <CardDescription>
                Intuitive interface for faculty members to update and maintain their academic records
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Admin Oversight</CardTitle>
              <CardDescription>
                Administrative dashboard to monitor all faculty reports and generate institutional insights
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join faculty members already using our platform to streamline their appraisal process
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate("/register")}>
              Create Your Account
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2024 Faculty Appraisal System. Built with modern web technologies.</p>
      </footer>
    </div>
  );
};

export default Index;
