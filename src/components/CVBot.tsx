import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Zap, ArrowRight } from "lucide-react";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function CVBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: "Welcome to Fear 4Fangz. I'm Fear AI, your personal assistant. I can help you with tournaments, scrims, TDM Arena, rankings, rules, support, and everything available on the Fear 4Fangz platform."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text;
    setInputText("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "bot",
        content: "⚠️ I had a temporary latency spike, but feel free to explore the Tournaments register panel or map strategically in the Strategy Room!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const chips = [
    "How to join tournaments?",
    "Apply for recruitment",
    "Explain Team War territories",
    "Where is Strategy Room?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="fear-ai-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="relative bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-105 group border border-red-500 flex items-center justify-center cursor-pointer"
        >
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
          <Bot size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute right-14 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg border border-red-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with Fear AI
          </span>
        </button>
      )}

      {/* Main Bot Chat Window */}
      {isOpen && (
        <div
          id="fear-ai-window"
          className="w-80 sm:w-96 h-[500px] bg-[#121212] border-2 border-red-600/60 rounded-xl overflow-hidden shadow-2xl shadow-red-900/40 flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#250005] p-4 flex items-center justify-between border-b border-red-600/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-600/20 border border-red-600 rounded-lg">
                <Zap size={18} className="text-red-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm select-none">Fear AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest">ECOSYSTEM BOT</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0A0A0A] to-[#121212] custom-scrollbar"
          >
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-[#1C1C1C] text-gray-300 border border-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.role === "bot" ? (
                    <div className="space-y-1">
                      {m.content.split("\n").map((line, lIdx) => (
                        <p key={lIdx} className="break-words">
                          {line.startsWith("**") || line.includes("**") ? (
                            line.split("**").map((part, pIdx) => 
                              pIdx % 2 === 1 ? <strong key={pIdx} className="text-red-400">{part}</strong> : part
                            )
                          ) : line}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="break-words">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1C1C1C] text-gray-400 border border-gray-800 rounded-lg rounded-bl-none px-3 py-2 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce delay-225" />
                  <span className="text-[10px] italic">Fear AI is calculating...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chips Overlay */}
          <div className="px-4 py-2 bg-[#0A0A0A] border-t border-gray-900 overflow-x-auto flex gap-1.5 no-scrollbar whitespace-nowrap">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] bg-[#1C1C1C] hover:bg-red-950 hover:text-white border border-gray-800 rounded-full px-2.5 py-1 text-gray-400 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Control */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-[#121212] border-t border-gray-900 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-[#1A1A1A] border border-gray-800 focus:border-red-600 text-xs px-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-lg p-2.5 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
