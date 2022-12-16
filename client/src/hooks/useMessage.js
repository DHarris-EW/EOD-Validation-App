import { useContext } from "react"
import MessageContext from "../context/MessageProvider"

export default function useMessage() {
    return useContext(MessageContext)
}
