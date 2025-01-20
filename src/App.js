import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "User", text: input }]);
      setInput("");

      // Example response from AI
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "AI", text: "Hello! How can I assist you?" }
        ]);
      }, 1000);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>AI Chatbot</h1>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px"
        }}
      >
        {messages.map((msg, idx) => (
          <p key={idx} style={{ textAlign: msg.sender === "AI" ? "left" : "right" }}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px 20px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default App;
