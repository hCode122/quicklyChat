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
import { useTargetContext } from "../../hooks/useTargetContext";


export default function MainUi() {
  const [selected, setUi] = useState("chats")
  const [loggedUsr, setUsr] = useState("null")
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  
  const [contacts, setContacts] = useState([])  
  const [chats, setChats] = useState([])  

  
  const {user} = useAuthContext();
  const {setSoc} = useTargetContext()
  useEffect(() => {
    if (user) {
      setUsr(user)
      const socket = io('http://localhost:3003')

      const connect = () => {
        console.log('connecting')
        socket.emit("register", user.username, socket.id)
      }

      const disconnect = () => {
        socket.emit("leave",user.token)
      }
      socket.on("connect", connect)
      socket.on("disconnect", disconnect)

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
        setLoading(false)
      }

    } 
    callFetch()
  },[loggedUsr])
  

  return (    
    <MainComp selected={selected} setUi={setUi} user={loggedUsr.token}>
      {
        contacts[0] != null && selected=="contacts" ? contacts.map((el, index) => {
          return(
            <ContactCard user={user} name={el.name}/>
          )
        }) : chats[0] != null && selected=="chats" ? chats.map((el, index) => {
          return(
            <ChatCard key={el._id} name={el.recName}/>
          )
        }) : selected=="groubs" ?  
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






