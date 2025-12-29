import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!; // Same used during token generation

export interface AuthUser {
  userId: string;
  id: string;

  email: string;
  roles: string[]; // Must exist in JWT token as claim
}

type AuthTokenPayload = jwt.JwtPayload & AuthUser;

// Extract & verify token
export function verifyToken(authHeader: string | null): AuthUser | null {
  //verify token with jwt also check expiration
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    if (!decoded.id && decoded.userId) decoded.id = String(decoded.userId);
    return decoded;
  } catch {
    return null;
  }
}

// Authorization wrapper similar to [Authorize(Roles="Admin")]
export function authorize(user: AuthUser | null, allowedRoles: string[]) {
  if (!user) return false;

  return allowedRoles.some((r) => user.roles.includes(r));
}
