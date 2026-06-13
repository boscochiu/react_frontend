import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<Props> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [showVerify, setShowVerify] = useState<boolean>(false);

  const [tempToken, setTempToken] = useState<string>("");
  const [tempRole, setTempRole] = useState<string>("");


  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setTempToken(data.token);
      setTempRole(data.role);

      const code = generateVerificationCode();
      setGeneratedCode(code);
      setShowVerify(true);

    } catch (error) {
      alert("登入失敗");
    }
  };


  const handleVerify = () => {
    if (inputCode === generatedCode) {
      localStorage.setItem("token", tempToken);
      localStorage.setItem("role", tempRole);

      setIsLoggedIn(true);
      navigate("/home");
    } else {
      alert("驗證碼錯誤");
    }
  };

  return (
    <div className="theater-background">
      <div className="login-card-wrapper">
        <div className="login-card-premium">
          <h1 className="theater-title">CineVerse Premium</h1>

          {!showVerify ? (
            <form onSubmit={handleLogin}>
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
                進入戲院
              </button>
            </form>
          ) : (
            <div>
              <p>請輸入驗證碼</p>

              <p style={{ color: "#c6b27a", fontWeight: "bold" }}>
                驗證碼：{generatedCode}
              </p>

              <input
                type="text"
                placeholder="輸入驗證碼"
                value={inputCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputCode(e.target.value)
                }
                className="premium-input"
              />

              <button
                className="premium-button"
                onClick={handleVerify}
              >
                驗證
              </button>
            </div>
          )}

          <button
            type="button"
            className="premium-outline-button"
            onClick={() => navigate("/register")}
          >
            註冊新帳號
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;