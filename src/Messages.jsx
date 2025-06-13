import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Messages() {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/messages")
      .then((res) => res.json())
      .then((data) => {
        // Filtering messages using the username from our params
        setMessages(data.filter((msg) => msg.user === username));
      });
  }, [username]);

  return (
    <div>
      <h2>Alla meddelanden från {username}</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <strong>{msg.user}:</strong> {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
