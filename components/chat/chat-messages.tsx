"use client";
import { Fragment,useRef,ElementRef } from "react";
import { format } from "date-fns";
import { Member } from "@/types/member";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";

const DATE_FORMAT = "d MMM yyyy, HH:mm";


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
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef< ElementRef<"div"> >(null);
    const bottomRef = useRef< ElementRef<"div"> >(null);


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

    useChatSocket({ queryKey,addKey,updateKey});
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
      })

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
        <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1"></div>}
            {!hasNextPage && <ChatWelcome name={name} type={type} />}
            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                    ) :(
                        <button
                            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 my-4 transition"
                            onClick={() => fetchNextPage()}
                        >
                            加载历史消息
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
            <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {   
                
                group.items.map((message: MessageWithMemberWithProfile) => (
                    // <div>{`创建时间： ${message.createdAt} 更新时间${message.updatedAt}`}</div>
                    <ChatItem 
                        key={message.id}
                        id={message.id}
                        currentMember={member}
                        member={message.member}
                        content={message.content}
                        fileUrl={message.fileUrl}
                        deleted={message.deleted}
                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                        isUpdated={message.updatedAt !== message.createdAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}/>
                ))
            }
          </Fragment>
        ))}
      </div>
            </div>
            <div  ref={bottomRef}/>
        </div>
    )
};