import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
};

export const ourFileRouter = {
    // 上传服务器头像
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // 链接到中间件
        .middleware(() => handleAuth())
    // 上传完成后的回调函数
        .onUploadComplete(() => {}),
    // 上传消息文件
    messageFile: f(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
