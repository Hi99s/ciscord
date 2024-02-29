"use client";
import { useState,useEffect } from 'react';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { useForm } from 'react-hook-form';
import { log } from 'console';

const formSchema = z.object({
    name: z.string().min(1,{
        message: '服务器名称不能为空'
    }),
    imageUrl: z.string().min(1,{
        message: '服务器头像不能为空'
    })
})

export const InitialModal = () => {
    const [isMounted,setIsMounted] = useState(false);
        useEffect(() => {
        setIsMounted(true);
    },[]);
    // 为什么form定义要在useEffect之前？ 
    const form = useForm({
        resolver: zodResolver(formSchema), // 使用zod来验证表单
        defaultValues: {
            name: '',
            imageUrl: '',
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        console.log(values);
    }

    if(!isMounted){
        return null;
    }
    return (
        <Dialog open>
                <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                        <DialogHeader className='pt-8 px-6'>
                            <DialogTitle className='text-2xl text-center font-bold'>
                                自定义你的服务器
                            </DialogTitle>
                            <DialogDescription className='text-center text-zinc-500'>
                                给你的服务器起个有个性的名称和头像吧！不用担心，在之后你随时可以更改它们.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} 
                            className='space-y-8'>
                                <div className='space-y-8 px-6'>
                                    <div className='flex items-center justify-center text-center'>
                                        TODO: 上传图片
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>服务器名称</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} 
                                                           className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                           placeholder='输入服务器名称'
                                                           {...field}>
                                                     </Input>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
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

