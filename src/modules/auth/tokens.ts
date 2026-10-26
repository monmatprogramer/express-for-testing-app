type Role = "ADMIN" | "TENANT";
export interface AccessClaims {
  sub: string;
  role: Role;
  sid: string;
}
export function signAccessToken(claims: AccessClaims): string {}
