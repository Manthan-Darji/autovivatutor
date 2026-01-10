import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Courses" },
  { icon: PlusCircle, label: "Create Course" },
];

const bottomItems: NavItem[] = [
  { icon: Settings, label: "Settings" },
  { icon: LogOut, label: "Logout" },
];

export function Sidebar() {
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

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 px-3">
        {bottomItems.map((item) => (
          <NavButton key={item.label} item={item} />
        ))}
      </div>
    </motion.aside>
  );
}

function NavButton({ item }: { item: NavItem }) {
  const Icon = item.icon;
  
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        item.active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  );
}
