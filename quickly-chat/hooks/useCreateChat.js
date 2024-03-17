const useCreateChat = (user, target) => {
    const createCh = async () => {
       try {
           const data = await fetch("http://localhost:3001/api/data/chat", {
               method: "POST",
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   "Authorization": "bearer " + user.token
               },
               body: JSON.stringify({sendName : user.username, recName: target})
           }).then(response => response.json() ).then(
               
               data => {return data}
           )
           return data
         } catch (e) {
           console.log(e)
       }
   }

   return createCh
}

export default useCreateChat