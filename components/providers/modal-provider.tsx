"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/modals/create-server-modal";


export const ModalProvider = () => {
    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    // 如果没有挂载
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModal />
        </>
    );
}