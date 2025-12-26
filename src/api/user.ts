import { http } from "./http";
export type MeRes = { user: { id: string; email: string; name: string; createdAt: string } };
export function me() { return http<MeRes>("/me"); }
