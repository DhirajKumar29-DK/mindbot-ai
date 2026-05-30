import { useState, useRef, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am MindBot AI. How can I help you?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [personality, setPersonality] = useState("General Assistant");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setLoading(true);

    try {
      const res = await fetch("https://mindbot-backend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, personality }),
      });

      const data = await res.json();

      const updatedMessages =
        messages.length === 1 && messages[0].sender === "bot"
          ? []
          : messages;

      setMessages([
        ...updatedMessages,
        {
          sender: "user",
          text: userMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          sender: "bot",
          text: data.reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: darkMode ? "#121212" : "white",
        color: darkMode ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <h1 style={{ color: "#007bff", margin: 0 }}>🤖 MindBot AI</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <p style={{ textAlign: "center", color: "gray" }}>
        Think. Chat. Solve.
      </p>

      {/* Personality Selector */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <select
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: darkMode ? "#333" : "white",
            color: darkMode ? "white" : "black",
            border: darkMode ? "1px solid #555" : "1px solid #ccc",
          }}
        >
          <option>General Assistant</option>
          <option>Coding Mentor</option>
          <option>Interview Coach</option>
          <option>Study Helper</option>
        </select>
      </div>

      {/* Chat Window */}
      <div
        style={{
          height: "450px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "15px",
          overflowY: "auto",
          backgroundColor: darkMode ? "#1e1e1e" : "#f4f7fb",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 15px",
                borderRadius: "20px",
                backgroundColor:
                  msg.sender === "user"
                    ? "#007bff"
                    : darkMode
                    ? "#333"
                    : "#e5e5ea",
                color:
                  msg.sender === "user"
                    ? "white"
                    : darkMode
                    ? "#ffffff"
                    : "#000000",
              }}
            >
              {msg.text}
              <div
                style={{
                  fontSize: "11px",
                  marginTop: "5px",
                  opacity: 0.7,
                }}
              >
                {msg.time}
              </div>
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: "left", margin: "10px 0" }}>
            <span>Bot is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Row */}
      <div
        style={{
          display: "flex",
          marginTop: "20px",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: darkMode ? "1px solid #555" : "1px solid #ccc",
            backgroundColor: darkMode ? "#333" : "white",
            color: darkMode ? "white" : "black",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Send
        </button>

        <button
          onClick={() =>
            setMessages([
              {
                sender: "bot",
                text: "Hello! I am MindBot AI. How can I help you?",
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ])
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default App;
