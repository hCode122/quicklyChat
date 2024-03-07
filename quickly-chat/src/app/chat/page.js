'use client'
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import connectSocket from "../../../hooks/useSocket";
import { useTargetContext } from '../../../hooks/useTargetContext';
const ChatWindow = () => {
    const {target} = useTargetContext()
    
    console.log(target)
    const [socket, setSocket] = useState()
    const {user} = useAuthContext()
    useEffect(() => {
        if (user)
        {
            const socket = connectSocket()     
            setSocket(socket)      
        }
    },[user])
    
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
            <WriteArea socket={socket} user={user.username}></WriteArea>
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

const WriteArea = ({socket, user}) => {
    const [msg, setMsg] = useState("")
    const submit = (event) => {
        event.preventDefault()
        socket.emit("send-message", msg, user)

    }

    return (
      
        <form onSubmit={submit} className="flex items-center gap-4  border-t border-orange-500
         rounded-t-lg justify-evenly bg-red-2 min-h-16">
            <textarea name="msg" value={msg} onChange={(e) => setMsg(e.target.value)} 
            className="rounded-lg bg- border-orange-500 border-2 block min-h-8
            flex-1 max-w-sm overflow-auto ml-4 text-sm input"></textarea>
            <button type="submit"><img className="h-8 w-8 mr-2" src="/images/send.svg"></img></button>
        </form>
    )
}

export default ChatWindow;