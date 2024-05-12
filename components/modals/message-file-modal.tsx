"use client";

import axios from 'axios';
import qs from "query-string"
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
    FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
    fileUrl: z.string().min(1,{
        message: '附件不能为空'
    })
})

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } =useModal();
    const router = useRouter();

    const isModalOpen = type === 'messageFile' && isOpen;
    const { apiUrl,query } = data;

    // 为什么form定义要在useEffect之前？ 
    const form = useForm({
        resolver: zodResolver(formSchema), // 使用zod来验证表单
        defaultValues: {
            fileUrl: '',
        }
    });

    const handleClose = () => {
            form.reset();
            onClose();
    }

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })

            await axios.post(url,{
                ...values,
                content: values.fileUrl,
            });
            
            form.reset();
            router.refresh();
            handleClose();

        } catch (error){
            console.error(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                        <DialogHeader className='pt-8 px-6'>
                            <DialogTitle className='text-2xl text-center font-bold'>
                                添加一个附件
                            </DialogTitle>
                            <DialogDescription className='text-center text-zinc-500'>
                                发送文件到聊天
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} 
                            className='space-y-8'>
                                <div className='space-y-8 px-6'>
                                    <div className='flex items-center justify-center text-center'>
                                        <FormField
                                            control={form.control}
                                            name='fileUrl'
                                            render={({field}) =>(
                                                <FormItem>
                                                    <FileUpload 
                                                        endpoint= "messageFile"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        />
                                                </FormItem>
                                            )}/>
                                    </div>
                                </div>
                                <DialogFooter className='bg-gray-100 px-6 py-4'>
                                    <Button disabled={isLoading} variant='primary' >
                                        发送
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                </DialogContent>
        </Dialog>
    );
}

