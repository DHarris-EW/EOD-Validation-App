import {createContext, useEffect, useState} from "react"
import getCookie from "../services/GetCookie";

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false)

    useEffect(() => {
        fetch("/auth", {
        method: "POST",
        credentials: 'include',
        headers: {
          'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
        }).then(r => {
            if (r.status === 200){
                r.json().then(d => {
                    setAuth({"id": d.auth.id, "name": d.auth.name, "serviceNumber": d.auth.serviceNumber, "roles": d.auth.roles})
                    setIsLoading(false)
                 })
            } else {
                setIsLoading(false)
            }
        })
    }, [])

    return (
        <>
            {!isLoading ?
                <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
                    {children}
                </AuthContext.Provider>
            : <h1>loading</h1>}
        </>
    )
}

export default AuthContext
