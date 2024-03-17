'use client'
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import connectSocket from "../../../hooks/useSocket";
import { useTargetContext } from '../../../hooks/useTargetContext';
import useCheck from '../../../hooks/useCheck';
import useCreateChat from '../../../hooks/useCreateChat';


const ChatWindow = () => {
    const {target, socket} = useTargetContext()
    const [msgs, setMsg] = useState([])
    const {user} = useAuthContext()
    const [currentCh, setChat] = useState()
    const check = useCheck(user, target);
    const createCh = useCreateChat()
    useEffect(() => {
        (async () => {
             const res = await check()
             
             if (!res) {
                (async () => {
                    const data = await createCh()
                    setChat(data)
                })()
             } else {
                setChat(res)
             }
        })()
    }, [])

    useEffect(() => {
        console.log(currentCh)
    },[currentCh])

    useEffect(() => {
        const receive = message => {
            setMsg((msgs) => [...msgs, message]);
        }
        socket.on("receive-message", receive);
        return () => socket.off("receive-message",receive);
    }, [])

    
    

    if (user) {
        return(
            <div className="flex bg-black-2 flex-col h-screen">
                <div className="border-black border-2 flex flex-initial items-center h-24">
                    <img src="/images/user2.svg" className="ml-4 rounded-full border-orange-500 border-2 
                    flex-initial w-20 h-20"></img>
                    <p className="h-12 text-lg font-bold text-orange-500 ml-8">{target}</p>
                </div>
                
                
                <TextArea user={user} msgs={msgs} setMsg={setMsg} socket={socket}></TextArea>
                
                <WriteArea user={user} msgs={msgs} setMsg={setMsg} socket={socket} target={target}></WriteArea>
            </div>
        )
    }
}

const TextArea = ({socket, msgs, setMsg, user}) => {
    return (
        <div className="bg-black flex-1 text-white flex flex-col gap-2 overflow-scroll">
           {msgs.map((msg, index) => {
            return <Message key={index} username={user.username} msg={msg}></Message>
           })}
        </div>
    )
}

const Message = ({msg, username}) => {

    return (
        <div className={(msg.sender == username) ? 'sent' : "received"} >{msg.text}</div>
    )
}

const WriteArea = ({socket, target, msgs, setMsg, user}) => {
    const [text, setTxt] = useState("")
    const submit = (event) => {
        event.preventDefault()
        const newMsg = {text:text, sender:user.username}
        setMsg((msgs) => [...msgs, newMsg])
        socket.emit("send-message", newMsg, target)
        
        setTxt("")
    }

    return (
      
        <form onSubmit={(e) => submit(e)} className="flex items-center gap-4  border-t border-orange-500
         rounded-t-lg justify-evenly bg-red-2 min-h-16">
            <textarea name="msg" value={text} onChange={(e) => setTxt(e.target.value)} 
            className="rounded-lg bg- border-orange-500 border-2 block min-h-8
            flex-1 max-w-sm overflow-auto ml-4 text-sm input"></textarea>
            <button type="submit"><img className="h-8 w-8 mr-2" src="/images/send.svg"></img></button>
        </form>
    )
}

export default ChatWindow;