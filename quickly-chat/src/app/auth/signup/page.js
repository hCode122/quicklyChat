"use client"
import { useState } from 'react';
import Link from 'next/link';

const Signup = () => {

    return (
        <div className='flex-0 m-auto'>
            <form className='border-2 rounded-lg border-orange-300 flex flex-col bg-black content-center h-92 w-64' onSubmit={onSubmit}>
                <div className='ml-4 mt-4 flex-1 flex flex-col' title='input'>
                    <label className="text-red-600">{response}</label>
                    <label className='mt-8 pl-2 text-indigo-400'>User name :</label>
                    <input className='mt-2 w-52 rounded-2xl' name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        
                    <label className='pt-12 pl-2 text-indigo-400'>Password :</label>
                    <input className='mt-2 w-52 rounded-2xl' name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    
                    <label className='pt-12 pl-2 text-indigo-400'>Verify Password :</label>
                    <input className='mt-2 w-52 rounded-2xl' name="passwordVer" type="password" value={passwordV} onChange={(e) => setPasswordV(e.target.value)} />

                    <div className='mt-8 flex-1 flex flex-row justify-evenly items-center'>
                        <Link href="/auth" className="h-6 text-orange-600 bold ">Login</Link>
                        <button className='w-20 h-8 m-4 mr-8 rounded-2xl bg-orange-400 self-end' type="submit">Submit</button>
                    </div>     
                </div>

                
            </form>
        </div>
    );
}

export default Signup;