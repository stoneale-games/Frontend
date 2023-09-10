import React from 'react';
import table from "../assets/table.png";

const Homepage = () => {
    return (
        <div>

            <section className="flex justify-center w-full">
                <div className="flex flex-col items-center text-secondary-950">
                    <div className="flex gap-1 items-center text-6xl"><span>CRYPT</span><img src={table} alt="table chips" className='h-12' /></div>
                    <span className='text-5xl'>Poker</span>
                    <span className='text-xl'>Play crypto</span>
                </div>
            </section>
        </div>
    )
}

export default Homepage