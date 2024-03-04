import { v4 as uuidv4} from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";




export  async function POST(req: Request) {
    try{
    const {name,imageUrl} = await req.json();
    const profile = await currentProfile();
    
    // 如果没有profile，未授权
    if(!profile){
        return new NextResponse("Unauthorized", {status: 401});
    }

    // 创建服务器
    const server = await db.server.create({
        data: {
            profileId: profile.id,
            name,
            imageUrl,
            invitCode: uuidv4(), // 生成一个随机的邀请码
            // 创建频道和成员
            channels:{
                create: [{name: "general", profileId: profile.id}]
            },
            members:{
                create: [{profileId: profile.id,role: MemberRole.ADMIN}] // 初始成员将是管理员
            },
        }
    })
    return NextResponse.json(server);
    } catch (error){
        console.error("[SERVERS_POST]",error); // 告诉我哪个文件出错了 错误是什么
        return new NextResponse("Internal Error", {status: 500});

    }
}