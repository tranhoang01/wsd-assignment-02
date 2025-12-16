import { useEffect, useMemo, useState } from "react";

type User = { id: string; password: string };

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const KEEP_LOGIN_KEY = "keepLogin";
const SAVED_EMAIL_KEY = "savedEmail";
const TMDB_KEY_STORAGE = "TMDb-Key"; // 과제 예시와 동일

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function useAuth() {
  const [users, setUsers] = useState<User[]>(() => safeParse<User[]>(localStorage.getItem(USERS_KEY), []));
  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem(CURRENT_USER_KEY) || "");
  const [keepLogin, setKeepLogin] = useState<boolean>(() => localStorage.getItem(KEEP_LOGIN_KEY) === "true");

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(CURRENT_USER_KEY, currentUser);
    else localStorage.removeItem(CURRENT_USER_KEY);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(KEEP_LOGIN_KEY, String(keepLogin));
  }, [keepLogin]);

  const isLoggedIn = useMemo(() => Boolean(currentUser), [currentUser]);

  const register = (email: string, password: string) => {
    const id = email.trim();
    if (!isValidEmail(id)) return { ok: false, msg: "이메일 형식이 아닙니다." };
    if (password.length < 4) return { ok: false, msg: "비밀번호는 최소 4자 이상 권장입니다." };

    const exists = users.some((u) => u.id === id);
    if (exists) return { ok: false, msg: "이미 존재하는 계정입니다." };

    setUsers((prev) => [...prev, { id, password }]);
    return { ok: true, msg: "회원가입 성공! 로그인 해주세요." };
  };

  const login = (email: string, password: string, rememberMe: boolean) => {
    const id = email.trim();
    if (!isValidEmail(id)) return { ok: false, msg: "이메일 형식이 아닙니다." };

    const user = users.find((u) => u.id === id && u.password === password);
    if (!user) return { ok: false, msg: "아이디 또는 비밀번호가 올바르지 않습니다." };

    // 과제 요구: 비밀번호를 TMDB API Key로 저장 (예시 코드와 유사)
    localStorage.setItem(TMDB_KEY_STORAGE, user.password);

    setCurrentUser(user.id);
    setKeepLogin(rememberMe);

    if (rememberMe) localStorage.setItem(SAVED_EMAIL_KEY, user.id);
    else localStorage.removeItem(SAVED_EMAIL_KEY);

    return { ok: true, msg: "로그인 성공!" };
  };

  const logout = () => {
    setCurrentUser("");
    // keepLogin은 유지해도 되지만, 여기서는 로그아웃 시 false로
    setKeepLogin(false);
  };

  const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || "";

  return { users, currentUser, isLoggedIn, keepLogin, savedEmail, setKeepLogin, register, login, logout };
}
