const useCheck = (user, target) => {
     const check = async () => {
        try {
            const data = await fetch("http://localhost:3001/api/data/check", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": "bearer " + user.token
                },
                body: JSON.stringify({sender : user.username, receiver: target})
            }).then(response => response.json() ).then(
                
                data => {return data}
            )
            return data
          } catch (e) {
            console.log(e)
        }
    }

    return check
}

export default useCheck