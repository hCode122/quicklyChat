const sendMessage = async (newMsg, user) => {
 
    const message = await fetch("https://quicklychat.onrender.com/api/data/message",{
        method: "POST",
        headers: {
            "accept": "Application/json",
            'Content-Type':'application/json',
            "Authorization": "bearer " + user.token
        },
        body: JSON.stringify(newMsg)
    }).then(response => response.json()).then(data => {return data})
    return message
}

export default sendMessage;
