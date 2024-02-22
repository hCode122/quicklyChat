"use client"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useRouter } from 'next/navigation'
import { useLogout } from "../../hooks/useLogout";
import Image from "next/image";

export default function MainUi() {
  const [chats, setChats] = useState([]);
  const [contacts, setcontacts] = useState([]);
  const [activeUi, setUi] = useState("Chat")
  const router = useRouter();
  const {logout} = useLogout();
  const handleClick = () => {
    logout()
  }

  const {user} = useAuthContext();

  useEffect(() => {
    if (user == null) {
      router.push("/auth")
      } else {
        
      }
  }, [user])

  
  return (

    <ChatsComponent>
      <ChatCard name="bob" time="19:15" lastMsg="Testing the texting, ha haaaaaaaaaaaaaaa!."></ChatCard>
    </ChatsComponent>
  
    
  )
}

const fetchData = async (user, setContacts, setChats) => {
 
  await fetch("http://localhost:3001/api/data",{
    headers: {
      "Authorization": "Bearer" + user.token
    }}).then(response => response.json()).then(data =>
      console.log(data)
    )
  
}

const ChatsComponent = (props) => {

  return (
    <div className="h-screen flex flex-col gap-1 bg-gradient-to-r from-indigo-600 to-indigo-700">
      
      <div id="upper" className=" flex-initial h-24 flex justify-center">
        <p className="w-40 h-10 text-orange-400 text-2xl mt-6 mr-8  border-b-2 border-white">Quickly Chat</p>
        
        
        
      </div>

      <div className="grid  grid-rows1 grid-cols-3 text-lg gap-5 text-center">
        <p className="col-start-1 rounded-lg text-white  pb-1 text-center bg-orange-400 ml-2">
          Contacts
        </p>
        <p className="col-start-2 rounded-lg text-white pb-1 bg-orange-400">
          Chats
        </p>
        <p className="col-start-3 rounded-lg border-2 border-orange-300 pb-1 text-center bg-white text-orange-700 mr-2">
          Stuff
        </p>
      </div>

      <div id="main" className="bg-white flex flex-colomn gap-5 flex-1">
        {props.children}
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

const ChatCard = ({name, time, lastMsg}) => {
  return(
    <div className="flex-1 border-b-4 border-orange-700 flex gap-2 flex-row h-16">
      <div className="bg-userPic1 border-2 border-orange-700  w-16 h-12 flex-initial mt-2  ml-2">

      </div>
      <div className="flex  flex-1 gap-1 h-16 flex-col">
          <div className="flex flex-row gap-4 justify-between ">
              <div className="text-orange-700 font-bold text-xl flex-1">{name}</div>
              <div className="font-bold text-indigo-500 pt-1 mr-3 text-sm w-8">{time}</div>
          </div>
          <div className="overflow-hidden text flex-1">
            {lastMsg}
          </div>
      </div>
    </div>
  )
}