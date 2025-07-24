import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lecture {
  id: string;
  title: string;
  course: string;
  semester: string;
  academicYear: string;
  department: string;
  studentsCount: string;
  hoursPerWeek: string;
  description?: string;
}

const LecturesTab = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    semester: "",
    academicYear: "",
    department: "",
    studentsCount: "",
    hoursPerWeek: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const saved = localStorage.getItem(`lectures_${user.id}`);
    if (saved) {
      setLectures(JSON.parse(saved));
    }
  };

  const saveLectures = (newLectures: Lecture[]) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem(`lectures_${user.id}`, JSON.stringify(newLectures));
    setLectures(newLectures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.course || !formData.semester || !formData.academicYear) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newLecture: Lecture = {
      id: isEditing || Date.now().toString(),
      ...formData,
    };

    let updatedLectures;
    if (isEditing) {
      updatedLectures = lectures.map(lec => 
        lec.id === isEditing ? newLecture : lec
      );
      toast({
        title: "Lecture Updated",
        description: "Your lecture has been updated successfully",
      });
    } else {
      updatedLectures = [...lectures, newLecture];
      toast({
        title: "Lecture Added",
        description: "Your lecture has been added successfully",
      });
    }

    saveLectures(updatedLectures);
    resetForm();
  };

  const handleEdit = (lec: Lecture) => {
    setFormData({ ...lec, description: lec.description || "" });
    setIsEditing(lec.id);
  };

  const handleDelete = (id: string) => {
    const updatedLectures = lectures.filter(lec => lec.id !== id);
    saveLectures(updatedLectures);
    toast({
      title: "Lecture Deleted",
      description: "The lecture has been removed",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      course: "",
      semester: "",
      academicYear: "",
      department: "",
      studentsCount: "",
      hoursPerWeek: "",
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
            <GraduationCap className="w-5 h-5" />
            {isEditing ? "Edit Lecture" : "Add New Lecture"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Lecture Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Lecture or subject title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  placeholder="Course name or code"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Semester</SelectItem>
                    <SelectItem value="2">2nd Semester</SelectItem>
                    <SelectItem value="3">3rd Semester</SelectItem>
                    <SelectItem value="4">4th Semester</SelectItem>
                    <SelectItem value="5">5th Semester</SelectItem>
                    <SelectItem value="6">6th Semester</SelectItem>
                    <SelectItem value="7">7th Semester</SelectItem>
                    <SelectItem value="8">8th Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                  placeholder="e.g., 2023-24"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Department name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentsCount">Number of Students</Label>
                <Input
                  id="studentsCount"
                  type="number"
                  value={formData.studentsCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentsCount: e.target.value }))}
                  placeholder="Number of enrolled students"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
                  placeholder="Teaching hours per week"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Course description or topics covered"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Add"} Lecture
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

      {/* Lectures List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Lectures ({lectures.length})</h3>
        {lectures.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No lectures added yet</p>
            </CardContent>
          </Card>
        ) : (
          lectures.map((lec) => (
            <Card key={lec.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{lec.title}</h4>
                    <p className="text-muted-foreground mb-1">Course: {lec.course}</p>
                    <p className="text-muted-foreground mb-1">
                      Semester {lec.semester} | Academic Year: {lec.academicYear}
                    </p>
                    {lec.department && <p className="text-muted-foreground mb-1">Department: {lec.department}</p>}
                    <div className="flex gap-4 text-sm text-muted-foreground mb-1">
                      {lec.studentsCount && <span>Students: {lec.studentsCount}</span>}
                      {lec.hoursPerWeek && <span>Hours/Week: {lec.hoursPerWeek}</span>}
                    </div>
                    {lec.description && <p className="text-sm mt-2">{lec.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(lec)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(lec.id)}>
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

export default LecturesTab;