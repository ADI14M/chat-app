import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // same as backend

export default function Chat() {
  const me = JSON.parse(localStorage.getItem("me") || "{}");
  const [text, setText] = useState("");
  const [feed, setFeed] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    socket.on("chatMessage", (msg) => setFeed((p) => [...p, msg]));
    return () => socket.off("chatMessage");
  }, []);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [feed]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit("chatMessage", { text, from: me?.username || me?.email || "Me" });
    setText("");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-3 border-b flex justify-between items-center">
        <div className="font-semibold">Chat App</div>
        <div className="text-sm flex items-center gap-3">
          <span className="opacity-70">{me?.username || me?.email}</span>
          <button onClick={logout} className="px-3 py-1 rounded bg-gray-800 text-white">Logout</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {feed.map((m, i) => (
          <div key={i} className="mb-2">
            <div className="text-xs opacity-60">{m.from} • {new Date(m.at || Date.now()).toLocaleTimeString()}</div>
            <div className="inline-block bg-white rounded-xl px-3 py-2 shadow">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <footer className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e)=> e.key==="Enter" && send()}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message…"
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded">Send</button>
      </footer>
    </div>
  );
}
