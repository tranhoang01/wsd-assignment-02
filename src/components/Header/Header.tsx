import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || "";

  const onLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("keepLogin");
    navigate("/signin");
  };

  return (
    <header className="appHeader" id="appHeader">
      <div className="inner">
        <Link to="/" className="logo">
          <span className="dot" />
          MovieFlix
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/popular" className={({ isActive }) => (isActive ? "active" : "")}>
            Popular
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
            Search
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "active" : "")}>
            Wishlist
          </NavLink>
        </nav>

        <div className="right">
          {currentUser ? <span className="user">{currentUser}</span> : null}
          {currentUser ? (
            <button className="btn" onClick={onLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

// scroll opacity effect (demo 스타일 느낌)
window.addEventListener("scroll", () => {
  const header = document.getElementById("appHeader");
  if (!header) return;
  const y = window.scrollY;
  header.style.background = y > 10 ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.25)";
  header.style.backdropFilter = "blur(10px)";
});
