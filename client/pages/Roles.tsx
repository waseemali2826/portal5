import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Role, RolePermissions, UserRecord } from "./roles/types";
import { clonePerms } from "./roles/types";
import {
  roles as seedRoles,
  users as seedUsers,
  logs as seedLogs,
} from "./roles/data";
import { PermissionsEditor } from "./roles/PermissionsEditor";
import { RoleAssignment } from "./roles/RoleAssignment";
import { AuditLogs } from "./roles/AuditLogs";

export default function Roles() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [users, setUsers] = useState<UserRecord[]>(seedUsers);
  const [logs, setLogs] = useState(seedLogs);

  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0].id);
  const selectedRole = roles.find((r) => r.id === selectedRoleId)!;
  const [workingPerms, setWorkingPerms] = useState<RolePermissions>(() =>
    clonePerms(selectedRole.permissions),
  );

  const switchRole = (rid: string) => {
    setSelectedRoleId(rid);
    const role = roles.find((r) => r.id === rid)!;
    setWorkingPerms(clonePerms(role.permissions));
  };

  const savePerms = () => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRoleId ? { ...r, permissions: workingPerms } : r,
      ),
    );
    setLogs((l) => [
      {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: "Admin User",
        action: "Updated permissions",
        details: `${selectedRole.name}`,
      },
      ...l,
    ]);
    toast({ title: "Permissions updated" });
  };

  const assignRole = (userId: string, roleId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, roleId } : u)),
    );
    setLogs((l) => [
      {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: "Admin User",
        action: "Assigned role",
        details: `${userId} → ${roleId}`,
      },
      ...l,
    ]);
    toast({ title: "Role assigned" });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">User Roles</h1>
        <p className="text-sm text-muted-foreground">
          Define permissions, assign roles, and audit changes.
        </p>
      </div>
      <Tabs defaultValue="permissions">
        <TabsList>
          <TabsTrigger value="permissions">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="assignment">Role Assignment</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-sm">Select Role</div>
            <Select value={selectedRoleId} onValueChange={switchRole}>
              <SelectTrigger className="w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Button onClick={savePerms}>Save</Button>
            </div>
          </div>
          <PermissionsEditor
            role={selectedRole}
            perms={workingPerms}
            onChange={setWorkingPerms}
          />
        </TabsContent>

        <TabsContent value="assignment">
          <RoleAssignment users={users} roles={roles} onAssign={assignRole} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
