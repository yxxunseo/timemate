import { http, tokenStore } from "./http";

export type AuthUser = { id: string; email: string; name: string };
export type LoginRes = { token: string; user: AuthUser };
export type SignupRes = { user: { id: string; email: string; name: string; createdAt: string } };

export async function signup(email: string, name: string, password: string) {
  return http<SignupRes>("/auth/signup", { method: "POST", body: { email, name, password }, auth: false });
}

export async function login(email: string, password: string) {
  const res = await http<LoginRes>("/auth/login", { method: "POST", body: { email, password }, auth: false });
  tokenStore.set(res.token);
  return res;
}

export function logout() {
  tokenStore.clear();
}
