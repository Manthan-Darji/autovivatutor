import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Volume2, School, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  display_name: string;
  school_name: string;
}

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ display_name: "", school_name: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, school_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        display_name: data.display_name || "",
        school_name: data.school_name || "",
      });
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let error;
    
    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          school_name: profile.school_name,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
      error = updateError;
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          display_name: profile.display_name,
          school_name: profile.school_name,
        });
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save profile. Please try again.");
      console.error("Profile save error:", error);
    } else {
      toast.success("Profile updated successfully!");
    }
    
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath="/settings" />
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <SettingsIcon className="h-3.5 w-3.5" />
              SETTINGS
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Preferences
            </h1>
            <p className="mt-1 text-muted-foreground">
              Customize your learning experience
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Profile</h3>
                  <p className="text-sm text-muted-foreground">Your personal information</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="mt-2"
                      value={profile.display_name}
                      onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="school">School / College</Label>
                    <div className="relative mt-2">
                      <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="school"
                        placeholder="e.g., Harvard University"
                        className="pl-10"
                        value={profile.school_name}
                        onChange={(e) => setProfile({ ...profile, school_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-2"
                      value={user?.email || ""}
                      disabled
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your alerts</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to study</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Course Updates</Label>
                    <p className="text-sm text-muted-foreground">New lessons and content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Achievement Alerts</Label>
                    <p className="text-sm text-muted-foreground">Badges and milestones</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Appearance</h3>
                  <p className="text-sm text-muted-foreground">Customize the look</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable UI animations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </motion.div>

            {/* Sound Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Volume2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Sound</h3>
                  <p className="text-sm text-muted-foreground">Audio preferences</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Play sounds for actions</p>
                </div>
                <Switch />
              </div>
            </motion.div>

            <Button onClick={handleSave} className="w-full h-12" disabled={isSaving || isLoading}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
