import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav style={navContainer}>
      <NavLink
        to="/"
        style={({ isActive }) => linkStyle(isActive)}
      >
        홈
      </NavLink>
      <NavLink
        to="/schedule"
        style={({ isActive }) => linkStyle(isActive)}
      >
        시간표
      </NavLink>
      <NavLink
        to="/groups"
        style={({ isActive }) => linkStyle(isActive)}
      >
        그룹
      </NavLink>
      <NavLink
        to="/me"
        style={({ isActive }) => linkStyle(isActive)}
      >
        마이
      </NavLink>
    </nav>
  );
}

// Styles
const navContainer: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,

  /* PC에서도 앱처럼 중앙 정렬 유지 */
  maxWidth: 600,
  margin: "0 auto",

  /* Glassmorphism (반투명 블러 효과) */
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderTop: "1px solid var(--border)",

  padding: "12px 16px 24px", // 하단(아이폰 홈바 영역) 여유 공간 확보
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 8,
  zIndex: 1000,
};

const linkStyle = (active: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 0",
  borderRadius: 14,

  /* Active 상태일 때 연한 Primary 배경색 */
  background: active ? "rgba(99, 102, 241, 0.1)" : "transparent",

  /* Active 상태일 때 Primary 색상, 아니면 회색 */
  color: active ? "var(--primary)" : "#9ca3af",

  fontWeight: active ? 700 : 600,
  fontSize: 13,
  textDecoration: "none",
  transition: "all 0.2s ease",
});
