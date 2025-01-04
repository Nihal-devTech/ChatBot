import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, genResponse }) => {
  //receiving prop
  const inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim(); //removing white spaces
    if (!userMessage) return;
    inputRef.current.value = "";
    //updating chat history with the user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    setTimeout(() => {
      //Add a thinking message
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "thinking..." },
      ]);
      //call the function to generate bot response
      genResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details above Please address your issues: ${userMessage}`,
        },
      ]);
    }, 200);
  };

  return (
    <>
      <form action="#" className="chat-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Message..."
          className="message-input"
          required
        />

        <button className="material-symbols-outlined">Arrow_upward</button>
      </form>
    </>
  );
};

export default ChatForm;
