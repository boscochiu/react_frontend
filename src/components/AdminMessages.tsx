import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface Message {
  id: number;
  message: string;
  reply: string | null;
  email?: string;
}

const AdminMessages: React.FC = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  useEffect(() => {
    if (role !== "admin") return;

    const fetchMessages = async () => {
      const res = await fetch(
        "http://localhost:5000/api/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 403) {
        navigate("/home");
        return;
      }

      const data = await res.json();
      setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [role, token, navigate]);

  const sendReply = async (id: number) => {
    const reply = replyText[id];
    if (!reply) return;

    await fetch(
      `http://localhost:5000/api/messages/${id}/reply`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply })
      }
    );

    setReplyText({ ...replyText, [id]: "" });

    const res = await fetch(
      "http://localhost:5000/api/messages",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setMessages(data);
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("確定要刪除嗎？")) return;

    await fetch(
      `http://localhost:5000/api/messages/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const res = await fetch(
      "http://localhost:5000/api/messages",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setMessages(data);
  };

  if (role !== "admin") {
    return (
      <div className="theater-background">
        <div style={{ textAlign: "center", marginTop: "120px" }}>
          <h1 className="theater-title">❌ 沒有權限</h1>
          <button
            className="premium-button"
            onClick={() => navigate("/home")}
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (loading)
    return <div className="theater-title">Loading...</div>;

  return (
    <div className="theater-background">
      <div className="home-header">
        <h1 className="theater-title">管理員訊息中心</h1>

        <button
          className="premium-outline-button"
          onClick={() => navigate("/home")}
        >
          返回首頁
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="ticket-card"
            style={{ marginBottom: "20px", padding: "20px" }}
          >
            <p><strong>用戶：</strong>{msg.email}</p>
            <p><strong>訊息：</strong>{msg.message}</p>
            <p><strong>回覆：</strong>{msg.reply || "尚未回覆"}</p>

            <textarea
              placeholder="輸入回覆..."
              value={replyText[msg.id] || ""}
              onChange={(e) =>
                setReplyText({
                  ...replyText,
                  [msg.id]: e.target.value
                })
              }
              className="premium-input"
              style={{ width: "100%", marginTop: "10px" }}
            />

            <button
              className="premium-button"
              style={{ marginTop: "10px" }}
              onClick={() => sendReply(msg.id)}
            >
              發送回覆
            </button>

            <button
              className="premium-outline-button"
              style={{
                marginTop: "10px",
                backgroundColor: "#ff4d4f",
                color: "white"
              }}
              onClick={() => deleteMessage(msg.id)}
            >
              刪除訊息
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;