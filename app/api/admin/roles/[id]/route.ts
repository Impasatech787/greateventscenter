import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const id = Number("2");
    const role = await prisma.role.findUnique({
        where: {id: id}
    });
    if(!role)
        return NextResponse.json({ error: "Role not found" }, { status: 404 });

    const data = {
      id: role.id,
      name: role.name,
      isSystem: role.isSystem,
      createdAt: role.createdAt
    };
    return NextResponse.json({ data, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const DELETE = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id);
    const role = await prisma.role.findUnique({
        where: {id: id}
    });
    if(!role){
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    if(role.isSystem){
        return NextResponse.json({ error: "Cannot delete system role" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);

export const PATCH = withAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id);
    const role = await prisma.role.findUnique({
        where: {id}
    });
    if(!role){
        return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    if(role.isSystem){
        return NextResponse.json({ error: "Cannot update system role" }, { status: 400 });
    }
    const body = await req.json();
    const { name } = body;
    await prisma.role.update({ where: { id }, data: { name }});
    
    return NextResponse.json({ data: id, message: "Success!" }, { status: 200 });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}, ["Admin"]);