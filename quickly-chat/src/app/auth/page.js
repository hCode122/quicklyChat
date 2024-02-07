"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import Link from 'next/link';

const Login = () => {

    return (
        <div className='flex-0 m-auto'>
            <form className='border-2 rounded-lg border-orange-300 flex flex-col bg-black content-center h-80 w-64' onSubmit={onSubmit}>
                <label className="text-red-600 ml-4 flex-1">{response}</label>
                <div className='ml-4  flex-1 flex flex-col' title='input'>
                    <label className='mt-2 pl-2 text-indigo-400'>User name :</label>
                    <input className='mt-2 w-52 rounded-2xl' name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        
                    <label className='pt-12 pl-2 text-indigo-400'>Password :</label>
                    <input className='mt-2 w-52 rounded-2xl' name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className='w-20 h-8 mt-8 mr-8 rounded-2xl bg-orange-400 self-end' type="submit">Submit</button>
                </div>

                <div className='flex-1 mt-2 flex flex-row justify-evenly items-center'>
                    
                    <a className="h-6 text-orange-600">Don't have an account? </a>
                    <Link href="/auth/signup" className="h-6 text-orange-600 bold ">Sign In!</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;