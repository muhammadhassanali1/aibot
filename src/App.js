import React, { useState, useEffect } from "react";

// Utility function to remove emojis
const removeEmojis = (text) => {
  return text.replace(/[🌀-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
};

function App() {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [serviceMode, setServiceMode] = useState(null);
  const [inputText, setInputText] = useState("");

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
    const utterance = new SpeechSynthesisUtterance(removeEmojis(text));
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  // Handle sending a message
  const handleSendMessage = (message) => {
    const userMessage = { sender: "User", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const response = getResponse(message);
    const botMessage = { sender: "HealthGuru 🤖", text: response };

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      speak(response);
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
      handleSendMessage(transcript);
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
          background: "linear-gradient(135deg, #e3f2fd, #90caf9)",
          color: "#333",
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
        background: "linear-gradient(135deg, #f8bbd0, #f48fb1)",
        color: "#333",
        padding: "20px",
        overflow: "hidden",
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
        <h1 style={{ textAlign: "center", marginBottom: "10px", fontSize: "28px", color: "#333" }}>HealthGuru</h1>

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
                color: msg.sender === "HealthGuru 🤖" ? "#1a73e8" : "#333",
                fontStyle: msg.sender === "HealthGuru 🤖" ? "italic" : "normal",
                fontWeight: "bold",
                margin: "5px 0",
              }}
            >
              <strong>{msg.sender}: </strong>
              {msg.text}
            </p>
          ))}
        </div>

        {serviceMode === "typing" ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <button
              onClick={() => {
                handleSendMessage(inputText);
                setInputText("");
              }}
              style={buttonStyle}
            >
              Send
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={startListening}
              style={{
                background: isListening ? "#ffcc00" : "#007bff",
                color: "#ffffff",
                border: "none",
                padding: "10px 30px",
                borderRadius: "50px",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              {isListening ? "Listening..." : "Tap to Speak 🎙️"}
            </button>
          </div>
        )}
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
