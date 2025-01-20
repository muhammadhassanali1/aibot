import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("how are you")) {
      return "I'm just a chatbot, but I'm here to help!";
    } else if (lowerMessage.includes("what is my name")) {
      return "I don't know your name yet! You can tell me.";
    } else if (lowerMessage.includes("assalamualaikum")) {
      return "Wa Alaikum Assalam! How can I help you?";
    } else if (lowerMessage.includes("what is your name")) {
      return "I'm an AI chatbot. You can call me HelperBot!";
    } else if (lowerMessage.includes("what is the time")) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (lowerMessage.includes("what is the date")) {
      return `Today's date is ${new Date().toLocaleDateString()}.`;
    } else if (lowerMessage.includes("what can you do")) {
      return "I can answer your questions, chat with you, and assist you with basic information.";
    } else if (lowerMessage.includes("tell me a joke")) {
      return "Why don’t skeletons fight each other? They don’t have the guts!";
    } else if (lowerMessage.includes("bye")) {
      return "Goodbye! Have a great day!";
    } else if (lowerMessage.includes("thank you")) {
      return "You're welcome! Let me know if you have more questions.";
    } else if (lowerMessage.includes("who made you")) {
      return "I was created by Muhammad Hassan Ali to assist and entertain you!";
    } else {
      return "I'm not sure how to respond to that. Can you ask me something else?";
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "User", text: input }]);
      const response = getResponse(input);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "AI", text: response }
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
        background: "linear-gradient(135deg, #89cff0, #6a5acd)",
        color: "#ffffff",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          color: "#333",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#6a5acd" }}>
          AI Chatbot
        </h1>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            height: "300px",
            overflowY: "scroll",
            backgroundColor: "#f4f4f9",
            marginBottom: "15px",
          }}
        >
          {messages.map((msg, idx) => (
            <p
              key={idx}
              style={{
                textAlign: msg.sender === "AI" ? "left" : "right",
                color: msg.sender === "AI" ? "#6a5acd" : "#333",
                fontStyle: msg.sender === "AI" ? "italic" : "normal",
                fontWeight: "bold",
              }}
            >
              <strong>{msg.sender}: </strong>
              {msg.text}
            </p>
          ))}
        </div>
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
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#6a5acd",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
