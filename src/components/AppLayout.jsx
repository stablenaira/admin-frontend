import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";
import { 
  LayoutDashboard, 
  Settings, 
  User,
  Home,
  ChevronRight,
  FileText,
  Bug,
  GitBranch,
  Slack,
  Users
} from "lucide-react";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from URL path
  const currentPage = location.pathname.substring(1) || "dashboard";

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "Main workflow overview"
    },
    {
      id: "mappings",
      path: "/mappings",
      title: "Mappings",
      icon: GitBranch,
      description: "Mappings management"
    },
    // {
    //   id: "slack",
    //   path: "/slack",
    //   title: "Slack Workflow",
    //   icon: Slack,
    //   description: "Slack Workflow"
    // },
    {
      id: "feature",
      path: "/feature",
      title: "Feature Requests",
      icon: FileText,
      description: "Submit & view feature requests"
    },
    {
      id: "bugs",
      path: "/bugs",
      title: "Bug Reports",
      icon: Bug,
      description: "Submit & view bug reports"
    },
    {
      id: "users",
      path: "/users",
      title: "Users",
      icon: Users,
      description: "Manage users"
    },
  ];

  const allPages = [
    ...menuItems,
    {
      id: "settings",
      path: "/settings",
      title: "Settings",
      icon: Settings,
      description: "Application settings"
    }
  ];

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" variant="sidebar" className="bg-white">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <h1 className="font-semibold">SMC Workflow</h1>
                <p className="text-xs text-muted-foreground">Issue Management</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => navigate(item.path)}
                    tooltip={item.description}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={currentPage === "settings"}
                  onClick={() => navigate("/settings")}
                  tooltip="Settings"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="User Profile">
                  <User className="size-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="size-4" />
              <ChevronRight className="size-4" />
              <span className="font-medium text-foreground">
                {allPages.find(item => item.id === currentPage)?.title || "Dashboard"}
              </span>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* React Router will inject the child route here */}
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
