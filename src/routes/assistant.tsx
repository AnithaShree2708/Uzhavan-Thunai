import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Info, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrandLogo } from "@/components/agri/BrandLogo";
import { PageHeader } from "@/components/agri/AppShell";
import { useFarm } from "@/lib/farm-store";
import { demoReply, SUGGESTIONS } from "@/lib/demo-assistant";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "AI Assistant (Demo) — Uzhavan Thunai" },
      { name: "description", content: "Ask about crop choice, irrigation and soil health. Demo assistant with rule-based replies." },
      { property: "og:title", content: "Uzhavan Thunai Demo Assistant" },
      { property: "og:description", content: "A demo farming assistant answering crop, irrigation and soil questions." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; text: string };

function renderMd(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.replace(/^- /, "• ").split(/\*\*(.+?)\*\*/g);
    return <p key={i} className="min-h-[0.5rem]">{parts.map((p, j) => (j % 2 ? <strong key={j}>{p}</strong> : p))}</p>;
  });
}

function Assistant() {
  const farm = useFarm();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", text: "Vanakkam! I'm the Uzhavan Thunai demo assistant. Ask me about **crop choice**, **irrigation** or **soil health** for your field." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [msgs, typing]);

  const send = (q: string) => {
    if (!q.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", text: demoReply(q, farm) }]);
      setTyping(false);
    }, 600);
  };

  return (
    <div>
      <PageHeader title="AI Assistant" subtitle="Quick answers grounded in your current soil inputs and forecast." />
      <Alert className="mb-4 border-accent/50 bg-accent/10">
        <Info className="h-4 w-4" />
        <AlertDescription>Demo assistant: replies are predefined and rule-based. No external AI model is connected yet — an LLM explanation layer can be plugged in later.</AlertDescription>
      </Alert>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="h-[28rem] space-y-4 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-earth text-primary-foreground" : ""}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <BrandLogo className="h-8 w-8" />}
                </span>
                <div className={`max-w-[80%] text-sm leading-relaxed ${m.role === "user" ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground" : "pt-1"}`}>
                  {renderMd(m.text)}
                </div>
              </div>
            ))}
            {typing && <p className="pl-11 text-sm text-muted-foreground">Thinking…</p>}
            <div ref={end} />
          </div>
          <div className="border-t p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button key={s} size="sm" variant="secondary" onClick={() => send(s)}>{s}</Button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about crops, irrigation, soil…" />
              <Button type="submit" size="icon" disabled={!input.trim() || typing} aria-label="Send"><Send /></Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
