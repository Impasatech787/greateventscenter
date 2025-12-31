import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt, {
  JsonWebTokenError,
  SignOptions,
  TokenExpiredError,
} from "jsonwebtoken";
import crypto from "crypto";

export const runtime = "nodejs";

type RefreshBody = {
  accessToken?: string;
  refreshToken?: string;
};

type AccessPayload = {
  userId: string;
  email?: string;
  roles?: string[];
  sid: string;
};
type RefreshPayload = { userId: string; sid: string };

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as RefreshBody;
    const accessToken = body.accessToken;
    const refreshToken = body.refreshToken;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "accessToken and refreshToken are required" },
        { status: 400 },
      );
    }

    const accessSecret =
      process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET!;
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET!;

    // 1) Verify refresh token (must be valid and NOT expired)
    const refreshDecoded = jwt.verify(
      refreshToken,
      refreshSecret,
    ) as RefreshPayload;

    // 2) Verify access token signature but ignore expiration
    const accessDecoded = jwt.verify(accessToken, accessSecret, {
      ignoreExpiration: true,
    }) as AccessPayload;

    // 3) Ensure token pair matches
    if (
      !refreshDecoded?.userId ||
      !refreshDecoded?.sid ||
      refreshDecoded.userId !== accessDecoded.userId ||
      refreshDecoded.sid !== accessDecoded.sid
    ) {
      return NextResponse.json(
        { error: "Token pair mismatch" },
        { status: 401 },
      );
    }

    const { userId, sid } = refreshDecoded;

    // 4) Check session exists and refresh token matches stored hash
    const session = await prisma.session.findUnique({ where: { sid } });
    if (!session || session.revoked || session.userId !== Number(userId)) {
      return NextResponse.json({ error: "Session invalid" }, { status: 401 });
    }

    const incomingHash = sha256(refreshToken);
    if (incomingHash !== session.refreshTokenHash) {
      // Refresh token reuse detected => revoke session
      await prisma.session.update({ where: { sid }, data: { revoked: true } });
      return NextResponse.json(
        { error: "Refresh token invalid (reused)" },
        { status: 401 },
      );
    }

    // 5) Ensure user still valid (optional but recommended)
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Please verify your email before signing in." },
        { status: 403 },
      );
    }

    const roles = user.userRoles.map((r) => r.role.name);

    // 6) Issue NEW access token
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, roles, sid },
      accessSecret,
      {
        expiresIn:
          (process.env.TOKEN_EXPIRATION as NonNullable<
            SignOptions["expiresIn"]
          >) ?? "1d",
      },
    );

    // 7) Rotate refresh token (NEW refresh token every refresh)
    const newRefreshToken = jwt.sign({ userId: user.id, sid }, refreshSecret, {
      expiresIn:
        (process.env.REFRESH_TOKEN_EXPIRATION as NonNullable<
          SignOptions["expiresIn"]
        >) ?? "1d",
    });

    await prisma.session.update({
      where: { sid },
      data: { refreshTokenHash: sha256(newRefreshToken) },
    });

    // 8) Return both new tokens
    const response = NextResponse.json(
      {
        data: {
          authToken: newAccessToken,
          refreshToken: newRefreshToken,
          expires: Date.now() + 86400 * 1000,
          roles,
        },
        message: "Refreshed",
      },
      { status: 200 },
    );

    // // Optional: also set cookies if you want cookie-based auth
    // response.cookies.set("AuthToken", newAccessToken, {
    //   httpOnly: true,
    //   path: "/",
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    // });

    return response;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    if (err instanceof JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
