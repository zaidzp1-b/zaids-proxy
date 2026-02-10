"use client";
import { useState, useEffect, useRef } from "react";

export default function ZaidGPTPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"main" | "light">("main");
  const messagesDivRef = useRef<HTMLDivElement>(null);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "main" | "light";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute("theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll messages to bottom
  useEffect(() => {
    messagesDivRef.current?.scrollTo({ top: messagesDivRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Panic / Launch in about:blank
  const launchab = () => {
    const tab = window.open("about:blank", "_blank");
    if (!tab) return;
    const iframe = tab.document.createElement("iframe");
    Object.assign(iframe.style, {
      border: "none",
      outline: "none",
      width: "100vw",
      height: "100vh",
      position: "fixed",
      left: "0",
      top: "0",
    });
    iframe.src = window.location.href;
    tab.document.body.appendChild(iframe);

    window.parent.window.location.replace(localStorage.getItem("panicurl") || "https://classroom.google.com/h");
  };

  // Handle enter key in input
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // Send message
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "No response." }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Error contacting server." }]);
    }
  };

  return (
    <div className="center-container" style={{ maxWidth: 900, padding: "20px" }}>
      {/* NAVBAR */}
      <nav>
        <div className="logo">
          <img src="/assets/images/zaideee.png" alt="Logo" draggable={false} />
          <h1>zaids proxy</h1>
          <h3>ZaidGPT</h3>
        </div>
        <div className="navitems">
          <div className="navitem"><a href="/">Home</a></div>
          <div className="navitem"><a href="/gs.html">Games</a></div>
          <div className="navitem"><a href="/apps.html">Apps</a></div>
          <div className="navitem"><a href="/emulator.html">Emulator</a></div>
          <div className="navitem"><a className="selected">ZaidGPT</a></div>
        </div>
      </nav>

      {/* HEADER */}
      <h1>Zaid<span>GPT</span></h1>
      <h3>Chat with ZaidGPT</h3>

      {/* MESSAGES */}
      <div
        ref={messagesDivRef}
        style={{
          height: "55vh",
          overflowY: "auto",
          padding: 20,
          borderRadius: 10,
          background: "rgba(0,0,0,0.4)",
          margin: "20px 0",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ opacity: 0.7 }}>Start a conversation…</p>
        ) : (
          messages.map((m, i) => (
            <p key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "10px 0" }}>
              <strong>{m.role === "user" ? "You" : "ZaidGPT"}:</strong> {m.content}
            </p>
          ))
        )}
      </div>

      {/* INPUT */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type your message…"
        style={{ width: "80%", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={sendMessage} className="button play" style={{ marginRight: "10px" }}>Send</button>
      <button onClick={launchab} className="button play">Panic</button>

      {/* FOOTER LINKS */}
      <div className="links" style={{ marginTop: "30px" }}>
        <div className="left">
          <a href="/">Home</a>
          <a href="/gs.html">Games</a>
          <a href="/apps.html">Apps</a>
        </div>
        <div className="right">
          <a href="./settings.html">Settings</a>
        </div>
      </div>
    </div>
  );
}
