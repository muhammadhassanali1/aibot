import React, { useState, useEffect } from "react";

// Utility function to remove emojis
const removeEmojis = (text) => {
  return text.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
};

function App() {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);

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

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "linear-gradient(135deg, #89cff0, #6a5acd)",
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
        {/* Welcome Header */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "28px",
            color: "#ff4c4c",
            fontWeight: "bold",
          }}
        >
          Welcome to HealthGuru 🎉
        </h1>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "18px",
            color: "#4caf50",
            fontWeight: "normal",
          }}
        >
          Your Personal Health Guide 🌟
        </h2>

        {/* Chat Window */}
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
                color: msg.sender === "HealthGuru 🤖" ? "#4caf50" : "#333",
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

        {/* Speak Button */}
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
            {isListening ? "Listening..." : "Speak"}
            <span role="img" aria-label="microphone">
              🎙️
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
