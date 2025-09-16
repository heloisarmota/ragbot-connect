import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Brain, 
  FileText, 
  MessageSquare, 
  Settings, 
  Users, 
  Activity,
  Zap,
  Bot,
  Flower,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "knowledge",
      label: "Base de Conhecimento",
      icon: Brain,
      badge: "28"
    },
    {
      id: "conversations",
      label: "Conversas",
      icon: MessageSquare,
      badge: "12"
    },
    {
      id: "documents",
      label: "Documentos",
      icon: FileText,
      badge: null
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Activity,
      badge: null
    },
    {
      id: "converter",
      label: "Conversor PDF",
      icon: FileText,
      badge: null
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center relative">
            <Bot className="w-5 h-5 text-white" />
            <Flower className="w-3 h-3 text-pink-400 absolute -top-1 -right-1" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">RAG Bot</h2>
            <p className="text-xs text-sidebar-foreground/60">WhatsApp AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-11 px-3 transition-all duration-200",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border border-sidebar-border"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto bg-primary/20 text-primary-foreground text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-sidebar-accent-foreground">Online</span>
          </div>
          <Zap className="w-4 h-4 text-primary ml-auto" />
        </div>
        
        {/* User info and logout */}
        <div className="space-y-2">
          <div className="text-xs text-sidebar-foreground/60 px-3">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;