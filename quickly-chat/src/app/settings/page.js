'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
const { useAuthContext } = require("../../../hooks/useAuthContext")

const Settings = () =>{
    const {user} = useAuthContext()
    const [editName, setEditName] = useState(false)
    const [uName, setUname] = useState()
    const [confirmEditImg, setConfirmEditImg] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (user) setUname(user.username)
    }, [user])

    const allowEdit = () => {
        setUname("");
        setEditName(true);
        setConfirmEditImg(true)
    }

    const confirm = () => {

    }

    const cancel = () => {
        setUname(user.username);
        setEditName(false);
        setConfirmEditImg(false)
    }

    if (user) {

        return (    
            <div className="flex-col flex bg-black-3 h-screen">
                <img onClick={() => router.back()} src="Images/arrow-left.svg"
                className='h-6 clickable3 absolute top-4 left-4'></img>
                <div className="flex-initial flex pb-6 flex-col h-38 items-center border-b-2 border-orange-700">
                    <img src="Images/user.svg" className="border-2 flex-initial m-2 rounded-full border-orange-500
                    h-28"></img>
                </div>
                <div className="flex-initial items-center flex border-b-2 h-24 border-orange-700 
                text-lg justify-evenly ">
                    <p className="flex-initial w-22">Username: </p> 
                    <p contentEditable className={!editName ? "flex-initial w-32 text-orange-500"
                    : "overflow-scroll flex-initial w-32 text-orange-500 border-b-2 border-orange-500"
                    }>
                        {uName}
                    </p>
                    {
                        confirmEditImg ? (
                            <>
                            <img onClick={() => confirm()} className="w-6  flex-initial ml-4 cursor-pointer"
                            src="/Images/true.svg"></img>
                            <img onClick={() => cancel()} className="w-6 flex-initial cursor-pointer"
                            src="/Images/wrong.svg"></img>
                            </>
                        ) : (
                            <img onClick={() => allowEdit()} className="w-8 flex-initial ml-4 cursor-pointer"
                            src="/Images/pencil.svg"></img>
                        )
                    }
                    
                     
                </div>
            </div>
        )
    }
}

export default Settings;