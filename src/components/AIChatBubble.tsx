import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Briefcase, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSiteSettings } from "@/hooks/usePortfolioData";

type Msg = { role: "user" | "assistant"; content: string };
type ChatMode = "portfolio" | "general";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/portfolio-chat`;

const getVisitorId = () => {
  let id = localStorage.getItem("chat_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_visitor_id", id);
  }
  return id;
};

const AIChatBubble = () => {
  const { data: siteSettings } = useSiteSettings();
  const botName = siteSettings?.chatbot_name || "Portfolio AI";
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("portfolio");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const switchMode = (newMode: ChatMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setMessages([]);
    setRemaining(null);
    setLimitReached(false);
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          mode,
          visitor_id: mode === "general" ? getVisitorId() : undefined,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        if (errData.limit_reached) {
          setLimitReached(true);
          setRemaining(0);
        }
        upsertAssistant(errData.error || "Sorry, something went wrong.");
        setIsLoading(false);
        return;
      }

      // Read remaining header for general mode
      if (mode === "general") {
        const rem = resp.headers.get("X-Remaining");
        if (rem !== null) setRemaining(parseInt(rem));
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch {
      upsertAssistant("Connection error. Please try again.");
    }

    setIsLoading(false);
  }, [input, isLoading, messages, mode]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: "0 0 25px hsl(160, 70%, 45%, 0.3), 0 4px 15px rgba(0,0,0,0.3)" }}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[520px] glass-strong rounded-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: "0 0 40px hsl(160, 70%, 45%, 0.1), 0 8px 30px rgba(0,0,0,0.4)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {mode === "portfolio" ? botName : "General AI"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mode === "portfolio" ? "Ask about this developer" : "Ask anything"}
                  </p>
                </div>
              </div>
              {/* Mode toggle */}
              <div className="flex gap-1 bg-muted/30 rounded-lg p-0.5">
                <button
                  onClick={() => switchMode("portfolio")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                    mode === "portfolio"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  Portfolio
                </button>
                <button
                  onClick={() => switchMode("general")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                    mode === "general"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  General
                </button>
              </div>
              {mode === "general" && remaining !== null && (
                <p className="text-[10px] text-muted-foreground mt-1 text-center">
                  {limitReached ? "⚠️ আজকের সীমা শেষ" : `${remaining} টি মেসেজ বাকি আছে আজ`}
                </p>
              )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-xs py-8">
                  <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>{mode === "portfolio" ? "Skills, projects বা experience সম্পর্কে জিজ্ঞেস করুন" : "যেকোনো প্রশ্ন করুন!"}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted/50 rounded-xl px-3 py-2 text-sm text-muted-foreground">Thinking...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={limitReached ? "আজকের সীমা শেষ..." : mode === "portfolio" ? "Ask about skills, projects..." : "Ask anything..."}
                  className="flex-1 bg-muted/30 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-all"
                  disabled={isLoading || limitReached}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || limitReached}
                  className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBubble;
