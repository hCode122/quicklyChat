import { useAuthContext } from "../../hooks/useAuthContext"
const { data } = require("autoprefixer")
const { useState, useEffect } = require("react")

const AddUsrMnu = ({user}) => {
    
    const [search, setSearch] = useState("")
    const [suggestions, setSug] = useState()
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
        <div className="absolute top-40 rounded-lg left-16 bg-black bg-opacity-60">
            <div className="text-md text-white">
                <input className="rounded-t-lg bg-black outline-none bg-opacity-60" onChange={(e) => setSearch(e.target.value)} value={search} type="text">
                </input>
                {suggestions && suggestions.map((contact, index) => {
                    return <div onClick={() => addUser(contact, user)} className="clickable p-1">{contact.name}</div>
                })}
            </div>
        </div>
    )
}

const  addUser = async (contact,user) => {
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

export default AddUsrMnu