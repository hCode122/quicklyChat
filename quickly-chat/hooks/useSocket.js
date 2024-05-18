import { io } from "socket.io-client"

const connectSocket = (user) => {
    if (user) {
        const socket = io('https://quicklychat.onrender.com:3002')
        socket.on("connect", () => {
            console.log('connectiong')
            socket.emit("register", user.username, socket.id)
        })
        socket.on("disconnect", () => {
            socket.emit("leave",user)
        })
        return socket
    }
}

export default connectSocket;
