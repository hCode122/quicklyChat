"use client"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useRouter } from 'next/navigation'
import { useLogout } from "../../hooks/useLogout";
import Image from "next/image";

export default function MainUi() {
  const [chats, setChats] = useState([]);
  const [contacts, setcontacts] = useState([]);

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
  <div className="h-screen flex flex-col bg-white">
    
    <div id="upper" className="bg-blue-700 gap-5 grid grid-rows-5 grid-cols-5 flex-initial h-24">
      
        <svg className="row-start-1 bg-userPic1 bg-no-repeat h-24" ></svg>
      
      <p className="col-start-3  row-start-2  text-2xl  text-orange-400 font-bold">Username</p>
    </div>

    <div className="grid grid-rows1 grid-cols-3 gap-5 text-center">
      <p className="col-start-1  bg-orange-400 ml-2">
        Contacts
      </p>
      <p className="col-start-2  bg-orange-400">
        Chats
      </p>
      <p className="col-start-3  bg-orange-400 mr-2">
        Stuff
      </p>
    </div>

    <div id="main" className="bg-black flex-1">

    </div>
  </div>
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