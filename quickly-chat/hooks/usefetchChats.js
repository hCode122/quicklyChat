import { useAuthContext } from "./useAuthContext";

export default function useFetchChats() {
    
    const fetchChats = async (token) => {
        try {
            const data = await fetch("https://quicklychat.onrender.com/api/data/chats", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": "bearer " + token
                },
            }).then(response => response.json() ).then(
                data => {return data}
            )
            return data
        } catch (error) {
            console.log(error)
        }
    }
    return fetchChats;
}

   

