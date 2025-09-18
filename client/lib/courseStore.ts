const KEY = "admin.courses";

export type StoredCourse = {
  id: string;
  name: string;
  duration: string;
  fees: number;
  description?: string;
  createdAt: string; // ISO
};

export function getStoredCourses(): StoredCourse[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredCourse[]) : [];
  } catch {
    return [];
  }
}

export function addStoredCourse(course: Omit<StoredCourse, "id" | "createdAt">) {
  const list = getStoredCourses();
  const next: StoredCourse = {
    id: `CRS-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...course,
  };
  localStorage.setItem(KEY, JSON.stringify([next, ...list]));
  return next;
}
