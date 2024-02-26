import { useAuthContext } from "./useAuthContext";

export default function useFetchChats() {
    

    const fetchChats = async (token) => {
        console.log(token)
        try {
            await fetch("http://localhost:3001/api/data/chats", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": "bearer " + token
                },
            }).then(response => response.json() ).then(
                data => {console.log(data);}
            )
        } catch (error) {
            console.log(error)
        }
    }
    return fetchChats;
}

   

