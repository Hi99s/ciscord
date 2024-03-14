import { Profile, Server,Member } from "@prisma/client";

// 给频道加上成员和个人资料
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
}