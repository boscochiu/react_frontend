import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface Message {
  id: number;
  message: string;
  reply: string | null;
  created_at: string;
}

const Messages: React.FC = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);


  const fetchMyMessages = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/messages/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch failed:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyMessages();
    }
  }, [token]);

  const sendMessage = async () => {
    if (!message.trim()) {
      setResponseMsg("請輸入訊息");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      if (!res.ok) {
        setResponseMsg(data.message);
        return;
      }

      setResponseMsg("訊息已發送 ✅");
      setMessage("");
      fetchMyMessages();
    } catch (error) {
      setResponseMsg("發送失敗");
    }
  };

  return (
    <div className="theater-background">
      <div className="home-header">
        <h1 className="theater-title">聯絡管理員</h1>

        <button
          className="premium-outline-button"
          onClick={() => navigate("/home")}
        >
          返回首頁
        </button>
      </div>

      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <textarea
          className="premium-input"
          style={{ width: "100%", height: "120px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="輸入你想說的..."
        />

        <button
          className="premium-button"
          style={{ marginTop: "10px" }}
          onClick={sendMessage}
        >
          發送
        </button>

        {responseMsg && (
          <p style={{ marginTop: "10px" }}>{responseMsg}</p>
        )}

        <div style={{ marginTop: "30px" }}>
          <h3>我的訊息紀錄</h3>

          {loading && <p>Loading...</p>}

          {!loading && messages.length === 0 && (
            <p>尚未發送任何訊息</p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: "#1f2430",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px"
              }}
            >
              <p>
                <strong>我：</strong> {msg.message}
              </p>

              <p style={{ fontSize: "12px", opacity: 0.6 }}>
                {new Date(msg.created_at).toLocaleString()}
              </p>

              {msg.reply && (
                <p style={{ color: "#c6b27a" }}>
                  <strong>管理員回覆：</strong> {msg.reply}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;