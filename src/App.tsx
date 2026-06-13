import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Favorites from "./components/Favorites";
import Messages from "./components/Messages";
import AdminMessages from "./components/AdminMessages";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setCheckingAuth(false);
      return;
    }

  
    setIsLoggedIn(true);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/home" replace />
              : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route
          path="/home"
          element={
            isLoggedIn
              ? <Home setIsLoggedIn={setIsLoggedIn} />
              : <Navigate to="/" replace />
          }
        />

        {/* Favorites */}
        <Route
          path="/favorites"
          element={
            isLoggedIn
              ? <Favorites />
              : <Navigate to="/" replace />
          }
        />

        {/* Messages */}
        <Route
          path="/messages"
          element={
            isLoggedIn
              ? <Messages />
              : <Navigate to="/" replace />
          }
        />

        {/* Admin */}
        <Route
          path="/admin/messages"
          element={
            isLoggedIn
              ? <AdminMessages />
              : <Navigate to="/" replace />
          }
        />

        {/* ✅ 強制未知路徑回 Login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
