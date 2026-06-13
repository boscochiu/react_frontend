import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("請填寫所有欄位");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("註冊成功 ✅ 即將跳轉登入頁");
      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      setMessage("伺服器錯誤");
    }
  };

  return (
    <div className="theater-background">
      <div className="login-card-wrapper">
        <div className="login-card-premium">
          <h1 className="theater-title">Create Account</h1>
          <p className="login-subtitle">Join the Cinema Experience</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="使用者名稱"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className="premium-input"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="premium-input"
            />

            <input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="premium-input"
            />

            <button type="submit" className="premium-button">
              註冊
            </button>
          </form>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}

          <button
            className="premium-outline-button"
            onClick={() => navigate("/")}
          >
            返回登入
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;