import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface Props {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: React.FC<Props> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const userRole = localStorage.getItem("role") || "";
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newRating, setNewRating] = useState("");
  const token = localStorage.getItem("token");
  const fetchMovies = async () => {
    const params = new URLSearchParams();

    if (searchTitle) params.append("title", searchTitle);
    if (searchGenre) params.append("genre", searchGenre);
    if (searchYear) params.append("year", searchYear);
    if (sortBy) {
      params.append("sortBy", sortBy);
      params.append("order", order);
    }

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await fetch(
      `http://localhost:5000/api/movies?${params.toString()}`
    );
    const data = await res.json();
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchMovies();
  };
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setFavoritesCount(data.length));
  }, [token]);

  
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(
      "http://localhost:5000/api/users/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      }
    );

    const data = await res.json();

    if (res.ok) {
      setProfilePhoto(data.filename);
      alert("Upload successful ✅");
    } else {
      alert(data.message);
    }
  };


  const addToFavorites = async (movieId: number) => {
    if (!token) {
      alert("請先登入");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/favorites/${movieId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setFavoritesCount((prev) => prev + 1);
    }
  };

  const addMovie = async () => {
    if (!newTitle || !newGenre || !newYear) {
      alert("請填寫所有欄位");
      return;
    }

    const res = await fetch("http://localhost:5000/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newTitle,
        genre: newGenre,
        year: newYear,
        rating: newRating
      })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setNewTitle("");
      setNewGenre("");
      setNewYear("");
      setNewRating("");
      fetchMovies();
    }
  };


  const deleteMovie = async (id: number) => {
    if (!window.confirm("確定要刪除這部電影？")) return;

    const res = await fetch(
      `http://localhost:5000/api/movies/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      setMovies((prev) => prev.filter((m) => m.id !== id));
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="theater-background">
      <div className="home-header">
        <div className="header-left">
          <button
            className="premium-outline-button"
            onClick={() => navigate("/favorites")}
          >
            我的收藏 ({favoritesCount})
          </button>

          <button
            className="premium-outline-button"
            onClick={() => navigate("/messages")}
          >
            聯絡管理員
          </button>

          {/* ✅ 訊息管理一定存在（只要 role 是 admin） */}
          {userRole === "admin" && (
            <button
              className="premium-outline-button"
              onClick={() => navigate("/admin/messages")}
            >
              訊息管理
            </button>
          )}
        </div>

        <h1 className="theater-title">CineVerse Premium</h1>

<div style={{ display: "flex", alignItems: "center" }}>
  
 {profilePhoto && (
  <img
    key={profilePhoto}
    src={`http://localhost:5000/uploads/${profilePhoto}`}
    alt="Profile"
    width="60"
    height="60"
    style={{
      borderRadius: "50%",
      marginRight: "10px",
      objectFit: "cover"
    }}
  />
)}

  <input
    type="file"
    onChange={handleUpload}
    style={{ marginRight: "10px" }}
  />

  <button className="logout-button" onClick={handleLogout}>
    登出
  </button>

</div>
      </div>

      {/* ✅ 搜尋 */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>搜尋電影</h2>
        <input
          placeholder="片名"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          placeholder="類型"
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
        />
        <input
          placeholder="年份"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        />
        <button className="premium-button" onClick={handleSearch}>
          搜尋
        </button>
      </div>

      {/* ✅ Admin 新增電影 */}
      {userRole === "admin" && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2>新增電影</h2>
          <input
            placeholder="電影名稱"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            placeholder="類型"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
          <input
            placeholder="年份"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
          />
          <input
            placeholder="評分"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
          />
          <button className="premium-button" onClick={addMovie}>
            新增
          </button>
        </div>
      )}

      {/* ✅ 電影列表 */}
      <div className="ticket-container">
        {movies.map((movie) => (
          <div className="ticket-card" key={movie.id}>
            <div className="ticket-info">
              <p>{movie.title}</p>
              <span>
                {movie.genre} | {movie.year} | ⭐ {movie.rating || 0}
              </span>
              <br />

              <button
                className="premium-button"
                onClick={() => addToFavorites(movie.id)}
              >
                加入收藏
              </button>

              {userRole === "admin" && (
                <button
                  style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
                  onClick={() => deleteMovie(movie.id)}
                >
                  刪除電影
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;