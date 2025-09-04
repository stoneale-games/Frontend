'use client';

import cpCoin2 from "@/assets/cp2.png";
import { useQuery } from 'urql';
import {ME} from "@/query-types/user.ts";



export const UserChipsAmount = () => {
    const [result] = useQuery({
        query:ME,
    });

    const { data, fetching, error } = result;


    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;


    return (
        <div className="flex gap-2 items-center">
            <img src={cpCoin2} alt="cp_coin" width={24} height={24} />
            <p>{data.me.chips ?? 0}</p>
        </div>
    );
};
