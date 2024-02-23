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

  const selectTab = (choice) => {
      setUi(choice)
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
      <ChatCard name="سالم" time="19:15" lastMsg="كيفك "></ChatCard>
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
    <div className="h-screen flex flex-col bg-indigo-700">
      <div className="absolute bg-orange-500 h-16 w-60 border-orange-500 border-b rounded-b-full right-32 z-1"></div>
      <div id="upper" className=" flex-initial h-24 flex justify-center">
        <p className="w-40 text-black absolute h-10 text-2xl font-bold right-32 top-4 z-2">QuicklyChat</p>      
      </div>
      <div>

      </div>
      <div className="grid grid-cols-8 grid-rows-1 text-orange-300 text-center text-lg font-semibold ">
        <button className="col-span-2 text-center ml-2">
          Contacts
        </button>
        <div className="col-span-1 col-start-3 flex justify-center">
          <p className="flex-initial w-0.5 bg-orange-300"></p>
        </div>
        <button className="col-start-4 col-span-2 text-center" >
          Chats
        </button>
        <div className="col-span-1 col-start-6 flex justify-center">
          <p className="flex-initial w-0.5 bg-orange-300"></p>
        </div>
        <button className="col-start-7 col-span-2 text-center">
          Stuff
        </button>
      </div>

      <div id="main" className="bg-white flex flex-col flex-1">
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
    <div className="flex-initial border-b-4 border-black bg-gradient-to-r from-orange-700
    to-orange-400 flex gap-2 flex-row h-16">
      <div className="bg-userPic1 bg-white   border-2 border-black rounded-2xl  w-12 h-12 flex-initial mt-2  ml-2">

      </div>
      <div className="flex text-black pt-1 flex-1 h-16 flex-col">
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