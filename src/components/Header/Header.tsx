import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { listenAuth, firebaseLogout } from "../../firebase/auth";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = listenAuth(setUser);
    return unsub;
  }, []);

  const onLogout = async () => {
    await firebaseLogout();

    // ✅ dọn các key localStorage cũ (để khỏi hiện user test)
    localStorage.removeItem("currentUser");
    localStorage.removeItem("keepLogin");
    localStorage.removeItem("users");
    localStorage.removeItem("movieWishlist");

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
          {user ? <span className="user">{user.displayName || user.email}</span> : null}
          {user ? (
            <button className="btn" onClick={onLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/** scroll opacity effect (demo 스타일 느낌)
 *  ✅ addEventListener는 한 번만 등록되도록 안전하게 처리
 */
let _headerScrollBound = false;
if (!_headerScrollBound) {
  _headerScrollBound = true;
  window.addEventListener("scroll", () => {
    const header = document.getElementById("appHeader");
    if (!header) return;
    const y = window.scrollY;
    header.style.background = y > 10 ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.25)";
    header.style.backdropFilter = "blur(10px)";
  });
}
