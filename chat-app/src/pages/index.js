import { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8081/ask", {
        message: input,
      });
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: "เกิดข้อผิดพลาดในการรับข้อมูล" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[message.type]}`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.loading}`}>
              กำลังพิมพ์...
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            ส่ง
          </button>
        </form>
      </div>
    </div>
  );
}
