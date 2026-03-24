import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Icon } from "../utils/Icon";
import { Card } from "../components";
import { Colors, Fonts, MOCK_USER } from "../constants";
import { aiAPI } from "../utils/api";

export const AIPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your health assistant. Ask me anything about your health, medicines, or medical reports. 👋",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef();

  const suggestions = [
    "Explain my blood pressure",
    "What does cholesterol mean?",
    "How to lower blood sugar?",
    "Predict my health risks",
  ];

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    
    setMessages((m) => [...m, { role: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
    setLoading(true);
    setError(null);
    
    try {
      const response = await aiAPI.askQuestion(text, "health");
      const answer = response?.data?.answer || "I couldn't generate a response. Please try again.";
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("AI Error:", err);
      setError(err.message);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `❌ Error: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 112px)" }}>
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${Colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: Colors.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon n="bot" size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: Colors.navy, fontSize: 13, fontFamily: Fonts.FD }}>
              Swasth AI Assistant
            </div>
            <div style={{ fontSize: 11, color: Colors.green, fontFamily: Fonts.FT }}>
              ● Online — Powered by AI
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div
          style={{
            padding: "7px 12px",
            borderBottom: `1px solid ${Colors.border}`,
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                padding: "4px 10px",
                background: Colors.tealLight,
                color: Colors.teal,
                border: "none",
                borderRadius: 14,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: Fonts.FT,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                gap: 7,
              }}
            >
              {m.role === "ai" && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: Colors.teal,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                >
                  <Icon n="bot" size={12} color="#fff" />
                </div>
              )}
              <div style={{ maxWidth: "72%" }}>
                <div
                  style={{
                    background: m.role === "user" ? Colors.teal : Colors.bg,
                    color: m.role === "user" ? "#fff" : Colors.text,
                    borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                    padding: "9px 12px",
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontFamily: Fonts.FT,
                  }}
                >
                  {m.role === 'ai' ? <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p style={{margin: 0}} {...props} />,
                      ul: ({node, ...props}) => <ul style={{margin: '5px 0', paddingLeft: '20px'}} {...props} />,
                      li: ({node, ...props}) => <li style={{marginBottom: '4px'}} {...props} />,
                    }}
                  >{m.text}</ReactMarkdown> : m.text}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: Colors.muted,
                    marginTop: 2,
                    textAlign: m.role === "user" ? "right" : "left",
                    fontFamily: Fonts.FT,
                  }}
                >
                  {m.time}
                </div>
              </div>
              {m.role === "user" && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: Colors.blue,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 11,
                    flexShrink: 0,
                    alignSelf: "flex-end",
                    fontFamily: Fonts.FD,
                  }}
                >
                  {MOCK_USER.name[0]}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 7 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: Colors.teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon n="bot" size={12} color="#fff" />
              </div>
              <div
                style={{
                  background: Colors.bg,
                  borderRadius: "14px 14px 14px 3px",
                  padding: "9px 12px",
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: Colors.teal,
                      opacity: 0.5 + i * 0.25,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "10px 12px",
            borderTop: `1px solid ${Colors.border}`,
            display: "flex",
            gap: 8,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about your health, reports, medications..."
            style={{
              flex: 1,
              padding: "9px 13px",
              borderRadius: 18,
              border: `1px solid ${Colors.border}`,
              fontSize: 12,
              outline: "none",
              background: Colors.bg,
              fontFamily: Fonts.FT,
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: input.trim() ? Colors.teal : Colors.border,
              border: "none",
              cursor: input.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon n="send" size={14} color="#fff" />
          </button>
        </div>
      </Card>
    </div>
  );
};
