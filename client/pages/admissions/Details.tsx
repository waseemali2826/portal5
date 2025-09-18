import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { genStudentId, paymentStatus } from "./types";
import type { AdmissionRecord } from "./types";

export function Details({ rec, onChange }: { rec: AdmissionRecord; onChange: (next: AdmissionRecord) => void }) {
  const { toast } = useToast();
  const [batch, setBatch] = useState(rec.batch);
  const [campus, setCampus] = useState(rec.campus);

  const approve = () => {
    if (rec.status === "Verified") return;
    const id = rec.studentId || genStudentId(rec.student.name);
    onChange({ ...rec, status: "Verified", studentId: id });
    toast({ title: `Approved. Student ID ${id}` });
  };

  const reject = () => {
    const reason = window.prompt("Reason for rejection?") || "";
    if (!reason) return;
    onChange({ ...rec, status: "Rejected", rejectedReason: reason });
    toast({ title: "Admission Rejected" });
  };

  const suspend = () => {
    onChange({ ...rec, status: "Suspended" });
    toast({ title: "Admission Suspended" });
  };

  const cancel = () => {
    onChange({ ...rec, status: "Cancelled" });
    toast({ title: "Admission Cancelled" });
  };

  const transfer = () => {
    onChange({ ...rec, batch, campus });
    toast({ title: "Transferred" });
  };

  const notify = (kind: "sms" | "email") => {
    toast({ title: kind === "sms" ? "SMS sent" : "Email sent" });
  };

  const printForm = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Admission ${rec.id}</title></head><body><pre>${escapeHtml(JSON.stringify(rec, null, 2))}</pre><script>window.print();<\/script></body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">{rec.student.name}</div>
        <div className="text-xs text-muted-foreground">{rec.student.email} • {rec.student.phone}</div>
        <div className="pt-2"><Badge>{rec.status}</Badge></div>
      </div>
      <Separator />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs text-muted-foreground">Assigned Course & Batch</div>
          <div className="font-medium">{rec.course}</div>
          <div className="text-xs text-muted-foreground">Batch: {rec.batch}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Campus</div>
          <div className="font-medium">{rec.campus}</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Transfer</div>
          <Label>Batch</Label>
          <Input value={batch} onChange={(e) => setBatch(e.target.value)} />
          <Label>Campus</Label>
          <Input value={campus} onChange={(e) => setCampus(e.target.value)} />
          <Button variant="outline" onClick={transfer}>Transfer</Button>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Payment Status</div>
          <div className="font-medium">{paymentStatus(rec)}</div>
          <div className="text-xs text-muted-foreground">Total: ₹{rec.fee.total.toLocaleString()}</div>
          <div className="text-xs">Installments:</div>
          <div className="rounded border p-2 text-xs space-y-1">
            {rec.fee.installments.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>{i.id} • ₹{i.amount.toLocaleString()} • Due {new Date(i.dueDate).toLocaleDateString()}</span>
                <span className="text-muted-foreground">{i.paidAt ? `Paid ${new Date(i.paidAt).toLocaleDateString()}` : "Unpaid"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground pb-1">Uploaded Documents</div>
        <div className="space-y-1 text-sm">
          {rec.documents.map((d, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <a href={d.url} className="underline" target="_blank" rel="noreferrer">{d.name}</a>
              <div className="space-x-2">
                <Badge variant={d.verified ? "default" : "secondary"}>{d.verified ? "Verified" : "Pending"}</Badge>
                <Button size="sm" variant="outline" onClick={() => onChange({ ...rec, documents: rec.documents.map((x, i) => (i === idx ? { ...x, verified: !x.verified } : x)) })}>Toggle Verify</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-2">
        <Button onClick={approve}>Approve & Generate ID</Button>
        <Button variant="destructive" onClick={reject}>Reject</Button>
        <Button variant="outline" onClick={suspend}>Freeze / Suspend</Button>
        <Button variant="outline" onClick={cancel}>Cancel</Button>
        <Button variant="outline" onClick={printForm}>Print Admission Form</Button>
        <Button variant="outline" onClick={() => notify("sms")}>Notify via SMS</Button>
        <Button variant="outline" onClick={() => notify("email")}>Notify via Email</Button>
      </div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>\"]+/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
}
