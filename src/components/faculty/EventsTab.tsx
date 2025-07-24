import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  name: string;
  type: string;
  venue: string;
  startDate: string;
  endDate: string;
  role: string;
  organizer: string;
  description?: string;
}

const EventsTab = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    venue: "",
    startDate: "",
    endDate: "",
    role: "",
    organizer: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const saved = localStorage.getItem(`events_${user.id}`);
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  };

  const saveEvents = (newEvents: Event[]) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem(`events_${user.id}`, JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.venue || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newEvent: Event = {
      id: isEditing || Date.now().toString(),
      ...formData,
    };

    let updatedEvents;
    if (isEditing) {
      updatedEvents = events.map(evt => 
        evt.id === isEditing ? newEvent : evt
      );
      toast({
        title: "Event Updated",
        description: "Your event has been updated successfully",
      });
    } else {
      updatedEvents = [...events, newEvent];
      toast({
        title: "Event Added",
        description: "Your event has been added successfully",
      });
    }

    saveEvents(updatedEvents);
    resetForm();
  };

  const handleEdit = (evt: Event) => {
    setFormData({ ...evt, description: evt.description || "" });
    setIsEditing(evt.id);
  };

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(evt => evt.id !== id);
    saveEvents(updatedEvents);
    toast({
      title: "Event Deleted",
      description: "The event has been removed",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      venue: "",
      startDate: "",
      endDate: "",
      role: "",
      organizer: "",
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
            <Calendar className="w-5 h-5" />
            {isEditing ? "Edit Event" : "Add New Event"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Event name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="symposium">Symposium</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="training">Training Program</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Event venue"
                  required
                />
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="speaker">Speaker</SelectItem>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="judge">Judge</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
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
                placeholder="Brief description of the event"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? "Update" : "Add"} Event
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

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Events ({events.length})</h3>
        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events added yet</p>
            </CardContent>
          </Card>
        ) : (
          events.map((evt) => (
            <Card key={evt.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{evt.name}</h4>
                    <p className="text-muted-foreground mb-1">
                      Type: {evt.type}
                      {evt.role && <span className="ml-2 text-xs bg-secondary px-2 py-1 rounded">{evt.role}</span>}
                    </p>
                    <p className="text-muted-foreground mb-1">Venue: {evt.venue}</p>
                    <p className="text-muted-foreground mb-1">
                      Date: {new Date(evt.startDate).toLocaleDateString()}
                      {evt.endDate && ` - ${new Date(evt.endDate).toLocaleDateString()}`}
                    </p>
                    {evt.organizer && <p className="text-muted-foreground mb-1">Organizer: {evt.organizer}</p>}
                    {evt.description && <p className="text-sm mt-2">{evt.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(evt)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(evt.id)}>
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

export default EventsTab;