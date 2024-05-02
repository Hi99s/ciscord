"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CommandEmpty } from "cmdk";

interface ServerSearchProps {
   data:{
    label: string;
    type: "channel" | "member";
    data: {
        icon: React.ReactNode;
        name: string;
        id: string;
    }[] | undefined
   }[]
}

// 搜索labelMap
const labelMap = {
    "Text Channels": "文本频道",
    "Voice Channels": "语音频道",
    "Video Channels": "视频频道",
    "Members": "成员"
}


export const ServerSearch =  ({
    data
}: ServerSearchProps) => {
    const [open,setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    // 创建快捷键
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey))
                {
                    e.preventDefault();
                    setOpen((open) => !open);
                }
        }

        document.addEventListener("keydown",down);
        return () => document.removeEventListener("keydown",down);
    },[])

    const onClick = ({id,type}:{id:String, type: "channel" | "member"}) => {
        setOpen(false);
        console.log(type);
        debugger;
        if( type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }
        if(type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    }
return (
    <>
        <button 
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50
                dark:hover:bg-zinc-700/50 transition">
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
            <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600
                            dark:group-hover:text-zinc-300 transition">
                搜索
            </p>
            <kbd
                className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted
                            px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
            >
                <span className="text-xs">CTRL</span>K
            </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="从所有频道和成员中选择"/>
            <CommandList>
                <CommandEmpty>
                    暂无搜索结果
                </CommandEmpty>
                {data.map(({label,type,data}) => {
                    if(!data?.length) return null;

                    return(
                        <CommandGroup key={label} heading={labelMap[label]}>
                            {data?.map(({ id, icon, name}) => {
                                return(
                                    <CommandItem key={id} onSelect={() => onClick({id,type})}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
    </>
)
}