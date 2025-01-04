import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/chatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { MindfulInfo } from "./components/MindfulInfo";
const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: MindfulInfo,
    },
  ]);
  const chatBodyRef = useRef(null);

  const updateChatHistory = (text) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "thinking..."),
      { role: "model", text },
    ]);
  };

  const genResponse = async (history) => {
    //Need to format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    console.log(history);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || "Something went wrong");
      }

      const apiResponse = data.candidates[0].content.parts[0].text
        .replace()
        .trim();
      updateChatHistory(apiResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behaviour: "smooth",
    });
  }, [chatHistory]);
  return (
    <>
      <div className="container">
        <div className="chatbot-popup">
          {/*ChatBot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">CHATBOT</h2>
            </div>
            <button className="material-symbols-outlined">
              keyboard_arrow_down
            </button>
          </div>
          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-msg">
              <ChatbotIcon />
              <p className="message-text">Hey There, whats Your Mood</p>
            </div>

            {chatHistory?.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>
          <div className="chat-footer">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              genResponse={genResponse}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default App;
