const sendMessage = async (newMsg, user) => {
 
    await fetch("http://localhost:3001/api/data/message",{
        method: "POST",
        headers: {
            "accept": "Application/json",
            'Content-Type':'application/json',
            "Authorization": "bearer " + user.token
        },
        body: JSON.stringify(newMsg)
    }).then(response => response.json()).then(data => {return data})
}

export default sendMessage;
