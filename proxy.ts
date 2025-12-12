import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH = "/back_office";
const ADMIN_LOGIN = "/back_office/login";
const COOKIE_NAME = "AuthToken";

type AppJwtPayload = JwtPayload & {
  roles?: string[];
};

function redirect(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.nextUrl.origin));
}
function getAdminStatus(req: NextRequest): "Admin" | "NO_TOKEN" {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return "NO_TOKEN";

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AppJwtPayload;

    return decoded.roles?.includes("Admin") ? "Admin" : "NO_TOKEN";
  } catch {
    return "NO_TOKEN";
  }
}

export default function Proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const status = getAdminStatus(req);

  if (pathname === ADMIN_LOGIN) {
    if (status === "Admin") return redirect(req, ADMIN_PATH);
    return NextResponse.next();
  }

  if (pathname.startsWith(ADMIN_PATH)) {
    if (status === "Admin") return NextResponse.next();
    return redirect(req, ADMIN_LOGIN);
  }

  return NextResponse.next();
}
export const config = {
  matcher: "/back_office/:path*",
};
