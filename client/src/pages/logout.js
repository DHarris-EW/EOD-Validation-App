import React, {useEffect} from "react";
import getCookie from "../services/GetCookie";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useMessage from "../hooks/useMessage";

export default function Logout(){
    const { setAuth } = useAuth()
    const { setMessage } = useMessage()
    const navigate = useNavigate()

    useEffect(() => {
        fetch("/logout", {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
        }).then(r => {
            if (r.status === 200){
                r.json().then(d => {
                    setMessage({"text": d.msg.text, "type": d.msg.type})
                })
            }
            setAuth({})
            navigate("/login")
        })
    },[])


    return(
            <h1>Log out page</h1>
    )
}