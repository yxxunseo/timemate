import { http } from "./http";

export type Day = "MON"|"TUE"|"WED"|"THU"|"FRI"|"SAT"|"SUN";

export type MyClass = {
  id: string;
  subjectName: string;
  professorName: string;
  room: string;
  day: Day;
  startHour: number; // 0~23
  endHour: number;   // 1~24
};

export function getMySchedule() {
  return http<{ items: MyClass[] }>("/schedule");
}

export function addMyClass(payload: Omit<MyClass, "id">) {
  return http<{ item: MyClass }>("/schedule", { method: "POST", body: payload });
}

export function deleteMyClass(id: string) {
  return http<{ ok: true }>(`/schedule/${id}`, { method: "DELETE" });
}
