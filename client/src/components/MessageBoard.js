import "./MessageBoard.scss"
import useMessage from "../hooks/useMessage";
import { useEffect } from "react";

export default function MessageBoard() {
    const { message, setMessage } = useMessage()

    useEffect(() => {
        setTimeout(() => { setMessage({}) }, 3000);
    })

    return (
            <div id="hideMeAfter5Seconds" className={`message-board alert alert-${message.type} rounded-0 text-center mb-0`}>
                {message.text ? message.text :  "No Message Text"}
           </div>
    )
}
