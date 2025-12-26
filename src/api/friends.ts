import { http } from "./http";

export function sendFriendRequest(toUserId: string) {
  return http<{ request: any }>("/friends/request", { method: "POST", body: { toUserId } });
}

export function receivedRequests() {
  return http<{ requests: Array<{ id: string; createdAt: string; from: { id: string; name: string; email: string } }> }>(
    "/friends/requests/received"
  );
}

export function acceptRequest(requestId: string) {
  return http<{ ok: true }>(`/friends/requests/${requestId}/accept`, { method: "POST" });
}

export function rejectRequest(requestId: string) {
  return http<{ ok: true }>(`/friends/requests/${requestId}/reject`, { method: "POST" });
}

export function myFriends() {
  // 네 백엔드에 엔드포인트가 다르면 바꿔줘
  return http<{ friends: Array<{ id: string; name: string; email: string }> }>("/friends");
}
