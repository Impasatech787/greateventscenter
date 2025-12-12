import { verifyToken, authorize } from "./auth";
import { NextResponse } from "next/server";

export function withAuth(handler: Function, roles: string[] = []) {
  return async (req: Request, ctx: any) => {
    const params = await ctx.params;
    const authHeader = req.headers.get("authorization");
    const user = verifyToken(authHeader);

    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (roles.length && !authorize(user, roles))
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    return handler(req, params, user);
  };
}
