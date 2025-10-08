import React, { useState, useRef, useEffect } from "react";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      // GPT 답변 + 참고 문서 청크
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "서버 오류가 발생했습니다." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg shadow-md flex flex-col h-[500px]">
      <h2 className="text-2xl font-semibold mb-4 text-center">ChatBot</h2>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-inner">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <span className="font-bold">
                {msg.sender === "user" ? "You" : "Bot"}:{" "}
              </span>
              {msg.text}

              {/* 🔹 참고 문서 청크 표시 */}
              {msg.context && msg.context.length > 0 && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-2 rounded-lg shadow-inner">
                  <b>참고 문서:</b>
                  <ul className="list-disc list-inside mt-1 max-h-40 overflow-y-auto">
                    {msg.context.map((chunk, idx) => (
                      <li key={idx}>{chunk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요..."
          disabled={loading}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 rounded-lg text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
