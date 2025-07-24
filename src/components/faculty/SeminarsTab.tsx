import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Seminar {
  id: string;
  title: string;
  venue: string;
  date: string;
  organizer: string;
  topic: string;
  description?: string;
}

const SeminarsTab = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    date: "",
    organizer: "",
    topic: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSeminars();
  }, []);

  const loadSeminars = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const saved = localStorage.getItem(`seminars_${user.id}`);
    if (saved) {
      setSeminars(JSON.parse(saved));
    }
  };

  const saveSeminars = (newSeminars: Seminar[]) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem(`seminars_${user.id}`, JSON.stringify(newSeminars));
    setSeminars(newSeminars);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.venue || !formData.date || !formData.topic) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newSeminar: Seminar = {
      id: isEditing || Date.now().toString(),
      ...formData,
    };

    let updatedSeminars;
    if (isEditing) {
      updatedSeminars = seminars.map(sem => 
        sem.id === isEditing ? newSeminar : sem
      );
      toast({
        title: "Seminar Updated",
        description: "Your seminar has been updated successfully",
      });
    } else {
      updatedSeminars = [...seminars, newSeminar];
      toast({
        title: "Seminar Added",
        description: "Your seminar has been added successfully",
      });
    }

    saveSeminars(updatedSeminars);
    resetForm();
  };

  const handleEdit = (sem: Seminar) => {
    setFormData({ ...sem, description: sem.description || "" });
    setIsEditing(sem.id);
  };

  const handleDelete = (id: string) => {
    const updatedSeminars = seminars.filter(sem => sem.id !== id);
    saveSeminars(updatedSeminars);
    toast({
      title: "Seminar Deleted",
      description: "The seminar has been removed",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      venue: "",
      date: "",
      organizer: "",
      topic: "",
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
            <Presentation className="w-5 h-5" />
            {isEditing ? "Edit Seminar" : "Add New Seminar"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Seminar title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Main topic or subject"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Location or venue"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  placeholder="Organizing body"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the seminar"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Add"} Seminar
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

      {/* Seminars List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Seminars ({seminars.length})</h3>
        {seminars.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Presentation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No seminars added yet</p>
            </CardContent>
          </Card>
        ) : (
          seminars.map((sem) => (
            <Card key={sem.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{sem.title}</h4>
                    <p className="text-muted-foreground mb-1">Topic: {sem.topic}</p>
                    <p className="text-muted-foreground mb-1">
                      Venue: {sem.venue} | Date: {new Date(sem.date).toLocaleDateString()}
                    </p>
                    {sem.organizer && <p className="text-muted-foreground mb-1">Organizer: {sem.organizer}</p>}
                    {sem.description && <p className="text-sm mt-2">{sem.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(sem)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(sem.id)}>
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

export default SeminarsTab;