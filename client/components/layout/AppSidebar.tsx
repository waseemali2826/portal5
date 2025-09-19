import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart2,
  Users2,
  BookOpen,
  IndianRupee,
  FileText,
  MessageSquare,
  ShieldCheck,
  ClipboardCheck,
  CalendarDays,
  Award,
  Building2,
  Briefcase,
  User,
  Megaphone,
  Receipt,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { to: "/dashboard/roles", label: "User Roles", icon: Shield },
  { to: "/dashboard/students", label: "Students", icon: Users2 },
  { to: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { to: "/dashboard/fees", label: "Fees & Installments", icon: IndianRupee },
  { to: "/dashboard/enquiries", label: "Enquiries", icon: MessageSquare },
  { to: "/dashboard/admissions", label: "Admissions", icon: ClipboardCheck },
  { to: "/dashboard/batches", label: "Batch & Time Table", icon: CalendarDays },
  { to: "/dashboard/certificates", label: "Certificates", icon: Award },
  { to: "/dashboard/campuses", label: "Campuses", icon: Building2 },
  { to: "/dashboard/employees", label: "Employees", icon: Briefcase },
  { to: "/dashboard/users", label: "Users", icon: User },
  { to: "/dashboard/events", label: "Events", icon: Megaphone },
  { to: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { to: "/dashboard/reports", label: "Reports", icon: FileText },
  { to: "/dashboard/accounts", label: "Admin / Staff", icon: ShieldCheck },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  return (
    <SidebarProvider>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader className="px-3 py-2">
          <div className="flex items-center gap-2 px-1">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-indigo-400" />
            <div>
              <div className="text-sm font-semibold">EduAdmin</div>
              <div className="text-xs text-muted-foreground">Admin Portal</div>
            </div>
          </div>
          <div className="px-1 pt-2">
            <Input placeholder="Search…" className="h-8" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={pathname === item.to}>
                      <NavLink
                        to={item.to}
                        className={cn("flex items-center gap-2")}
                      >
                        <item.icon className="shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Logged in as <Badge variant="secondary">Manager</Badge>
          </div>
          <Button variant="outline" className="mx-2 mb-2" onClick={logout}>
            Logout
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
