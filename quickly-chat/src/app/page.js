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
        const fetchedContacts = await fetchContacts(loggedUsr.token);
        const fetchedChats = await fetchChats(loggedUsr.token);
        setContacts(fetchedContacts)
        setChats(fetchedChats)
      }

    }
    callFetch()
  },[loggedUsr])
  

  return (    
    <MainComp selected={selected} setUi={setUi} user={loggedUsr.token}>
      {
        chats.length > 0 ? chats.map((el, index) => {
          return(<ChatCard key={el._id} name={el.name}/>)
        }) : contacts.length > 0 ? contacts.map((el, index) => {
          return(<ContactCard key={el._id} user={user} name={el.name}/>)
        }):(<img src="/images/loader.svg" className="w-16 h-16 m-auto"></img>)
      }
    </MainComp>
  )
  
}






