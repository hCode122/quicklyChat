import { useAuthContext } from "./useAuthContext";

export default function useFetchContacts () {

    
    const fetchContacts = async (token) => {
        try {
            const data = await fetch("http://localhost:3001/api/data/contacts",{
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "bearer " + token
            }}).then(response => response.json()).then(
                data => {return data}
            )
            return data
        } catch (error) {
            console.log(error)
        }
    }
 

    return fetchContacts;
}