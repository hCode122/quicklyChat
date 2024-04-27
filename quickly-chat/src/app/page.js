"use client"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useRouter } from 'next/navigation'
import { useLogout } from "../../hooks/useLogout";
import { io } from "socket.io-client";
import useFetchChats from "../../hooks/useFetchChats";
import useFetchContacts from "../../hooks/useFetchContacts";
import ContactCard from "../components/ContactCard";
import ChatCard from "../components/ChatCard";
import MainComp from "../components/MainComp";
import { v4 as uuidv4 } from 'uuid';
import { useTargetContext } from "../../hooks/useTargetContext";

export default function MainUi() {
  const [selected, setUi] = useState("chats")
  const [loggedUsr, setUsr] = useState("null")
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  
  const [contacts, setContacts] = useState([])  
  const [chats, setChats] = useState()  
  const [connected, setConnected] = useState(false)
  const [update, setUpdate] = useState(0)
  const {user} = useAuthContext();
  const [socket,setSocState] = useState()
  const {setSoc} = useTargetContext()
  useEffect(() => {
    if (user) {
      setUsr(user)
      setConnected(true)
      const socket = io('http://localhost:3003')
      const connect = () => {
        socket.emit("register", user.username, socket.id)
      }

      const disconnect = () => {
        socket.emit("leave",user.token)
      }
      socket.on("connect", connect)
      socket.on("disconnect", disconnect)
    
      setSocState(socket)
      setSoc(socket)
      return () => {
        socket.off('connect', connect);
        socket.off('disconnect', disconnect);
      }
      
      } else {
        router.push("/auth")
    }
      
  },[])
  
  const fetchContacts = useFetchContacts()
  const fetchChats = useFetchChats();

  
  useEffect(() => {
    const callFetch = async() => {
      if (loggedUsr.token != null) {
        setLoading(true)
        const fetchedContacts = await fetchContacts(loggedUsr.token);
        const fetchedChats = await fetchChats(loggedUsr.token);
        fetchedContacts && setContacts(fetchedContacts);
        fetchedChats && setChats(fetchedChats);
        console.log(fetchedChats)
        setLoading(false)
      }
    } 
    callFetch()
  },[loggedUsr, update])

  const receive = (message) => {
    try {
      let currChats = {...chats}
      let sender = message.senderName
     
        currChats[sender].unreadCount =  currChats[sender].unreadCount + 1
        currChats[sender].lastM = message
        currChats[sender].key = uuidv4()
        setChats(currChats)
      
    } catch (e) {
      console.log(e)
    }
    
  }

  useEffect(() => {
    if (socket) {
      socket.once("receive-message", receive)
    }
  },[chats])

  
  return (    
    <MainComp selected={selected} setUi={setUi} user={loggedUsr.token}>
      {
        contacts && selected=="contacts" ? contacts.map((el, index) => {
          
          return(
            <ContactCard user={user} name={el.name}/>
          )
        }) : chats && selected=="chats" ? Object.keys(chats).map((el, index) => {
          console.log(el)
          return(
            <ChatCard  key={chats[el].key} name={el} lastM={chats[el].lastM} count={chats[el].unreadCount}/>
          )
        }) : selected=="groups" ?  
          (
            <p>Coming Soon...</p>
          )
        : loading ? (<img src="/images/loader.svg" className="w-16 h-16 m-auto"></img>) : (
          <p>No data</p>
        )
      }
    </MainComp>
  )
  
}






