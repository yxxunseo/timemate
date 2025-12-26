import { useState } from "react";
import { addMyClass } from "../../api/schedule";
import { useNavigate } from "react-router-dom";

// 타입 안전성을 위해 요일 타입 정의
type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export default function ScheduleForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    subjectName: "",
    professorName: "",
    room: "",
    day: "MON" as Day,
    startHour: 9,
    endHour: 10,
  });

  const handleChange = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.endHour <= form.startHour) return alert("종료 시간은 시작 시간보다 늦어야 해요");
    try {
      await addMyClass(form);
      nav("/schedule");
    } catch (e) {
      alert("저장 실패");
    }
  }

  return (
    <div style={{ padding: "20px 20px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>새 과목 추가</h2>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label style={label}>과목명</label>
          <input
            style={input}
            required
            placeholder="예) 공업수학"
            value={form.subjectName}
            onChange={e => handleChange("subjectName", e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>교수님</label>
            <input
              style={input}
              placeholder="이름"
              value={form.professorName}
              onChange={e => handleChange("professorName", e.target.value)}
            />
          </div>
          <div>
            <label style={label}>강의실</label>
            <input
              style={input}
              placeholder="호수"
              value={form.room}
              onChange={e => handleChange("room", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={label}>시간</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <select
              style={select}
              value={form.day}
              onChange={e => handleChange("day", e.target.value)}
            >
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
                <option
                  key={d}
                  value={d}
                >
                  {d}
                </option>
              ))}
            </select>
            <input
              style={input}
              type="number"
              min={9}
              max={23}
              value={form.startHour}
              onChange={e => handleChange("startHour", Number(e.target.value))}
            />
            <input
              style={input}
              type="number"
              min={10}
              max={24}
              value={form.endHour}
              onChange={e => handleChange("endHour", Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            style={cancelBtn}
            onClick={() => nav(-1)}
          >
            취소
          </button>
          <button
            type="submit"
            style={saveBtn}
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}

// Styles
const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--text-sub)",
  marginBottom: 6,
};

const inputStyleBase: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  fontSize: 15,
  color: "var(--text-main)",
  outline: "none",
};

const input: React.CSSProperties = { ...inputStyleBase };
const select: React.CSSProperties = { ...inputStyleBase, appearance: "none" };

const saveBtn: React.CSSProperties = {
  flex: 2,
  padding: 16,
  borderRadius: 14,
  border: 0,
  background: "var(--primary)",
  color: "white",
  fontSize: 16,
  fontWeight: 700,
  boxShadow: "0 4px 10px rgba(99, 102, 241, 0.4)",
};

const cancelBtn: React.CSSProperties = {
  flex: 1,
  padding: 16,
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "white",
  color: "var(--text-sub)",
  fontSize: 16,
  fontWeight: 700,
};
