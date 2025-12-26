import { useEffect, useState } from "react";
import { createGroup, listGroups } from "../../api/groups";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const nav = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await listGroups();
      setGroups(res.groups ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "조회 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate() {
    if (!name.trim()) return;
    const res = await createGroup(name.trim());
    setName("");
    nav(`/groups/${res.group.id}`);
  }

  return (
    <div style={{ padding: "20px 20px 80px" }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>그룹 관리</h1>
        <p style={{ color: "var(--text-sub)", fontSize: 14, marginTop: 4 }}>
          새로운 그룹을 만들거나 기존 그룹을 확인하세요.
        </p>
      </header>

      {/* 새 그룹 생성 */}
      <div style={createCard}>
        <input 
          style={input} 
          placeholder="새 그룹 이름 입력..." 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onCreate()}
        />
        <button style={btn} onClick={onCreate}>만들기</button>
      </div>

      {loading && <Loading />}
      {err && <div style={{ marginTop: 20 }}><ErrorBox message={err} /></div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
        {groups.map((g) => (
          <button key={g.id} style={listItem} onClick={() => nav(`/groups/${g.id}`)}>
            <div style={groupIcon}>{g.name.slice(0, 1)}</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{g.name}</div>
              <div style={{ color: "var(--text-sub)", fontSize: 13 }}>멤버 {g.memberCount}명</div>
            </div>
            <div style={{ color: "var(--primary)", fontSize: 20 }}>›</div>
          </button>
        ))}
        {!loading && groups.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-sub)", marginTop: 40 }}>
            생성된 그룹이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const createCard: React.CSSProperties = {
  display: "flex", gap: 8, padding: 8,
  background: "var(--surface)", borderRadius: 16,
  boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)"
};

const input: React.CSSProperties = {
  flex: 1, border: 0, outline: "none", fontSize: 15, padding: "0 12px",
  background: "transparent", color: "var(--text-main)"
};

const btn: React.CSSProperties = {
  border: 0, borderRadius: 10, padding: "10px 16px",
  background: "var(--primary)", color: "white", fontWeight: 700, fontSize: 14,
  boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)", whiteSpace: "nowrap"
};

const listItem: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", gap: 12,
  padding: 16, borderRadius: 18,
  background: "var(--surface)", border: "1px solid var(--border)",
  boxShadow: "var(--shadow-sm)"
};

const groupIcon: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 14,
  background: "#e0e7ff", color: "var(--primary)",
  display: "grid", placeItems: "center",
  fontWeight: 800, fontSize: 18
};