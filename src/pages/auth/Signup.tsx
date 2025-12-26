import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import ErrorBox from "../../components/ErrorBox";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, pw);
      // 로그인 성공 시 홈으로 이동 (새로고침 없이)
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "로그인에 실패했어요.");
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <div style={header}>
          <h1 style={logo}>TimeMate</h1>
          <p style={desc}>친구들과 시간표를 맞춰보세요</p>
        </div>

        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {err && <ErrorBox message={err} />}

          <div>
            <label style={label}>이메일</label>
            <input
              style={input}
              type="email"
              placeholder="example@timemate.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={label}>비밀번호</label>
            <input
              style={input}
              type="password"
              placeholder="비밀번호 입력"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
          </div>

          <button style={btn}>로그인</button>
        </form>

        <div style={footer}>
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            style={link}
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

// Styles
const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: "#f8f9fa",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 400,
  padding: 32,
  borderRadius: 24,
  background: "white",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  border: "1px solid #e5e7eb",
};

const header: React.CSSProperties = { textAlign: "center", marginBottom: 32 };
const logo: React.CSSProperties = { fontSize: 28, fontWeight: 900, color: "var(--primary)", margin: 0 };
const desc: React.CSSProperties = { fontSize: 14, color: "#6b7280", marginTop: 8 };

const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#4b5563",
  marginBottom: 6,
};
const input: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  fontSize: 15,
  outline: "none",
  transition: "border 0.2s",
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: 16,
  borderRadius: 14,
  border: 0,
  marginTop: 8,
  background: "var(--primary)",
  color: "white",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
};

const footer: React.CSSProperties = { marginTop: 24, textAlign: "center", fontSize: 14, color: "#6b7280" };
const link: React.CSSProperties = { color: "var(--primary)", fontWeight: 700, marginLeft: 4 };
