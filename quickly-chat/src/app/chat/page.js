'use client'
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import connectSocket from "../../../hooks/useSocket";
import { useTargetContext } from '../../../hooks/useTargetContext';
import useCheck from '../../../hooks/useCheck';
import useCreateChat from '../../../hooks/useCreateChat';
import sendMessage from '../../../hooks/sendMessage';
import useLoadMessages from '../../../hooks/useLoadMessages';

const ChatWindow = () => {
    const {target, socket} = useTargetContext()
    const [msgs, setMsg] = useState([])
    const {user} = useAuthContext()
    const [currentCh, setChat] = useState()
    const check = useCheck(user, target);
    const createCh = useCreateChat(user, target)
    const loadMessages = useLoadMessages(user)
    const [allowLoadMore, setLoadMore] = useState(0)
    useEffect(() => {
        (async () => {
             const res = await check()
             if (!res & !currentCh) {
                const data = await createCh()
                setChat(data)
             } else {
                setChat(res)   
                const {messages, moreExists} = await loadMessages(0,res._id)
                setMsg(messages)
                setLoadMore(moreExists)
                
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

    
    

    if (user && currentCh) {
        return(
            <div className="flex bg-black-2 flex-col h-screen">
                <div className="border-black border-2 flex flex-initial items-center h-24">
                    <img src="/images/user2.svg" className="ml-4 rounded-full border-orange-500 border-2 
                    flex-initial w-20 h-20"></img>
                    <p className="h-12 text-lg font-bold text-orange-500 ml-8">{target}</p>
                </div>
                
                
                <TextArea user={user} msgs={msgs} setMsg={setMsg} loadMessages={loadMessages}
                chatID={currentCh._id} allowLoadMore={allowLoadMore} setLoadMore={setLoadMore}></TextArea>
                
                <WriteArea chatId={currentCh._id} user={user} msgs={msgs} setMsg={setMsg} socket={socket}
                target={target}></WriteArea>
            </div>
        )
    }
}

const TextArea = ({msgs, setMsg, loadMessages, user, chatID, allowLoadMore, setLoadMore}) => {
    const [depth, setDepth] = useState(1)
    return (
        <div className="bg-black flex-1 text-white flex flex-col gap-2 overflow-scroll">
            {allowLoadMore? <LoadMore depth={depth} setDepth={setDepth} loadMessages={loadMessages} 
            setMsg={setMsg} chatID={chatID} setLoadMore={setLoadMore} msgs={msgs}></LoadMore> : <></>}
           {msgs.map((msg, index) => {
            let day = ""
            let yesterday = ""
            let banner = "";
            
            if (msg && index == 0) {
                const firstDayV = new Date(msgs[0].date);
                const firstDay = firstDayV.toLocaleDateString("en", { weekday: 'long' });
                banner = firstDay;
            }

            if (msg && index != 0) {
                const dateVar = new Date(msg.date);
                day = dateVar.toLocaleDateString("en", { weekday: 'long' }); 
                const preDateVar = new Date(msgs[index-1].date);
                yesterday = preDateVar.toLocaleDateString("en", { weekday: 'long' });
                if (day == yesterday) 
                    {
                        // no need to re display a day banner if we are still
                        // in the same day       
                        banner = null
                    } else {
                        banner = day;
                    }
            }
            return (
                <>
                {banner != null ? <DayBanner day={banner}></DayBanner> : <></>}
                <Message key={index} username={user.username} msg={msg}></Message>
                </>
            )
           })}
        </div>
    )
}

// Used to display the name of the day the following messages where sent at
const DayBanner = ({day}) => {
    return(<div className="flex-1 text-center mt-2 mb-4
     text-orange-600 font-bold border-b-2 border-t-2 pb-2 border-orange-700"
    >{day}</div>)
}

const Message = ({msg, username}) => {
    const msgRef = useRef(null)
    const dateVar = new Date(msg.date)
    const timeSent = dateVar.getHours() + ":" + dateVar.getMinutes();
    const scrollToBottom = () => {
        setTimeout(() => {
            msgRef.current?.scrollIntoView({ behavior: "auto" })
        , 500})
    }

    useEffect(() => {
        scrollToBottom()
    }, [msg])
    return (
        <div ref={msgRef} className={(msg.
            senderName == username) ? 'sent' : "received"} >
                <p className={(msg.
            senderName == username) ? 'bg-orange-600' : "bg-black-3"}>{msg.text}</p>
                <p className='text-sm font-light time'>{timeSent}</p>
        </div>
    )
}

const WriteArea = ({chatId, socket, target, msgs, setMsg, user}) => {
    const [text, setTxt] = useState("")
    const submit = async (event) => {
        event.preventDefault()
        const date = new Date()
        const newMsg = {text:text, senderName:user.username, rec:target,
        chatId:chatId, date:date}
        
        const createdM = await sendMessage(newMsg, user);
        console.log(createdM)
        setMsg((msgs) => [...msgs, createdM])
        socket.emit("send-message", createdM, target)
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

const LoadMore = ({loadMessages,msgs, depth, setDepth, chatID, setMsg, setLoadMore}) => {
    const loadM = async () => {
        const {messages, moreExists} = await loadMessages(depth, chatID)
        setLoadMore(moreExists)
        const updatedArr = messages.concat(msgs)
        console.log(updatedArr)
        console.log(messages)
        setMsg(updatedArr)
        setDepth(() => {depth+1})
    }

    return (
        <div onClick={() => loadM()} className='flex-initial clickable text-center mt-2 rounded-lg
        w-24 bg-orange-500 text-black self-center'>
            <p>Load more</p>
        </div>
    )
}

export default ChatWindow;