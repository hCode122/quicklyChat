"use client"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useRouter } from 'next/navigation'
import { useLogout } from "../../hooks/useLogout";
import start from "../../hooks/useSocket"
import useFetchChats from "../../hooks/useFetchChats";
import useFetchContacts from "../../hooks/useFetchContacts";
import ContactCard from "../../components/ContactCard";
import ChatCard from "../../components/ChatCard";
import MainComp from "../../components/MainComp";
import { render } from "react-dom";

export default function MainUi() {
  const [selected, setUi] = useState("chats")
  const [loggedUsr, setUsr] = useState("null")
  const router = useRouter();
  const {user} = useAuthContext();
 
  const socket = start()
  const [contacts, setContacts] = useState([])  
  const [chats, setChats] = useState([])  

 
  useEffect(() => {
    if (user) {
      setUsr(user)
      } else {
        router.push("/auth")
      }
      
  }, [user])
  


  const fetchContacts = useFetchContacts()
  const fetchChats = useFetchChats();
  useEffect(() => {
    const callFetch = async() => {
      if (loggedUsr.token != null) {
        const fetchedContacts = await fetchContacts(loggedUsr.token);
        const fetchedChats = await fetchChats(loggedUsr.token);
        console.log("chats")
        console.log(fetchedChats)
        console.log("contacts")
        console.log(fetchedContacts)

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
          return(<ContactCard key={el._id} name={el.name}/>)
        }):(<p>Loading...</p>)
      }
    </MainComp>
  )
  
}






