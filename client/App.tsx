import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
const Home = lazy(() => import("./pages/Home"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const AdmissionForm = lazy(() => import("./pages/AdmissionForm"));
const Contact = lazy(() => import("./pages/Contact"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Students = lazy(() => import("./pages/Students"));
const Courses = lazy(() => import("./pages/Courses"));
const Fees = lazy(() => import("./pages/Fees"));
const Enquiries = lazy(() => import("./pages/Enquiries"));
const Reports = lazy(() => import("./pages/Reports"));
const Accounts = lazy(() => import("./pages/Accounts"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Roles = lazy(() => import("./pages/Roles"));
const Batches = lazy(() => import("./pages/Batches"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Campuses = lazy(() => import("./pages/Campuses"));
const Employees = lazy(() => import("./pages/Employees"));
const Users = lazy(() => import("./pages/Users"));
const Events = lazy(() => import("./pages/Events"));
const Expenses = lazy(() => import("./pages/Expenses"));
import Login from "./pages/Login";
import { AppLayout } from "./components/layout/AppSidebar";
import { AppHeader } from "./components/layout/AppHeader";
import { PublicLayout } from "./components/layout/PublicLayout";

const queryClient = new QueryClient();

function DashboardLayout() {
  return (
    <AppLayout>
      <AppHeader />
      <main role="main" className="p-4 md:p-6">
        <Outlet />
      </main>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
            <Routes>
              {/* Public site */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CourseCatalog />} />
                <Route path="/admission-form" element={<AdmissionForm />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Auth */}
              <Route path="/login" element={<Login />} />

              {/* Dashboard (protected) */}
              <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
                <Route path="/dashboard" element={<Index />} />
                <Route path="/dashboard/students" element={<Students />} />
                <Route path="/dashboard/courses" element={<Courses />} />
                <Route path="/dashboard/fees" element={<Fees />} />
                <Route path="/dashboard/enquiries" element={<Enquiries />} />
                <Route path="/dashboard/reports" element={<Reports />} />
                <Route path="/dashboard/accounts" element={<Accounts />} />
                <Route path="/dashboard/admissions" element={<Admissions />} />
                <Route path="/dashboard/roles" element={<Roles />} />
                <Route path="/dashboard/batches" element={<Batches />} />
                <Route path="/dashboard/certificates" element={<Certificates />} />
                <Route path="/dashboard/campuses" element={<Campuses />} />
                <Route path="/dashboard/employees" element={<Employees />} />
                <Route path="/dashboard/users" element={<Users />} />
                <Route path="/dashboard/events" element={<Events />} />
                <Route path="/dashboard/expenses" element={<Expenses />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
