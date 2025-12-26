// src/api/dashboard.ts
import { http } from "./http";

export type MeResponse = {
  user: { id: string; email: string; name: string; createdAt: string };
};

export type GroupsListResponse = {
  groups: Array<{ id: string; name: string; memberCount: number }>;
};

export type ReceivedFriendRequestsResponse = {
  requests: Array<{
    id: string;
    createdAt: string;
    from: { id: string; name: string; email: string };
  }>;
};

export async function fetchMe() {
  return http<MeResponse>("/me");
}

export async function fetchMyGroups() {
  // 네 백엔드에 맞춰서 경로만 바꾸면 됨
  // (예: /groups 내 그룹 목록 API)
  return http<GroupsListResponse>("/groups");
}

export async function fetchReceivedFriendRequests() {
  return http<ReceivedFriendRequestsResponse>("/friends/requests/received");
}
