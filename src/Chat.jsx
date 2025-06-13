import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import styled from "styled-components";

const PickerWrapper = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: #222;
  padding: 8px;
`;

const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export default function Chat({ messages, onSend }) {
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <ChatContainer>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.user}:</strong> {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv ett meddelande..."
        />
        <button type="button" onClick={() => setShowPicker((v) => !v)}>
          😊
        </button>
        <button type="submit">Skicka</button>
        {showPicker && (
          <PickerWrapper>
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </PickerWrapper>
        )}
      </form>
    </ChatContainer>
  );
}
