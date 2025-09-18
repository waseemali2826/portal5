import type { AuditLog, ModuleName, PermissionSet, Role, RolePermissions, UserRecord } from "./types";

const allow = (a: Partial<PermissionSet> = {}): PermissionSet => ({ view: false, add: false, edit: false, delete: false, ...a });

const base = (mods: ModuleName[], override: Partial<PermissionSet>): RolePermissions =>
  Object.fromEntries(mods.map((m) => [m, allow(override)])) as RolePermissions;

const none = (mods: ModuleName[]): RolePermissions => base(mods, {});

const readOnly = (mods: ModuleName[]): RolePermissions => base(mods, { view: true });
const manage = (mods: ModuleName[]): RolePermissions => base(mods, { view: true, add: true, edit: true, delete: true });

const allMods: ModuleName[] = [
  "Dashboard",
  "Enquiries",
  "Admissions",
  "Students",
  "Courses",
  "Fees",
  "Batches",
  "Certificates",
  "Campuses",
  "Employees",
  "Users",
  "Events",
  "Expenses",
  "Reports",
];

export const roles: Role[] = [
  {
    id: "role-frontdesk",
    name: "Front Desk Representative",
    description: "View student attendance and basic info",
    dashboard: "/students",
    permissions: {
      ...none(allMods),
      Students: { view: true, add: false, edit: false, delete: false },
    },
  },
  {
    id: "role-telesales",
    name: "Telesales Representative",
    description: "Only Enquiries module (create and follow-ups)",
    dashboard: "/enquiries",
    permissions: {
      ...none(allMods),
      Enquiries: { view: true, add: true, edit: true, delete: false },
    },
  },
  {
    id: "role-admissions",
    name: "Admissions Coordinator",
    description: "Handle enquiries and new admissions; update status",
    dashboard: "/admissions",
    permissions: {
      ...none(allMods),
      Enquiries: { view: true, add: true, edit: true, delete: false },
      Admissions: { view: true, add: true, edit: true, delete: false },
      Students: { view: true, add: true, edit: true, delete: false },
    },
  },
  {
    id: "role-program-manager",
    name: "Program Manager",
    description: "Plan courses & schedules; assign students; track progress",
    dashboard: "/batches",
    permissions: {
      ...none(allMods),
      Courses: { view: true, add: true, edit: true, delete: true },
      Batches: { view: true, add: true, edit: true, delete: true },
      Students: { view: true, add: false, edit: true, delete: false },
      Reports: { view: true, add: false, edit: false, delete: false },
    },
  },
  {
    id: "role-campus-head",
    name: "Campus Head",
    description: "Manage students & courses; limited finance reports",
    dashboard: "/reports",
    permissions: {
      ...none(allMods),
      Students: { view: true, add: true, edit: true, delete: true },
      Courses: { view: true, add: true, edit: true, delete: true },
      Fees: { view: true, add: false, edit: false, delete: false },
      Reports: { view: true, add: false, edit: false, delete: false },
    },
  },
  {
    id: "role-owner",
    name: "Owner",
    description: "Super admin with full access to all features and settings",
    dashboard: "/",
    permissions: manage(allMods),
  },
  {
    id: "role-admin",
    name: "Admin",
    description: "Super control",
    dashboard: "/",
    permissions: manage(allMods),
  },
  {
    id: "role-faculty",
    name: "Faculty / Teacher",
    description: "Attendance, performance, timetable",
    dashboard: "/batches",
    permissions: {
      ...readOnly(allMods),
      Batches: { view: true, add: false, edit: false, delete: false },
      Students: { view: true, add: false, edit: true, delete: false },
    },
  },
  {
    id: "role-accountant",
    name: "Accountant",
    description: "Fee collection, finance reports",
    dashboard: "/fees",
    permissions: {
      ...readOnly(allMods),
      Fees: { view: true, add: true, edit: true, delete: false },
      Reports: { view: true, add: false, edit: false, delete: false },
    },
  },
  {
    id: "role-student",
    name: "Student",
    description: "Portal user",
    dashboard: "/",
    permissions: {
      ...readOnly(allMods),
      Certificates: { view: true, add: false, edit: false, delete: false },
      Fees: { view: true, add: false, edit: false, delete: false },
    },
  },
];

export const users: UserRecord[] = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@example.com", campus: "Mumbai", roleId: "role-frontdesk" },
  { id: "u2", name: "Priya Patel", email: "priya@example.com", campus: "Delhi", roleId: "role-telesales" },
  { id: "u3", name: "Rahul Verma", email: "rahul@example.com", campus: "Bengaluru", roleId: "role-admissions" },
  { id: "u4", name: "Neha Gupta", email: "neha@example.com", campus: "Pune", roleId: "role-program-manager" },
  { id: "u5", name: "Ankit Singh", email: "ankit@example.com", campus: "Hyderabad", roleId: "role-campus-head" },
  { id: "u6", name: "Owner User", email: "owner@example.com", roleId: "role-owner" },
  { id: "u7", name: "Admin User", email: "admin@example.com", roleId: "role-admin" },
  { id: "u8", name: "Faculty User", email: "faculty@example.com", roleId: "role-faculty" },
  { id: "u9", name: "Accountant User", email: "accounts@example.com", roleId: "role-accountant" },
  { id: "u10", name: "Student User", email: "student@example.com", roleId: "role-student" },
];

export const logs: AuditLog[] = [
  { id: "l1", timestamp: new Date().toISOString(), user: "Admin User", action: "Updated permissions", details: "Admin toggled Admissions.delete for Front Desk" },
  { id: "l2", timestamp: new Date().toISOString(), user: "Admin User", action: "Assigned role", details: "Rahul Verma → Admissions Coordinator" },
];
