"use client"

import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useRouter } from 'next/navigation'
import { useLogout } from "../../hooks/useLogout";
import { headers } from "next/headers";

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
        fetchData(user);
      }
  }, [user])

  
  return (
  <div className="h-screen flex flex-col bg-white">
    <div id="upper" className="bg-blue-700 flex-initial h-20">
      <svg></svg>
      <p></p>
    </div>
    <div id="main" className="bg-black flex-1">
    <button onClick={handleClick}>LogOut</button>
    </div>
  </div>
  )
}

