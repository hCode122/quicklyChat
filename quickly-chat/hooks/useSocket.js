import { io } from "socket.io-client"

const connectSocket = () => {
    const socket = io('http://localhost:3003')
    socket.on("connect", () => {
        console.log("you connected with id: " + socket.id)
    })
    return socket
}

export default connectSocket;
