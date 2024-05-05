"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { 
    ChevronDown,
    LogOut,
    PlusCircle,
    Settings,
    Trash,
    UserPlus, 
    Users
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";


interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModarator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none' asChild>
                <button
                    className='w-full text-md font-semibold px-3 flex
                items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                dark:hover:bg-zinc-700/50 transition'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto hidden md:block' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y[2px]'>
                {/* 添加邀请人的选项 只有管理员和版主可以这么做*/}
                {isModarator && (
                    <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
                        onClick={() => onOpen("invite",{ server })}>
                        邀请他人
                        <UserPlus className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'
                        onClick={() => onOpen("editServer",{ server })}>
                        服务器设置
                        <Settings className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("members",{ server })}>
                        管理成员
                        <Users className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {isModarator && (
                    <DropdownMenuItem
                     onClick={() => onOpen("createChannel")}
                     className='px-3 py-2 text-sm cursor-pointer'>
                        创建频道
                        <PlusCircle className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {/* 对于游客而言，这里只有一个item 那就是离开频道,所以不需要这个下划线 */}
                {isModarator && <DropdownMenuSeparator />}
                {isAdmin && (
                    <DropdownMenuItem 
                    onClick={() => onOpen("deleteServer",{ server })}
                    className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        删除服务器
                        <Trash className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem 
                    onClick={() => onOpen("leaveServer",{ server })}
                    className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        离开服务器
                        <LogOut className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
