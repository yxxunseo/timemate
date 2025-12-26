import { useEffect, useState } from "react";
import { me } from "../../api/user";
import { listGroups } from "../../api/groups";
import { receivedRequests } from "../../api/friends";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const [meData, setMeData] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [reqCount, setReqCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [m, g, r] = await Promise.all([
          me(), 
          listGroups().catch(() => ({ groups: [] })), 
          receivedRequests()
        ]);
        setMeData(m.user);
        setGroups(g.groups ?? []);
        setReqCount(r.requests?.length ?? 0);
      } catch (e: any) {
        setErr(e?.message ?? "로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;
  if (err) return <div style={{ padding: 20 }}><ErrorBox message={err} /></div>;

  return (
    <div style={{ padding: "20px 20px 40px" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "var(--primary)" }}>TimeMate</div>
          <div style={{ color: "var(--text-sub)", fontSize: 14, marginTop: 4 }}>
             <strong>{meData?.name}</strong>님, 공강 찾으러 가볼까요?
          </div>
        </div>
        {reqCount > 0 && (
          <div style={badgeStyle} onClick={() => nav("/friends")}>
            요청 {reqCount}
          </div>
        )}
      </header>

      {/* 내 시간표 카드 */}
      <section style={cardStyle}>
        <div style={cardHead}>
          <div>
            <div style={cardTitle}>📅 내 시간표</div>
            <div style={cardDesc}>내 수업을 등록하면 그룹에 자동 반영돼요</div>
          </div>
          <button style={btnPrimary} onClick={() => nav("/schedule")}>보기</button>
        </div>
      </section>

      {/* 그룹 카드 */}
      <section style={cardStyle}>
        <div style={cardHead}>
          <div>
            <div style={cardTitle}>👥 그룹</div>
            <div style={cardDesc}>친구들과 겹치는 시간을 확인해보세요</div>
          </div>
          <button style={btnOutline} onClick={() => nav("/groups")}>관리</button>
        </div>

        {groups.length === 0 ? (
          <div style={emptyState}>아직 참여 중인 그룹이 없어요</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            {groups.slice(0, 3).map((g) => (
              <button key={g.id} style={listItem} onClick={() => nav(`/groups/${g.id}`)}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{g.name}</div>
                <div style={memberBadge}>멤버 {g.memberCount}명</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 친구 카드 */}
      <section style={cardStyle}>
        <div style={cardHead}>
          <div>
            <div style={cardTitle}> 친구 / 요청</div>
            <div style={cardDesc}>친구를 맺고 그룹에 초대하세요</div>
          </div>
          <button style={btnOutline} onClick={() => nav("/friends")}>친구 관리</button>
        </div>
      </section>
    </div>
  );
}

// Styles
const badgeStyle: React.CSSProperties = {
  fontSize: 12, padding: "6px 12px", borderRadius: 99,
  background: "var(--danger)", color: "white", fontWeight: 700,
  boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)", cursor: "pointer"
};

const cardStyle: React.CSSProperties = {
  marginBottom: 16, padding: 20, borderRadius: 20,
  background: "var(--surface)", 
  boxShadow: "var(--shadow-md)", border: "1px solid var(--border)"
};

const cardHead: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 };
const cardTitle: React.CSSProperties = { fontSize: 17, fontWeight: 700, color: "var(--text-main)" };
const cardDesc: React.CSSProperties = { fontSize: 13, marginTop: 4, color: "var(--text-sub)", lineHeight: 1.4 };

const btnPrimary: React.CSSProperties = {
  border: 0, borderRadius: 12, padding: "8px 16px",
  background: "var(--primary)", color: "white", fontWeight: 600, fontSize: 13,
  boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)"
};

const btnOutline: React.CSSProperties = {
  border: "1px solid var(--border)", borderRadius: 12, padding: "8px 16px",
  background: "transparent", color: "var(--text-main)", fontWeight: 600, fontSize: 13
};

const listItem: React.CSSProperties = {
  width: "100%", textAlign: "left",
  borderRadius: 14, border: 0,
  background: "#f3f4f6", padding: "12px 16px", 
  display: "flex", justifyContent: "space-between", alignItems: "center",
  transition: "background 0.2s"
};

const memberBadge: React.CSSProperties = {
  fontSize: 12, color: "var(--text-sub)", background: "rgba(0,0,0,0.05)",
  padding: "2px 8px", borderRadius: 6
};

const emptyState: React.CSSProperties = {
  marginTop: 16, padding: 16, textAlign: "center",
  borderRadius: 12, border: "1px dashed var(--border)",
  color: "var(--text-sub)", fontSize: 13
};