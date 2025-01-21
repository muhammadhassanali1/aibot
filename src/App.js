import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);

  // Load responses from the JSON file
  useEffect(() => {
    fetch("/responses.json")
      .then((res) => res.json())
      .then((data) => setResponses(data))
      .catch((err) => console.error("Error loading responses:", err));
  }, []);

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    const match = responses.find((item) =>
      lowerMessage.includes(item.question.toLowerCase())
    );
    return match
      ? match.response
      : "I'm not sure how to respond to that. Can you ask me something else?";
  };

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "User", text: input }]);
      const response = getResponse(input);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "HealthGuru", text: response },
        ]);
      }, 1000);
      setInput("");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "linear-gradient(135deg, #ff7f7f, #ffcccb)",
        color: "#ffffff",
        overflow: "hidden", // Hide any overflow for decorations
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          color: "#333",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
      >
        {/* Welcome Header */}
        <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#ff4c4c" }}>
          Welcome to HealthGuru
        </h1>

        {/* Chatbot Title */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#4caf50",
          }}
        >
          Your Personal Health Guide
        </h1>

        {/* Chat Window */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            height: "300px",
            overflowY: "scroll",
            backgroundColor: "#f9f9f9",
            marginBottom: "15px",
          }}
        >
          {messages.map((msg, idx) => (
            <p
              key={idx}
              style={{
                textAlign: msg.sender === "HealthGuru" ? "left" : "right",
                color: msg.sender === "HealthGuru" ? "#4caf50" : "#333",
                fontStyle: msg.sender === "HealthGuru" ? "italic" : "normal",
                fontWeight: "bold",
              }}
            >
              <strong>{msg.sender}: </strong>
              {msg.text}
            </p>
          ))}
        </div>

        {/* Input and Ask Button */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: "1",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginRight: "10px",
              fontSize: "16px",
            }}
            placeholder="Type your health question..."
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#4caf50",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
