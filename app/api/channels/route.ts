import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(
    req:Request
) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!serverId){
            return new NextResponse("Server ID missing", { status: 400 });
        }

        // 防止用户绕过前端验证
        if(name === "general"){
            return new NextResponse("Channel name cannot be 'general'", { status: 400 });
        }

        // 管理员和服务器主持人可以创建新频道
        const server = await db.Server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        });

        return NextResponse.json(server); // 返回新的服务器数据
    } catch (error) {
        console.error("CHANNELS_POST",error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}