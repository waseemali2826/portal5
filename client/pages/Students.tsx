import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { StudentRecord } from "./students/types";
import { studentsMock } from "./students/data";
import { Directory } from "./students/Directory";
import { AttendanceTab } from "./students/Attendance";
import { StatusTab } from "./students/Status";
import { StudentsReports } from "./students/Reports";

export default function Students() {
  const [items, setItems] = useState<StudentRecord[]>(studentsMock);

  const upsert = (next: StudentRecord) => {
    setItems((prev) => prev.map((s) => (s.id === next.id ? next : s)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          Directory, actions, attendance, status tracking, and reports.
        </p>
      </div>
      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="directory">
          <Directory data={items} onChange={upsert} />
        </TabsContent>
        <TabsContent value="attendance">
          <AttendanceTab data={items} onChange={upsert} />
        </TabsContent>
        <TabsContent value="status">
          <StatusTab data={items} />
        </TabsContent>
        <TabsContent value="reports">
          <StudentsReports data={items} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
