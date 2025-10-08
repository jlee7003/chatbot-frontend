import React, { useState } from "react";

function ChatBox() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: input,
          history: history.map((h) => ({ role: h.role, content: h.content })),
        }),
      });

      const data = await res.json();
      setHistory(data.updated_history);
    } catch (err) {
      console.error("API 오류:", err);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>🤖 RAG 토이 챗봇</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
        }}
      >
        {history.map((msg, idx) => (
          <div
            key={idx}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <b>{msg.role === "user" ? "나" : "AI"}:</b> {msg.content}
          </div>
        ))}
      </div>
      <textarea
        rows="3"
        style={{ width: "100%", marginTop: "10px" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "전송 중..." : "전송"}
      </button>
    </div>
  );
}

export default ChatBox;
