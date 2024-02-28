import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
    const profile = await initialProfile();
    
    const server = await db.server.findFirst({
        where: {
            members:{
                some:{
                    profileId: profile.id
                }
            }
        }
    });
    // 如果有服务器，就重定向到服务器页面
    if(server){
        return redirect(`/server/${server.id}`);
    }


    return <div>用户创建一个服务器</div>;
}
 
export default SetupPage;