import React, { useState, useEffect } from "react";

// Utility function to remove emojis
const removeEmojis = (text) => {
  return text.replace(/[🌀-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
};

function App() {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [serviceMode, setServiceMode] = useState(null); // Added service mode state

  // Load responses from the JSON file
  useEffect(() => {
    fetch("/responses.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setResponses(data))
      .catch((err) => console.error("Error loading responses:", err));
  }, []);

  // Get a response for the user's input
  const getResponse = (message) => {
    if (!responses || responses.length === 0) {
      return "⚠️ Sorry, I couldn't load my knowledge base. Please try again later.";
    }
    const lowerMessage = message.toLowerCase();
    const match = responses.find((item) =>
      lowerMessage.includes(item.question.toLowerCase())
    );
    return match
      ? match.response
      : "🤔 I'm not sure how to respond to that. Can you ask me something else?";
  };

  // Speak the bot's response (excluding emojis)
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(removeEmojis(text)); // Remove emojis before speaking
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  // Automatically handle sending a message after speaking
  const handleSendMessage = (message) => {
    const userMessage = { sender: "User", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const response = getResponse(message);
    const botMessage = { sender: "HealthGuru 🤖", text: response };

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      speak(response); // Speak the bot's response
    }, 1000);
  };

  // Start speech recognition
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript); // Automatically send the message
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!serviceMode) {
    return (
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #2e3b4e, #3b6978)",
          color: "#ffffff",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>Welcome to HealthGuru</h1>
        <h2 style={{ fontSize: "20px", marginBottom: "40px" }}>Choose your service mode</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => setServiceMode("typing")}
            style={buttonStyle}
          >
            Typing
          </button>
          <button
            onClick={() => setServiceMode("speaking")}
            style={buttonStyle}
          >
            Speaking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2e3b4e, #3b6978)",
        color: "#ffffff",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {/* Chat Container */}
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
        <h1 style={{ textAlign: "center", marginBottom: "10px", fontSize: "28px", color: "#2e3b4e" }}>HealthGuru</h1>

        {serviceMode === "speaking" ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <button
              onClick={startListening}
              style={{
                background: isListening ? "#ffcc00" : "#007bff",
                color: "#ffffff",
                border: "none",
                padding: "15px",
                borderRadius: "50%",
                fontSize: "20px",
                cursor: "pointer",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              🎙️
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Type your message..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>
        )}

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
                textAlign: msg.sender === "HealthGuru 🤖" ? "left" : "right",
                color: msg.sender === "HealthGuru 🤖" ? "#2e3b4e" : "#333",
                fontWeight: "bold",
                margin: "5px 0",
              }}
            >
              <strong>{msg.sender}: </strong>
              {msg.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#007bff",
  color: "#ffffff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
};

export default App;
