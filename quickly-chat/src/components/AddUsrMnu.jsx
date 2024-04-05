import React from "react"
const { useState, useEffect } = require("react")

const AddUsrMnu = ({user, setSMen},ref) => {
    
    const [search, setSearch] = useState("")
    const [suggestions, setSug] = useState()


    const  addUser = async (contact,user) => {
        setSMen(null)
        await fetch("http://localhost:3001/api/data/contacts",{
            method: "POST",
            headers: {
                "Accepets": "Application/json",
                'Content-Type': 'application/json',
                "Authorization": "bearer " + user
            },
            body: JSON.stringify({toAdd: contact.name})
        }
            
        )
    }

    useEffect(() => {
        if (search.length > 0) {
            fetch("http://localhost:3001/api/data/search", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": "bearer " + user
                },
                body: JSON.stringify({search})
            }).then(response => response.json()).then(data => setSug(data))
        }
    }, [search])
    return(
        <div  className="absolute top-4 w-screen bg-black-3  opacity-90">
        <div ref={ref} className="absolute top-4 h-12 left-12 rounded-lg  bg-white">
            <div className="text-md text-orange-700">
                <input className="rounded-lg h-12 p-2 outline-none" onChange={(e) => setSearch(e.target.value)} value={search} type="text">
                </input>
                {suggestions && suggestions.map((contact, index) => {
                    return <div onClick={() => addUser(contact, user)} className="clickable bg-black p-1">{contact.name}</div>
                })}
            </div>
        </div>
        </div>
    )
}



export default React.forwardRef(AddUsrMnu)