import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import "./SignIn.netflix.css";
import "./SignIn.upgrade.css"; // nếu bạn có file upgrade

export default function SignIn() {
  const nav = useNavigate();
  const { login, register, savedEmail } = useAuth();

  // false = SignIn, true = SignUp
  const [rightActive, setRightActive] = useState(false);

  // SignIn
  const [email, setEmail] = useState(savedEmail);
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(true);

  // SignUp
  const [rEmail, setREmail] = useState("");
  const [rPw, setRPw] = useState("");
  const [rPw2, setRPw2] = useState("");
  const [agree, setAgree] = useState(false);

  const onLogin = () => {
    const res = login(email, pw, remember);
    if (!res.ok) return toast.error(res.msg);
    toast.success("로그인 성공!");
    nav("/", { replace: true });
  };

  const onRegister = () => {
    if (!agree) return toast.error("약관 동의는 필수입니다.");
    if (rPw !== rPw2) return toast.error("비밀번호 확인이 일치하지 않습니다.");
    const res = register(rEmail, rPw);
    if (!res.ok) return toast.error(res.msg);

    toast.success("회원가입 성공! 로그인 해주세요.");
    // 요구사항: 회원가입 성공 시 로그인 화면으로
    setRightActive(false);
    setEmail(rEmail);
    setPw("");
  };

  return (
    <div className="auth-page">
      <Toaster position="top-right" />

      <div className={`auth-card ${rightActive ? "right-panel-active" : ""}`}>
        {/* =======================
            DESKTOP (Netflix overlay)
           ======================= */}
        <div className="desktop-auth">
          {/* SIGN UP */}
          <div className="form-container sign-up-container">
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <h1>Create Account</h1>

              <input placeholder="Email" value={rEmail} onChange={(e) => setREmail(e.target.value)} />
              <input type="password" placeholder="Password" value={rPw} onChange={(e) => setRPw(e.target.value)} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={rPw2}
                onChange={(e) => setRPw2(e.target.value)}
              />

              <label className="small-row">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                약관 동의 (필수)
              </label>

              <button type="button" className="primary" onClick={onRegister}>
                Sign Up
              </button>
            </form>
          </div>

          {/* SIGN IN */}
          <div className="form-container sign-in-container">
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <h1>Sign in</h1>

              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />

              <label className="small-row">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>

              <button type="button" className="primary" onClick={onLogin}>
                Sign In
              </button>
            </form>
          </div>

          {/* OVERLAY */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>이미 계정이 있나요?</p>
                <button type="button" className="ghost" onClick={() => setRightActive(false)}>
                  Sign In
                </button>
              </div>

              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>아직 계정이 없나요?</p>
                <button type="button" className="ghost" onClick={() => setRightActive(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =======================
            MOBILE (one frame horizontal swap)
           ======================= */}
        <div className="mobile-auth">
          <div className="mobile-inner">
            <div className="mobile-track">
              {/* PANEL 1: SIGN IN */}
              <div className="mobile-panel">
                <form className="mobile-form" onSubmit={(e) => e.preventDefault()}>
                  <h1>Sign in</h1>

                  <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />

                  <label className="small-row">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    Remember me
                  </label>

                  <button type="button" className="primary" onClick={onLogin}>
                    Sign In
                  </button>

                  <div className="mobile-switch">
                    Chưa có tài khoản?{" "}
                    <button type="button" onClick={() => setRightActive(true)}>
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>

              {/* PANEL 2: SIGN UP */}
              <div className="mobile-panel">
                <form className="mobile-form" onSubmit={(e) => e.preventDefault()}>
                  <h1>Create Account</h1>

                  <input placeholder="Email" value={rEmail} onChange={(e) => setREmail(e.target.value)} />
                  <input type="password" placeholder="Password" value={rPw} onChange={(e) => setRPw(e.target.value)} />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={rPw2}
                    onChange={(e) => setRPw2(e.target.value)}
                  />

                  <label className="small-row">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    약관 동의 (필수)
                  </label>

                  <button type="button" className="primary" onClick={onRegister}>
                    Sign Up
                  </button>

                  <div className="mobile-switch">
                    Đã có tài khoản?{" "}
                    <button type="button" onClick={() => setRightActive(false)}>
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
