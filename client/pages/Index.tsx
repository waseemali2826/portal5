import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
import { IndianRupee, Users2, BookOpen, CalendarDays, ArrowUpRight, ShieldCheck, ClipboardCheck, CalendarClock, Award, Building2, Briefcase, UserCog, PartyPopper, Wallet, BarChart2 } from "lucide-react";

// Mock data for the dashboard
const students = [
  { id: "STU-001", name: "Aarav Patel", contact: "9876543210", course: "Full-Stack", fees: 60000, paid: 45000, status: "Active" as const, enrolledOn: "2025-01-10" },
  { id: "STU-002", name: "Riya Sharma", contact: "9998877766", course: "UI/UX", fees: 45000, paid: 45000, status: "Completed" as const, enrolledOn: "2024-11-20" },
  { id: "STU-003", name: "Mohit Verma", contact: "9898989898", course: "Data Science", fees: 80000, paid: 30000, status: "Active" as const, enrolledOn: "2025-02-02" },
  { id: "STU-004", name: "Simran Kaur", contact: "9988776655", course: "Digital Marketing", fees: 40000, paid: 20000, status: "Active" as const, enrolledOn: "2025-01-25" },
];

const courses = [
  { name: "Full-Stack", duration: "6 mo", fees: 60000, students: 32 },
  { name: "UI/UX", duration: "4 mo", fees: 45000, students: 18 },
  { name: "Data Science", duration: "8 mo", fees: 80000, students: 12 },
  { name: "Digital Marketing", duration: "3 mo", fees: 40000, students: 22 },
];

const enquiries = [
  { name: "Vikas", contact: "9876500000", interest: "Full-Stack", date: "2025-02-10", status: "New" },
  { name: "Sneha", contact: "9876511111", interest: "UI/UX", date: "2025-02-09", status: "Follow-up" },
  { name: "Rahul", contact: "9876522222", interest: "Data Science", date: "2025-02-08", status: "New" },
];

const incomeSeries = [
  { month: "Sep", income: 120000 },
  { month: "Oct", income: 180000 },
  { month: "Nov", income: 140000 },
  { month: "Dec", income: 210000 },
  { month: "Jan", income: 240000 },
  { month: "Feb", income: 260000 },
];

export default function Index() {
  const [query, setQuery] = useState("");

  const totalStudents = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const completed = students.filter((s) => s.status === "Completed").length;
  const totalCourses = courses.length;
  const totalIncome = students.reduce((sum, s) => sum + s.paid, 0);
  const pendingInstallments = students
    .filter((s) => s.paid < s.fees)
    .map((s) => ({ ...s, pending: s.fees - s.paid }));
  const pendingAmount = pendingInstallments.reduce((sum, s) => sum + s.pending, 0);

  const filteredPending = useMemo(() => {
    const q = query.toLowerCase();
    return pendingInstallments.filter(
      (p) => p.name.toLowerCase().includes(q) || p.course.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of students, courses, fees and enquiries</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-1"><ArrowUpRight className="h-4 w-4" /> New Admission</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI title="Total Students" value={`${totalStudents}`} subtitle={`Active ${active} • Completed ${completed}`} icon={<Users2 className="h-5 w-5" />} />
        <KPI title="Total Courses" value={`${totalCourses}`} subtitle="Live Courses" icon={<BookOpen className="h-5 w-5" />} />
        <KPI title="Total Income" value={`₹ ${totalIncome.toLocaleString()}`} subtitle="Collected Fees" icon={<IndianRupee className="h-5 w-5" />} />
        <KPI title="Pending Installments" value={`₹ ${pendingAmount.toLocaleString()}`} subtitle={`${pendingInstallments.length} students`} icon={<CalendarDays className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ income: { label: "Income", color: "hsl(var(--primary))" } }}>
              <LineChart data={incomeSeries} margin={{ left: 12, right: 12 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="income" stroke="var(--color-income)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enrollments by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                students: { label: "Students", color: "hsl(var(--accent-foreground))" },
              }}
            >
              <BarChart data={courses} margin={{ left: 8, right: 8 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="students" fill="var(--color-students)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Installments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student, course, ID..." className="h-9" />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPending.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name} <span className="text-muted-foreground">• {p.id}</span></TableCell>
                      <TableCell>{p.course}</TableCell>
                      <TableCell className="text-right">₹ {p.pending.toLocaleString()}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="outline">Mark Paid</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell>{e.contact}</TableCell>
                      <TableCell>{e.interest}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={e.status === "New" ? "default" : "secondary"}>{e.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline">Add Enquiry</Button>
              <Button size="sm">Convert to Admission</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Management Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <FeatureCard to="/dashboard/roles" title="User Roles" subtitle="Manage permissions" icon={<ShieldCheck className="h-5 w-5" />} stat="3 roles" />
          <FeatureCard to="/dashboard/admissions" title="Admissions" subtitle="Convert & enroll" icon={<ClipboardCheck className="h-5 w-5" />} stat="5 pending" />
          <FeatureCard to="/dashboard/batches" title="Batch & Time Table" subtitle="Schedules" icon={<CalendarClock className="h-5 w-5" />} stat="8 batches" />
          <FeatureCard to="/dashboard/certificates" title="Certificates" subtitle="Issue & verify" icon={<Award className="h-5 w-5" />} stat="2 to issue" />
          <FeatureCard to="/dashboard/campuses" title="Campuses" subtitle="Locations" icon={<Building2 className="h-5 w-5" />} stat="2 campuses" />
          <FeatureCard to="/dashboard/employees" title="Employees" subtitle="Team" icon={<Briefcase className="h-5 w-5" />} stat="18 staff" />
          <FeatureCard to="/dashboard/users" title="Users" subtitle="Accounts" icon={<UserCog className="h-5 w-5" />} stat="124 users" />
          <FeatureCard to="/dashboard/events" title="Events" subtitle="Activities" icon={<PartyPopper className="h-5 w-5" />} stat="3 upcoming" />
          <FeatureCard to="/dashboard/expenses" title="Expenses" subtitle="Spending" icon={<Wallet className="h-5 w-5" />} stat="₹ 52k" />
          <FeatureCard to="/dashboard/reports" title="Reports" subtitle="Analytics" icon={<BarChart2 className="h-5 w-5" />} stat="All" />
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
function FeatureCard({ to, title, subtitle, icon, stat }: { to: string; title: string; subtitle: string; icon: React.ReactNode; stat?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold">{stat || "—"}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        <div className="pt-3">
          <Link to={to}><Button size="sm" variant="outline">Open</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

function KPI({ title, value, subtitle, icon }: { title: string; value: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
