import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage = async ({
    params}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if(!profile) {
        return redirectToSignIn();
    }

    if(!params.inviteCode) {
        // 返回到根页面
        return redirect("/");
    }

    // 如果我们已经是服务器的成员，那么我们就不需要再次加入
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members:{
                some:{
                    profileId: profile.id
                }
            }
        }
    });
    if(existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    };

    // 更新服务器的邀请码
    const server = await db.server.update({
        where:{
            inviteCode: params.inviteCode
        },
        data:{
            members:{
                create:[
                   {
                    profileId: profile.id
                   } 
                ]
            }
        }
    });

    if(server) {
        return redirect(`/servers/${server.id}`);
    }


    return null;
}
 
export default InviteCodePage;