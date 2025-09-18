import { useEffect, useState, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { COURSES } from "@/data/courses";
import { addPublicApplication, addPublicEnquiry } from "@/lib/publicStore";

export default function AdmissionForm() {
  const { toast } = useToast();
  const params = new URLSearchParams(location.search);
  const preCourse = params.get("course") || COURSES[0].name;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(preCourse);
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(()=>{
    // keep URL param selection in state if query changes
    const c = new URLSearchParams(location.search).get("course");
    if (c) setCourse(c);
  }, [location.search]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));

    addPublicEnquiry({ name: fullName, course, contact: phone, email, preferredStart: startDate });
    addPublicApplication({ name: fullName, email, phone, course, preferredStart: startDate });

    setSubmitting(false);
    toast({ title: "Application submitted", description: "Admin panel me record add ho gaya hai." });
    setFullName("");
    setEmail("");
    setPhone("");
    setCourse(COURSES[0].name);
    setStartDate("");
    setMessage("");
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <h2 className="text-2xl font-bold">Admission Form</h2>
      <p className="mt-1 text-sm text-muted-foreground">Student Name, Email, Phone, Course select, Starting Date preference.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Student Name</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="course">Select Course</Label>
            <select id="course" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={course} onChange={(e)=> setCourse(e.target.value)}>
              {COURSES.map((c)=> <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="start">Starting Date Preference</Label>
            <Input id="start" type="date" value={startDate} onChange={(e)=> setStartDate(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any notes or questions" />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting…" : "Submit"}</Button>
      </form>
    </div>
  );
}
