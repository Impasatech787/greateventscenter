import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const authMiddleware = (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // Verify token and attach user payload to request object
    console.log("secret", process.env.JWT_SECRET!)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.nextUrl.searchParams.set("user", JSON.stringify(decoded));
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 403 });
  }
};