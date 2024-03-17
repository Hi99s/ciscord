import { useEffect, useState } from 'react';

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    // 获取当前页面的原始地址
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    if (!mounted) return "";

    return origin;

}