import React, { useState, useEffect } from "react";
import './App.css'; // For additional styling and animations

// Utility function to remove emojis
const removeEmojis = (text) => {
  return text.replace(/[🌀-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
};

function App() {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [serviceMode, setServiceMode] = useState(null); // Added service mode state
  const [inputText, setInputText] = useState(""); // For text input

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

  // Handle sending a message
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
      <div className="app-background">
        <div className="service-mode-container">
          <h1>Welcome to HealthGuru</h1>
          <h2>Choose your service mode</h2>
          <div className="button-group">
            <button onClick={() => setServiceMode("typing")} className="service-button">
              Typing
            </button>
            <button onClick={() => setServiceMode("speaking")} className="service-button">
              Speaking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-background">
      <div className="chat-container">
        <h1>HealthGuru</h1>

        <div className="chat-window">
          {messages.map((msg, idx) => (
            <p
              key={idx}
              className={msg.sender === "HealthGuru 🤖" ? "bot-message" : "user-message"}
            >
              <strong>{msg.sender}: </strong>
              {msg.text}
            </p>
          ))}
        </div>

        {serviceMode === "typing" ? (
          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="text-input"
            />
            <button
              onClick={() => {
                handleSendMessage(inputText);
                setInputText("");
              }}
              className="send-button"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="mic-container">
            <button onClick={startListening} className="mic-button">
              {isListening ? "Listening..." : "Tap to Speak 🎙️"}
            </button>
          </div>
        )}
      </div>

      <div className="floating-animations">
        <div className="balloon balloon1"></div>
        <div className="balloon balloon2"></div>
        <div className="balloon balloon3"></div>
      </div>
    </div>
  );
}

export default App;
