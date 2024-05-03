import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";

interface ServerSideBarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash  className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]: <Mic  className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]: <Video  className="mr-2 h-4 w-4"/>
};

const roleIconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500"/>,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500"/>,
    [MemberRole.GUEST]: null
};

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
        <ScrollArea className="flex-1 px-3">
            <div className="mt-2">
                <ServerSearch 
                data={[
                    {
                        label: "Text Channels",
                        type: "channel",
                        data: textChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: "Voice Channels",
                        type: "channel",
                        data: audioChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: "Video Channels",
                        type: "channel",
                        data: videoChannels?.map((channel) => ({
                            id: channel.id,
                            name: channel.name,
                            icon: iconMap[channel.type],
                        }))
                    },
                    {
                        label: "Members",
                        type: "member",
                        data: members?.map((member) => ({
                            id: member.id,
                            name: member.profile.name,
                            icon: roleIconMap[member.role],
                        }))
                    }
                ]}/>
            </div>
            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
            {/* 会转化为布尔值 */}
            {!!textChannels?.length && (
                <div className="mb-2">
                    <ServerSection 
                    sectionType="channels"
                    channelType={ChannelType.TEXT}
                    role={role}
                    label="文本频道"
                    />
                    <div className="space-y-[2px]">
                    {textChannels.map((channel) => (
                        <ServerChannel 
                         key={channel.id}
                         role={role}
                         server={server}
                         channel={channel}/>
                    ))}
                    </div>
                </div>
            )}
            {!!audioChannels?.length && (
                <div className="mb-2">
                    <ServerSection 
                    sectionType="channels"
                    channelType={ChannelType.AUDIO}
                    role={role}
                    label="语音频道"
                    />
                    <div className="space-y-[2px]">
                    {audioChannels.map((channel) => (
                        <ServerChannel 
                         key={channel.id}
                         role={role}
                         server={server}
                         channel={channel}/>
                    ))}
                    </div>
                </div>
            )}
            {!!videoChannels?.length && (
                <div className="mb-2">
                    <ServerSection 
                    sectionType="channels"
                    channelType={ChannelType.VIDEO}
                    role={role}
                    label="视频频道"
                    />
                    <div className="space-y-[2px]">
                    {videoChannels.map((channel) => (
                        <ServerChannel 
                         key={channel.id}
                         role={role}
                         server={server}
                         channel={channel}/>
                    ))}
                    </div>
                </div>
            )}
            {!!members?.length && (
                <div className="mb-2">
                    <ServerSection 
                    sectionType="members"
                    role={role}
                    label="成员"
                    server={server}
                    />
                    <div className="space-y-[2px]">
                    {members.map((member) => (
                        <ServerMember 
                        key={member.id}
                        member={member}
                        server={server}
                        />
                    ))}
                    </div>
                </div>
            )}
        </ScrollArea>
            </div>);
};
