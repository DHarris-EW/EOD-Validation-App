import React, {useEffect, useState} from "react"
import "./login.scss"

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"
import useMessage from "../hooks/useMessage";

export default function Login() {
    const { auth, setAuth, persist, setPersist } = useAuth()
    const { setMessage } = useMessage()
    const navigate = useNavigate()

    const [user, setUser] = useState({
        serviceNumber: "",
        password: "",
        confirmPassword: ""
    });

    function updateUser(event) {
        const {name, value} = event.target

        setUser(prevState => {
            return{
                ...prevState,
                [name]: value
            }
        })
    }

    function handleClick(e){
        e.preventDefault()
        fetch("/login",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...user
            })
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(d => {
                        setAuth({"id": d.auth.id, "name": d.auth.name, "serviceNumber": d.auth.serviceNumber, "is_admin": d.auth.is_admin})
                        setMessage({"text": d.msg.text, "type": d.msg.type})
                    })
                }
            })
    }

    function togglePersist() {
        setPersist(prevState => !prevState)
    }

    useEffect(() => {
        localStorage.setItem("persist", persist)
    }, [persist])

    useEffect((() => {
        if (auth.serviceNumber) {
            navigate("/home")
        }
    }),[auth])


    return (
        <Form>
            <Form.Group className="mb-3">
            <Form.Label>Service Number</Form.Label>
            <Form.Control
                name="serviceNumber"
                type="text"
                placeholder="Service Number"
                value={user.serviceNumber}
                autoComplete="username"
                onChange={updateUser}
            />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    autoComplete="new-password"
                    onChange={updateUser}
                />
                <Form.Check
                    className="mt-1"
                    type="checkbox"
                    id="persist"
                    label="Remember me?"
                    onChange={togglePersist}
                    checked={persist}
                />
            </Form.Group>
            <Button className="w-100" variant="primary" type="sumbit" onClick={handleClick}>
                LogIn
            </Button>
        </Form>
    )
}