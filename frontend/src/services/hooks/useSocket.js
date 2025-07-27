
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../slices/messageSlice";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/^http/, 'ws');

export function useSocket() {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            cors: { origin: import.meta.env.VITE_API_URL, credentials: true },
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to socket");
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket error', err);
        });

        newSocket.on('receive_message', (newMessage) => {
            // If message is from the user to the user, don't add it to state (its handled in the chat component)
            if (newMessage.senderId === newMessage.receiverId) {
                return;
            }
            dispatch(addMessage(newMessage));
        });


        return () => newSocket.disconnect();

    }, []);

    return socket;
}
