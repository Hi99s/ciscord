"use client";
import { Fragment } from "react";
import { Member } from "@/types/member";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";

import { ChatWelcome } from "./chat-welcome";


type MessageWithMemberWithProfile = Message & {
    member: Member & {
      profile: Profile
    }
    }


interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
  }

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    });
    // 根据状态渲染不同的 UI
    if (status === "loading") {
        return (
          <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              消息加载中...
            </p>
          </div>
        )
      }
    
      if (status === "error") {
        return (
          <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              出错了！
            </p>
          </div>
        )
      }
    

    return (
        <div className="flex flex-col flex-1 py-4 overflow-y-auto">
            <div className="flex-1"></div>
            <ChatWelcome name={name} type={type} />
            <div className="flex flex-col-reverse mt-auto">
            <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {
                group.items.map((message: MessageWithMemberWithProfile) => (
                    <div key={message.id}>
                        { message.content}
                    </div>
                ))
            }
          </Fragment>
        ))}
      </div>
            </div>
        </div>
    )
};