import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  fundingAgency: string;
  amount: string;
  role: string;
  collaborators?: string;
  description?: string;
}

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    fundingAgency: "",
    amount: "",
    role: "",
    collaborators: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const saved = localStorage.getItem(`projects_${user.id}`);
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  };

  const saveProjects = (newProjects: Project[]) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem(`projects_${user.id}`, JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.status || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newProject: Project = {
      id: isEditing || Date.now().toString(),
      ...formData,
    };

    let updatedProjects;
    if (isEditing) {
      updatedProjects = projects.map(proj => 
        proj.id === isEditing ? newProject : proj
      );
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully",
      });
    } else {
      updatedProjects = [...projects, newProject];
      toast({
        title: "Project Added",
        description: "Your project has been added successfully",
      });
    }

    saveProjects(updatedProjects);
    resetForm();
  };

  const handleEdit = (proj: Project) => {
    setFormData({ ...proj, collaborators: proj.collaborators || "", description: proj.description || "" });
    setIsEditing(proj.id);
  };

  const handleDelete = (id: string) => {
    const updatedProjects = projects.filter(proj => proj.id !== id);
    saveProjects(updatedProjects);
    toast({
      title: "Project Deleted",
      description: "The project has been removed",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      status: "",
      startDate: "",
      endDate: "",
      fundingAgency: "",
      amount: "",
      role: "",
      collaborators: "",
      description: "",
    });
    setIsEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            {isEditing ? "Edit Project" : "Add New Project"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Project Type *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Project</SelectItem>
                    <SelectItem value="development">Development Project</SelectItem>
                    <SelectItem value="consultancy">Consultancy</SelectItem>
                    <SelectItem value="industry">Industry Collaboration</SelectItem>
                    <SelectItem value="government">Government Project</SelectItem>
                    <SelectItem value="international">International Project</SelectItem>
                    <SelectItem value="internal">Internal Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fundingAgency">Funding Agency</Label>
                <Input
                  id="fundingAgency"
                  value={formData.fundingAgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, fundingAgency: e.target.value }))}
                  placeholder="Funding organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Funding Amount</Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Amount in currency"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pi">Principal Investigator</SelectItem>
                    <SelectItem value="co-pi">Co-Principal Investigator</SelectItem>
                    <SelectItem value="investigator">Investigator</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="collaborator">Collaborator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collaborators">Collaborators</Label>
              <Input
                id="collaborators"
                value={formData.collaborators}
                onChange={(e) => setFormData(prev => ({ ...prev, collaborators: e.target.value }))}
                placeholder="Names of collaborators (comma separated)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Project description and objectives"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Add"} Project
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Projects ({projects.length})</h3>
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects added yet</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((proj) => (
            <Card key={proj.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{proj.title}</h4>
                    <p className="text-muted-foreground mb-1">
                      Type: {proj.type}
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        proj.status === 'completed' ? 'bg-green-100 text-green-800' :
                        proj.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {proj.status}
                      </span>
                      {proj.role && <span className="ml-2 text-xs bg-secondary px-2 py-1 rounded">{proj.role}</span>}
                    </p>
                    <p className="text-muted-foreground mb-1">
                      Duration: {new Date(proj.startDate).toLocaleDateString()}
                      {proj.endDate && ` - ${new Date(proj.endDate).toLocaleDateString()}`}
                    </p>
                    {proj.fundingAgency && (
                      <p className="text-muted-foreground mb-1">
                        Funding: {proj.fundingAgency}
                        {proj.amount && ` (${proj.amount})`}
                      </p>
                    )}
                    {proj.collaborators && <p className="text-muted-foreground mb-1">Collaborators: {proj.collaborators}</p>}
                    {proj.description && <p className="text-sm mt-2">{proj.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(proj)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(proj.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;