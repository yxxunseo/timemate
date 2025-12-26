export default function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", color: "#ff6b6b" }}>
      {message}
    </div>
  );
}
