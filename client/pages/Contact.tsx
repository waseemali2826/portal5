import { useState, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    setSending(false);
    toast({ title: "Message sent", description: "Thanks for contacting us." });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <h2 className="text-2xl font-bold">Contact Us</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Institute Info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-medium">Address:</span> 123 Main Road, City Campus</div>
            <div><span className="font-medium">Phone:</span> +92 300 1234567</div>
            <div><span className="font-medium">Email:</span> info@eduadmin.example</div>
            <div className="aspect-[16/9] overflow-hidden rounded-md border">
              <iframe title="map" className="h-full w-full" src="https://www.openstreetmap.org/export/embed.html?bbox=66.99%2C24.84%2C67.13%2C24.92&amp;layer=mapnik"></iframe>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Email Form</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>
              <Button type="submit" disabled={sending} className="w-full">{sending ? "Sending…" : "Send"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
