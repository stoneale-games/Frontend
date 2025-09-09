// src/hooks/useLogout.ts
import { useRouter } from '@tanstack/react-router';
import {removeCookie} from "@/lib/cookieHelper.ts";

export const useLogout = () => {
    const router = useRouter();

    return () => {
        removeCookie('token');
        console.log("removed this");
        router.navigate({ to: '/' , replace:true});
    };
};
