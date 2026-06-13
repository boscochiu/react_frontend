import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface FavoriteMovie {
  id: number;        // favorites.id
  movie_id: number;  // movies.id
  title: string;
  genre: string;
  year: number;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("token");

  // ✅ 如果沒有登入直接跳回首頁
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  }, [token, navigate]);

  // ✅ 讀取收藏（使用 JOIN 後會有 title/genre/year）
  const fetchFavorites = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        navigate("/");
        return;
      }

      const data = await res.json();
      setFavorites(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch favorites error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorites();
    }
  }, [token]);

  // ✅ 移除收藏（真正刪除資料庫）
  const removeFavorite = async (id: number) => {
    if (!window.confirm("確定要移除嗎？")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/favorites/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        // ✅ 同步更新畫面
        setFavorites((prev) =>
          prev.filter((movie) => movie.id !== id)
        );
      } else {
        alert("刪除失敗");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="theater-background">
      <div className="home-header">
        <h1 className="theater-title">我的收藏</h1>

        <button
          className="premium-outline-button"
          onClick={() => navigate("/home")}
        >
          返回首頁
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && favorites.length === 0 && (
        <p style={{ textAlign: "center" }}>
          尚未加入任何電影 🎬
        </p>
      )}

      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        {favorites.map((movie) => (
          <div
            key={movie.id}
            style={{
              background: "#1f2430",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <strong>{movie.title}</strong>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>
                {movie.genre} | {movie.year}
              </div>
            </div>

            <button
              className="premium-outline-button"
              onClick={() => removeFavorite(movie.id)}
            >
              移除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;