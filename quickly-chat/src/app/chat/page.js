'use client'

import { useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";

const ChatWindow = () => {
    const {user} = useAuthContext()
    
    if (user) {
    return(
        <div className="flex bg-black-2 flex-col h-screen">
            <div className="border-black border-2 flex flex-initial items-center h-24">
                <img src="/images/user2.svg" className="ml-4 rounded-full border-orange-500 border-2 
                flex-initial w-20 h-20"></img>
                <p className="h-12 text-lg font-bold text-orange-500 ml-8">{user.username}</p>
            </div>
            
            <div className="bg-black flex-1 overflow-scroll">
                
            </div>
            <WriteArea></WriteArea>
        </div>
    )
    }
}

const TextArea = () => {
    

    return (
        <div>

        </div>
    )
}

const WriteArea = () => {
    const [msg, setMsg] = useState("")
    const submit = (event) => {
        event.preventDefault()


    }

    return (
      
        <form className="flex items-center gap-4  border-t border-orange-500
         rounded-t-lg justify-evenly bg-red-2 min-h-16">
            <textarea name="msg" value={msg} onChange={(e) => setMsg(e.target.value)} 
            className="rounded-lg bg- border-orange-500 border-2 block min-h-8
            flex-1 max-w-sm overflow-auto ml-4 text-sm input"></textarea>
            <submit><img className="h-8 w-8 mr-2" src="/images/send.svg"></img></submit>
        </form>
    )
}

export default ChatWindow;