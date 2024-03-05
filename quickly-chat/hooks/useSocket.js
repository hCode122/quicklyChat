import { io } from "socket.io-client"

const connectSocket = () => {
    const socket = io('http://localhost:3003')
}

export default connectSocket;
