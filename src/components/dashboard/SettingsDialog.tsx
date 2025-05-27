import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { getSettings, saveSettings, type UserSettings } from '@/lib/settings';

interface SettingsDialogProps {
  onSaveSettings: (settings: UserSettings) => void;
}

export function SettingsDialog({ onSaveSettings }: SettingsDialogProps) {
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [isOpen, setIsOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Load settings when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSettings(getSettings());
    }
  }, [isOpen]);

  const handleSave = () => {
    const newSettings = saveSettings(settings);
    onSaveSettings(newSettings);
    setIsOpen(false);
  };

  const addLinkedInTemplate = () => {
    if (newTemplate.trim()) {
      setSettings(prev => ({
        ...prev,
        linkedinTemplates: [...prev.linkedinTemplates, newTemplate.trim()]
      }));
      setNewTemplate('');
    }
  };

  const removeLinkedInTemplate = (index: number) => {
    setSettings(prev => ({
      ...prev,
      linkedinTemplates: prev.linkedinTemplates.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Settings</DialogTitle>
          <DialogDescription>
            Configure your personal information and message templates
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Your Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="openaiApiKey" className="flex items-center justify-between">
              OpenAI API Key
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-3 w-3 mr-1" />
                ) : (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                {showApiKey ? 'Hide' : 'Show'}
              </Button>
            </Label>
            <div className="relative">
              <Input
                id="openaiApiKey"
                type={showApiKey ? "text" : "password"}
                value={settings.openaiApiKey || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                placeholder="Enter your OpenAI API key"
                className="pr-24"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key will be stored locally and used for email generation
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="template">Email Template</Label>
            <Textarea
              id="template"
              value={settings.template}
              onChange={(e) => setSettings(prev => ({ ...prev, template: e.target.value }))}
              placeholder="Enter your email template"
              className="min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Available placeholders: {'{firstName}'}, {'{title}'}, {'{company}'}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="blurb">Company Blurb</Label>
            <Textarea
              id="blurb"
              value={settings.blurb}
              onChange={(e) => setSettings(prev => ({ ...prev, blurb: e.target.value }))}
              placeholder="Enter your company blurb"
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This blurb will be added when requested in the notes
            </p>
          </div>
          <div className="grid gap-2">
            <Label>LinkedIn Message Templates</Label>
            <div className="space-y-2">
              {settings.linkedinTemplates.map((template, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={template}
                    onChange={(e) => {
                      const newTemplates = [...settings.linkedinTemplates];
                      newTemplates[index] = e.target.value;
                      setSettings(prev => ({ ...prev, linkedinTemplates: newTemplates }));
                    }}
                    placeholder="Enter a LinkedIn message template"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLinkedInTemplate(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Add new LinkedIn message template"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLinkedInTemplate();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addLinkedInTemplate}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Available placeholders: {'{firstName}'}, {'{title}'}, {'{company}'}, {'{department}'}, {'{industry}'}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 