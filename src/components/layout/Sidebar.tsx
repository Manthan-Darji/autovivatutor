import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  teacherOnly?: boolean;
  studentOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "Ask Doubts", path: "/chat-history", studentOnly: true },
  { icon: BookOpen, label: "My Courses", path: "/courses" },
  { icon: PlusCircle, label: "Create Course", path: "/create", teacherOnly: true },
];

const bottomItems: NavItem[] = [
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  activePath?: string;
}

export function Sidebar({ activePath = "/" }: SidebarProps) {
  const navigate = useNavigate();
  const { signOut, role } = useAuth();

  // Filter nav items based on role
  const filteredNavItems = navItems.filter((item) => {
    if (item.teacherOnly && role !== "teacher") return false;
    if (item.studentOnly && role !== "student") return false;
    return true;
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 z-40 flex h-screen w-[180px] flex-col bg-sidebar py-6"
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-lg font-bold text-sidebar-primary-foreground">V</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-accent-foreground">Viva Tutor</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {filteredNavItems.map((item) => (
          <NavButton 
            key={item.label} 
            item={item} 
            isActive={activePath === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 px-3">
        {bottomItems.map((item) => (
          <NavButton 
            key={item.label} 
            item={item} 
            isActive={activePath === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  );
}
