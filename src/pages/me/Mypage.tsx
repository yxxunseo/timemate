import { useEffect, useState } from "react";
import { me } from "../../api/user";
import { logout } from "../../api/auth";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const nav = useNavigate();
  const [u, setU] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me().then(res => setU(res.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div style={{ padding: "20px 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>마이페이지</h2>

      <div style={profileCard}>
        <div style={avatar}>{u?.name?.[0] ?? "U"}</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{u?.name}</div>
        <div style={{ color: "var(--text-sub)", fontSize: 14, marginTop: 4 }}>{u?.email}</div>
        <div style={idBadge}>@{u?.id}</div>
      </div>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        <button style={menuItem} onClick={() => alert("준비 중입니다!")}>🔔 알림 설정</button>
        <button style={menuItem} onClick={() => alert("준비 중입니다!")}>🔒 비밀번호 변경</button>
      </div>

      <button
        style={logoutBtn}
        onClick={() => { logout(); nav("/login", { replace: true }); }}
      >
        로그아웃
      </button>
    </div>
  );
}

// Styles
const profileCard: React.CSSProperties = {
  display: "flex", flexDirection: "column", alignItems: "center",
  padding: 30, borderRadius: 24, background: "var(--surface)",
  boxShadow: "var(--shadow-md)", border: "1px solid var(--border)"
};

const avatar: React.CSSProperties = {
  width: 80, height: 80, borderRadius: "50%", background: "#e0e7ff",
  color: "var(--primary)", fontSize: 32, fontWeight: 800,
  display: "grid", placeItems: "center", marginBottom: 16
};

const idBadge: React.CSSProperties = {
  marginTop: 12, padding: "4px 10px", borderRadius: 20,
  background: "#f3f4f6", color: "var(--text-sub)", fontSize: 12, fontWeight: 600
};

const menuItem: React.CSSProperties = {
  width: "100%", padding: 16, borderRadius: 16, background: "var(--surface)",
  border: "1px solid var(--border)", textAlign: "left", fontSize: 15, fontWeight: 600,
  color: "var(--text-main)"
};

const logoutBtn: React.CSSProperties = {
  marginTop: 40, width: "100%", padding: 16, borderRadius: 16,
  background: "transparent", border: 0, color: "var(--danger)",
  fontWeight: 700, fontSize: 15, textDecoration: "underline"
};