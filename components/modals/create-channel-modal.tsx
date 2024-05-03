"use client";

import qs from "query-string";
import axios from 'axios';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ChannelType } from '@prisma/client';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from '@/components/ui/form';
import { Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue
} from "@/components/ui/select"
import { useEffect } from "react";

// 频道类型对应字典
const ChannelTypeDict = {
    [ChannelType.TEXT]: "文本",
    [ChannelType.AUDIO]: "语音",
    [ChannelType.VIDEO]: "视频",
}



const formSchema = z.object({
    name: z.string().min(1,{
        message: '频道名不能为空'
    }).refine(
        name => name !== "general",
        {
            message: "频道名不能为'general'"
        }
    ),
    type:z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
    const {isOpen, onClose,type,data} = useModal(); 
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === 'createChannel';
    const { channelType } = data;


    // 为什么form定义要在useEffect之前？ 
    const form = useForm({
        resolver: zodResolver(formSchema), // 使用zod来验证表单
        defaultValues: {
            name: '',
            type:  channelType || undefined, // 默认值为undefined
        }
    });

    useEffect(() => {
        if(channelType){
            form.setValue('type',channelType);
        }
        else{
            form.setValue('type',undefined);
        }
    },[channelType,form]);

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params?.serverId
                }
            });
            await axios.post(url,values);
            
            form.reset();
            router.refresh();
            onClose();
        } catch (error){
            console.error(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open = {isModalOpen} onOpenChange={handleClose}>
                <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                        <DialogHeader className='pt-8 px-6'>
                            <DialogTitle className='text-2xl text-center font-bold'>
                                创建频道
                            </DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} 
                            className='space-y-8'>
                                <div className='space-y-8 px-6'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>频道名称</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} 
                                                           className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                           placeholder='输入频道名称'
                                                           {...field}>
                                                     </Input>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                    control={form.control}
                                    name='type'
                                    render={
                                        ({field}) => (
                                            <FormItem>
                                                <FormLabel>频道类型</FormLabel>
                                                <Select  
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                    <SelectTrigger
                          className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                        >
                                                            <SelectValue placeholder="请选择频道类型"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(ChannelType).map(type => (
                                                            <SelectItem key={type} value={type} className='capitalize'>
                                                                {ChannelTypeDict[type]}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )
                                    }>

                                    </FormField>
                                </div>
                                <DialogFooter className='bg-gray-100 px-6 py-4'>
                                    <Button disabled={isLoading} variant='primary' >
                                        创造
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                </DialogContent>
        </Dialog>
    );
}

