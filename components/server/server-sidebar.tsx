import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";

interface ServerSideBarProps {
    serverId: string;
}

export const ServerSidebar = async ({ serverId }: ServerSideBarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/"); // 重定向到登录页面
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc", // 按照创建时间升序排列
                },
            },
            members: {
                include: {
                    profile: true, // 获取与每个成员关联的个人资料
                },
                orderBy: {
                    role: "asc",
                },
            },
        },
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id); // 删除当前用户

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role; // 获取当前用户的角色

    return (<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader
        server={server}
        role={role}
        />
            </div>);
};
