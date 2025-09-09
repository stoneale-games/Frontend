'use client';

import cpCoin2 from "@/assets/cp2.png";
import { ME } from "@/query-types/user";
import { useAuthQuery } from "@/hooks/useAuthQuery";

// Define the response type
// types/user.ts (or wherever you want)
export type MeQueryResult = {
    me: {
        id: string;
        walletAddress: string;
        username: string;
        email: string;
        chips: number;
    };
};


export const UserChipsAmount = () => {
    const [result] = useAuthQuery<MeQueryResult>({
        query: ME,
    });

    const { data, fetching, error } = result;

    if (fetching) return <p>Loading...</p>;
    if (error) return <p>User not authenticated</p>; // logout already handled

    return (
        <div className="flex gap-2 items-center">
            <img src={cpCoin2} alt="cp_coin" width={24} height={24} />
            <p>{data?.me?.chips ?? 0}</p>
        </div>
    );
};
