export default function Loading({ label = "불러오는 중…" }: { label?: string }) {
  return <div style={{ color: "var(--muted)", padding: 12 }}>{label}</div>;
}
