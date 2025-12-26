import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { deleteMyClass, getMySchedule } from "../../api/schedule";
import { useNavigate } from "react-router-dom";

export default function MySchedule() {
  const nav = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await getMySchedule();
      setItems(res.items ?? []);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: string) {
    if (!confirm("이 수업을 삭제할까요?")) return;
    await deleteMyClass(id);
    load();
  }

  return (
    <div style={{ padding: "20px 20px 80px" }}>
      <div style={header}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>내 과목</h2>
          <p style={{ color: "var(--text-sub)", fontSize: 13, margin: "4px 0 0" }}>
            등록된 과목 수: {items.length}개
          </p>
        </div>
        <button style={fab} onClick={() => nav("/schedule/new")}>＋ 추가</button>
      </div>

      {loading && <Loading />}

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {items.map((c) => (
          <div key={c.id} style={card}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={dayBadge}>{c.day}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>
                  {c.startHour}:00 - {c.endHour}:00
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 8 }}>{c.subjectName}</div>
              <div style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 4 }}>
                {c.professorName} · {c.room}
              </div>
            </div>
            <button style={delBtn} onClick={() => onDelete(c.id)}>삭제</button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div style={emptyBox}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📚</div>
            수업이 없어요.<br/>우측 상단 버튼을 눌러 추가해보세요!
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const header: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };

const fab: React.CSSProperties = {
  background: "var(--primary)", color: "white", border: 0,
  padding: "10px 18px", borderRadius: 20, fontWeight: 700, fontSize: 14,
  boxShadow: "0 4px 10px rgba(99, 102, 241, 0.4)"
};

const card: React.CSSProperties = {
  display: "flex", alignItems: "center",
  padding: 20, borderRadius: 20, background: "var(--surface)",
  border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)"
};

const dayBadge: React.CSSProperties = {
  background: "#f3f4f6", color: "#4b5563", fontSize: 11, fontWeight: 800,
  padding: "4px 8px", borderRadius: 6
};

const delBtn: React.CSSProperties = {
  background: "#fee2e2", color: "#ef4444", border: 0,
  padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 700,
  marginLeft: 10
};

const emptyBox: React.CSSProperties = {
  textAlign: "center", padding: 40, background: "#f1f3f5", borderRadius: 20,
  color: "#868e96", fontSize: 14, lineHeight: 1.5
};