import jwt from "jsonwebtoken";

import { NextRequest, NextResponse } from "next/server";
const ADMIN_PATH = "/back_office";
const ADMIN_LOGIN = "/back_office/login";

const adminVerify = (req: NextRequest) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  console.log(token);
  if (!token) {
    const admin_login_Url = new URL(ADMIN_LOGIN, req.nextUrl.origin);
    return NextResponse.redirect(admin_login_Url);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decoded);
    return NextResponse.next();
  } catch {
    const homeUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(homeUrl);
  }
};

export default function Proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // if (pathname === ADMIN_LOGIN) {
  //   return NextResponse.next();
  // }
  //
  // if (pathname.startsWith(ADMIN_PATH)) {
  //   return adminVerify(req);
  // }

  return NextResponse.next();
}
export const config = {
  matcher: "/back_office/:path*",
};
