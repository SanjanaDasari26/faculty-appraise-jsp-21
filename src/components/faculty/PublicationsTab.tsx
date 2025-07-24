import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  type: string;
  doi?: string;
  description?: string;
}

const PublicationsTab = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    year: "",
    type: "",
    doi: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const saved = localStorage.getItem(`publications_${user.id}`);
    if (saved) {
      setPublications(JSON.parse(saved));
    }
  };

  const savePublications = (newPublications: Publication[]) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem(`publications_${user.id}`, JSON.stringify(newPublications));
    setPublications(newPublications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.authors || !formData.journal || !formData.year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newPublication: Publication = {
      id: isEditing || Date.now().toString(),
      ...formData,
    };

    let updatedPublications;
    if (isEditing) {
      updatedPublications = publications.map(pub => 
        pub.id === isEditing ? newPublication : pub
      );
      toast({
        title: "Publication Updated",
        description: "Your publication has been updated successfully",
      });
    } else {
      updatedPublications = [...publications, newPublication];
      toast({
        title: "Publication Added",
        description: "Your publication has been added successfully",
      });
    }

    savePublications(updatedPublications);
    resetForm();
  };

  const handleEdit = (pub: Publication) => {
    setFormData({ ...pub, doi: pub.doi || "", description: pub.description || "" });
    setIsEditing(pub.id);
  };

  const handleDelete = (id: string) => {
    const updatedPublications = publications.filter(pub => pub.id !== id);
    savePublications(updatedPublications);
    toast({
      title: "Publication Deleted",
      description: "The publication has been removed",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      authors: "",
      journal: "",
      year: "",
      type: "",
      doi: "",
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
            <BookOpen className="w-5 h-5" />
            {isEditing ? "Edit Publication" : "Add New Publication"}
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
                  placeholder="Publication title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authors">Authors *</Label>
                <Input
                  id="authors"
                  value={formData.authors}
                  onChange={(e) => setFormData(prev => ({ ...prev, authors: e.target.value }))}
                  placeholder="Author names"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journal">Journal/Conference *</Label>
                <Input
                  id="journal"
                  value={formData.journal}
                  onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
                  placeholder="Journal or conference name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="Publication year"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journal">Journal Article</SelectItem>
                    <SelectItem value="conference">Conference Paper</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="chapter">Book Chapter</SelectItem>
                    <SelectItem value="patent">Patent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  value={formData.doi}
                  onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                  placeholder="Digital Object Identifier"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Add"} Publication
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

      {/* Publications List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Publications ({publications.length})</h3>
        {publications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No publications added yet</p>
            </CardContent>
          </Card>
        ) : (
          publications.map((pub) => (
            <Card key={pub.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{pub.title}</h4>
                    <p className="text-muted-foreground mb-1">Authors: {pub.authors}</p>
                    <p className="text-muted-foreground mb-1">
                      {pub.journal} ({pub.year})
                      {pub.type && <span className="ml-2 text-xs bg-secondary px-2 py-1 rounded">{pub.type}</span>}
                    </p>
                    {pub.doi && <p className="text-sm text-muted-foreground">DOI: {pub.doi}</p>}
                    {pub.description && <p className="text-sm mt-2">{pub.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(pub)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(pub.id)}>
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

export default PublicationsTab;