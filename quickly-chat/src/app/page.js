"use client"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useRouter } from 'next/navigation'
import { useLogout } from "../../hooks/useLogout";
import Image from "next/image";
import start from "../../hooks/useSocket"
import useFetchChats from "../../hooks/useFetchChats";
import useFetchContacts from "../../hooks/useFetchContacts";


export default function MainUi() {
  const [chats, setChats] = useState([]);
  const [contacts, setcontacts] = useState([]);
  const [selected, setUi] = useState("chats")

  const router = useRouter();
  const {logout} = useLogout();

  const {user} = useAuthContext();
 
  const socket = start()
  const fetchChats = useFetchChats();
  const fetchContacts = useFetchContacts();
  
  useEffect(() => {
    if (user) {
        switch (selected) {
          case "chats":
            fetchChats(user.token)
            break;
          case "contacts":
            fetchContacts(user.token)
          case "groups":

          default:
            break;
        }
        
      } else {
        router.push("/auth")
      }
      
  }, [user, selected])
  
  return (

    <ChatsComponent selected={selected} setUi={setUi}>
      <ChatCard name={"Ahmad"} time={"19:20"} lastMsg={"كيفك شو الأخبار"}></ChatCard>
      <ChatCard name={"Alaa"} time={"08:00"} lastMsg={"Tesssst"}></ChatCard>

    </ChatsComponent>

    
  )
}

const renderChat = (data) => {
  data.forEach(element => {
    return(
      <ChatCard name={element.name} time={element.time} lastMsg={element.lastMsg}></ChatCard>
    )
  });
}

const ChatsComponent = ({selected, setUi, children}) => {


  return (
    <div className="h-screen flex flex-col bg-black-2">
      <div className="absolute bg-orange-500 h-16 w-60 border-orange-500 border-b rounded-b-full right-32 z-1"></div>
      <div className="bg-black"></div>
      <div id="upper" className=" flex-initial h-24 flex justify-center">
        <p className="w-40 text-black absolute h-10 text-2xl font-bold right-32 top-4 z-2">QuicklyChat</p>      
      </div>
      <div className="absolute top-8 clickable2  left-64"><img className="w-8 h-10 m-auto" src="/images/menu.svg"></img></div>
      <div>

      </div>
      <div className="grid grid-cols-3 grid-rows-1 text-orange-300 text-center text-lg font-semibold
       ">
        <button name="contacts" onClick={() =>setUi("contacts")}
       
        className={selected == "contacts" ? "active-btn col-start-1" : "base-btn col-start-1"}>
          <img className="w-14 h-14 m-auto" src='/images/contacts.svg'></img>
        </button>
      
        <button name="chats" onClick={() => setUi("chats")}
        className={selected == "chats" ? "active-btn col-start-2" : "base-btn col-start-2"}>
          <img className="w-14 h-14 m-auto" src='/images/msg.svg'></img>
        </button>
      
        <button name="groups" onClick={() =>setUi("groups")}
        className={selected == "groups" ? "active-btn col-start-3" : "base-btn col-start-3"}>

          <img className="w-14 h-14 m-auto" src='/images/group.svg'></img>
        </button>
      </div>

      <div id="main" className="bg-white flex flex-col flex-1">
        {children}
      </div>
    </div>
  )
}


const ContactsComponent = () => {
  <div className="flex flex-colomn">
    <div className="bg-white">
        <p className="bg-grey-300">right</p>
    </div>
    <div>
        <div className="">

        </div>
        <div>
          Name
        </div>
    </div>
  </div>
}


const ProfileComponent = () => {

}

const ChatCard = ({name, time, lastMsg,emitTest}) => {
  return(
    <div className="clickable flex-initial border-b-4 border-black bg-orange-500
     flex gap-2 flex-row h-16">
      <div className="bg-userPic1 bg-white border-2 border-black rounded-2xl  w-12 h-12 flex-initial mt-2  ml-2">

      </div>
      <div className="flex text-black-2 pt-1 flex-1 h-16 flex-col">
          <div className="flex flex-row gap-4 justify-between ">
              <div className="font-bold text-xl flex-1">{name}</div>
              <div className="font-bold  pt-1 mr-3 text-sm w-8">{time}</div>
          </div>
          <div className="overflow-hidden text flex-1">
            {lastMsg}
          </div>
          
      </div>
    </div>
  )
}