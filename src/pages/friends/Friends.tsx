import { useEffect, useState } from "react";
import { acceptRequest, receivedRequests, sendFriendRequest } from "../../api/friends";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";

export default function Friends() {
  const [toUserId, setToUserId] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const r = await receivedRequests();
      setRequests(r.requests ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "로드 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onSend() {
    if (!toUserId.trim()) return;
    await sendFriendRequest(toUserId.trim());
    alert("요청 보냄!");
    setToUserId("");
  }

  async function onAccept(id: string) {
    await acceptRequest(id);
    load();
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>친구</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
        상대방이 수락해야 친구로 확정됨
      </div>

      <div style={card}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>ID로 친구 요청</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input style={input} placeholder="상대 userId" value={toUserId} onChange={(e) => setToUserId(e.target.value)} />
          <button style={btn} onClick={onSend}>보내기</button>
        </div>
      </div>

      {loading && <Loading />}
      {err && <ErrorBox message={err} />}

      <div style={{ marginTop: 12, fontWeight: 900 }}>받은 요청</div>
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {requests.map((r) => (
          <div key={r.id} style={card}>
            <div style={{ fontWeight: 900 }}>{r.from.name}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>{r.from.email}</div>
            <button style={btn} onClick={() => onAccept(r.id)}>수락</button>
          </div>
        ))}
        {!loading && requests.length === 0 && (
          <div style={{ color: "var(--muted)", padding: 12 }}>받은 요청이 없어요</div>
        )}
      </div>
    </div>
  );
}

const card: React.CSSProperties = { marginTop: 12, padding: 14, borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)" };
const input: React.CSSProperties = { padding: "12px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "var(--text)" };
const btn: React.CSSProperties = { marginTop: 10, border: 0, borderRadius: 12, padding: "10px 12px", background: "var(--accent)", color: "#0b0c10", fontWeight: 900 };
