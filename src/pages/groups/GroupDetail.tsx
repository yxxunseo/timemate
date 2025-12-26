import { useEffect, useMemo, useState } from "react";
import { getGroupMembers, getGroupTimetable } from "../../api/groups";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { useParams } from "react-router-dom";

const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"] as const;
const HOURS = Array.from({ length: 15 }, (_, i) => i + 9);

export default function GroupDetail() {
  const { id } = useParams();
  const [day, setDay] = useState<(typeof DAYS)[number]>("MON");
  const [members, setMembers] = useState<any[]>([]);
  const [grid, setGrid] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modal, setModal] = useState<null | { hour: number; busy: string[]; free: string[]; ratio: number }>(null);

  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const [m, t] = await Promise.all([getGroupMembers(id!), getGroupTimetable(id!)]);
        setMembers(m.members ?? []);
        setGrid(t.grid);
      } catch (e: any) {
        setErr(e?.message ?? "로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const dayGrid = useMemo(() => grid?.[day] ?? null, [grid, day]);

  if (loading) return <Loading />;
  if (err) return <div style={{ padding: 20 }}><ErrorBox message={err} /></div>;

  return (
    <div style={{ padding: "20px 20px 40px" }}>
      <header style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>그룹 시간표</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "var(--text-sub)" }}>
          <span style={{ width: 12, height: 12, background: "#fff", border: "1px solid #ccc", borderRadius: 3 }}></span> 여유
          <span style={{ width: 12, height: 12, background: "rgba(99, 102, 241, 0.5)", borderRadius: 3 }}></span> 50%
          <span style={{ width: 12, height: 12, background: "var(--primary)", borderRadius: 3 }}></span> 모두 수업
        </div>
      </header>

      {/* 요일 탭 (슬라이더 스타일) */}
      <div style={tabContainer}>
        {DAYS.map((d) => (
          <button key={d} onClick={() => setDay(d)} style={tabStyle(d === day)}>
            {d}
          </button>
        ))}
      </div>

      {/* 시간표 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HOURS.map((h) => {
          const cell = dayGrid?.[String(h)];
          const ratio = cell?.ratio ?? 0;
          
          return (
            <button
              key={h}
              style={timeRow(ratio)}
              onClick={() => setModal({ hour: h, busy: cell?.busy ?? [], free: cell?.free ?? [], ratio })}
            >
              <div style={{ width: 45, fontWeight: 700, fontSize: 14 }}>{h}:00</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                 {/* 게이지 바 시각화 */}
                 <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${ratio * 100}%`, height: "100%", background: ratio === 0 ? "transparent" : "var(--primary)" }}></div>
                 </div>
                 <div style={{ fontSize: 12, fontWeight: 600, opacity: ratio === 0 ? 0.3 : 1 }}>
                    {Math.round(ratio * 100)}%
                 </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 모달 (팝업) */}
      {modal && (
        <div style={overlay} onClick={() => setModal(null)}>
          <div style={modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{day}요일 {modal.hour}:00</div>
              <button style={closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={sectionTitle}>🔥 수업 있는 사람 ({modal.busy.length})</div>
              <div style={tagContainer}>
                {modal.busy.length 
                  ? modal.busy.map(name => <span key={name} style={busyTag}>{name}</span>) 
                  : <span style={emptyText}>없음</span>}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={sectionTitle}>🍀 공강인 사람 ({modal.free.length})</div>
              <div style={tagContainer}>
                {modal.free.length 
                  ? modal.free.map(name => <span key={name} style={freeTag}>{name}</span>) 
                  : <span style={emptyText}>없음</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const tabContainer: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", 
  background: "#f1f3f5", padding: 4, borderRadius: 14, marginBottom: 20
};

function tabStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1, padding: "8px 0", borderRadius: 10,
    background: active ? "white" : "transparent",
    color: active ? "var(--primary)" : "#868e96",
    fontWeight: 700, fontSize: 13, border: 0,
    boxShadow: active ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
    transition: "all 0.2s"
  };
}

function timeRow(ratio: number): React.CSSProperties {
  // 0이면 흰색, 1이면 진한 Primary, 중간은 opacity 조절
  const bg = ratio === 0 
    ? "var(--surface)" 
    : `rgba(var(--primary-rgb), ${0.05 + ratio * 0.25})`; // 배경은 연하게 깔아줌
    
  return {
    width: "100%", display: "flex", alignItems: "center",
    textAlign: "left", borderRadius: 16, padding: "14px 16px",
    border: ratio === 0 ? "1px solid var(--border)" : "1px solid transparent",
    background: bg,
    color: ratio > 0.6 ? "var(--primary)" : "var(--text-main)", // 짙어지면 글씨색도 primary로
    transition: "transform 0.1s"
  };
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
  display: "grid", placeItems: "center", padding: 20, zIndex: 999
};

const modalBox: React.CSSProperties = {
  width: "100%", maxWidth: 360, background: "white", borderRadius: 24, padding: 24,
  boxShadow: "var(--shadow-lg)", animation: "popIn 0.2s ease-out"
};

const modalHeader: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const closeBtn: React.CSSProperties = { background: "transparent", border: 0, fontSize: 18, color: "#999", padding: 4 };

const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: "var(--text-sub)", marginBottom: 8 };
const tagContainer: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6 };
const emptyText: React.CSSProperties = { fontSize: 13, color: "#ccc" };

const tagBase: React.CSSProperties = { fontSize: 13, padding: "6px 10px", borderRadius: 8, fontWeight: 600 };
const busyTag: React.CSSProperties = { ...tagBase, background: "#fee2e2", color: "#ef4444" }; // Red
const freeTag: React.CSSProperties = { ...tagBase, background: "#d1fae5", color: "#10b981" }; // Green