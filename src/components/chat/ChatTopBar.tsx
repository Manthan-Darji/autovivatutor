import { Settings, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatTopBarProps {
  onSettingsClick?: () => void;
}

export function ChatTopBar({ onSettingsClick }: ChatTopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      {/* Logo & Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Viva AI Tutor</h1>
          <p className="text-xs text-muted-foreground">Your personal learning assistant</p>
        </div>
      </div>

      {/* Settings Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSettingsClick}
        className="h-10 w-10 rounded-xl hover:bg-muted"
      >
        <Settings className="h-5 w-5 text-muted-foreground" />
        <span className="sr-only">Settings</span>
      </Button>
    </header>
  );
}
