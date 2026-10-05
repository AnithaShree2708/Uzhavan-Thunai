import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Factor, Priority } from "@/lib/engine";

export function Explain({ factors, summary }: { factors: Factor[]; summary?: string }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="why" className="border-none">
        <AccordionTrigger className="py-2 text-sm text-primary hover:no-underline">
          <span className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4" /> Why this recommendation?</span>
        </AccordionTrigger>
        <AccordionContent>
          {summary && <p className="mb-3 text-sm text-muted-foreground">{summary}</p>}
          <ul className="space-y-2.5">
            {factors.map((f) => (
              <li key={f.name}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{f.name} <span className="text-muted-foreground">· {f.value}</span></span>
                  <span className="text-muted-foreground">{Math.round(f.impact * 100)}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-leaf" style={{ width: `${Math.round(f.impact * 100)}%` }} />
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{f.note}</p>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function PriorityBadge({ p }: { p: Priority }) {
  const v = p === "High" ? "destructive" : p === "Medium" ? "warning" : "success";
  return <Badge variant={v as "destructive"}>{p} priority</Badge>;
}
