import {createContext, useState} from "react";

const MessageContext = createContext({})

export function MessageProvider({ children }) {
    const [message, setMessage] = useState({})


    return (
        <MessageContext.Provider value={{ message, setMessage }}>
            {children}
        </MessageContext.Provider>
    )
}

export default MessageContext
