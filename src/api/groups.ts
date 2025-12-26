import { http } from "./http";

export type Group = { id: string; name: string; memberCount?: number };

export function listGroups() {
  // 네 백엔드가 /groups 목록 반환하도록 맞춰두면 됨
  return http<{ groups: Group[] }>("/groups");
}

export function createGroup(name: string) {
  return http<{ group: Group }>("/groups", { method: "POST", body: { name } });
}

export function addMember(groupId: string, userId: string) {
  // 네가 이미 쓰던 invite 형태
  return http<{ ok: true }>(`/groups/${groupId}/invite`, { method: "POST", body: { userId } });
}

export function getGroupMembers(groupId: string) {
  return http<{ members: Array<{ id: string; name: string; email: string; role: string; joinedAt: string }> }>(
    `/groups/${groupId}/members`
  );
}

export type TimetableGrid = Record<string, Record<string, { busy: string[]; free: string[]; ratio: number }>>;
export function getGroupTimetable(groupId: string) {
  return http<{ members: Array<{ id: string; name: string }>; grid: TimetableGrid }>(
    `/groups/${groupId}/timetable`
  );
}
