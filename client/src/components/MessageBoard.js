import "./MessageBoard.scss"
import useMessage from "../hooks/useMessage";
import {useEffect} from "react";
import {wait} from "@testing-library/user-event/dist/utils";

export default function MessageBoard() {
    const { message, setMessage } = useMessage()

    useEffect(() => {
        setTimeout(() => { setMessage({}) }, 3000);
    })

    return (
        <>
            <div id="hideMeAfter5Seconds" className={`message-board alert alert-${message.type} rounded-0 text-center`}>
                {message.text ? message.text :  "no"}
           </div>
        </>
    )
}
