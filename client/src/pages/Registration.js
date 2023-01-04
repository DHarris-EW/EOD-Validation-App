import "./login.scss"

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from "react";
import useAuth from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import getCookie from "../services/GetCookie";
import useMessage from "../hooks/useMessage";

export default function Registration() {
    const { auth } = useAuth()
    const { setMessage } = useMessage()
    const [errorMessage, setErrorMessage] = useState()
    const [selectedFile, setSelectedFile] = useState()
    const [validated, setValidated] = useState()

    const navigate = useNavigate()

    function changeHandler(event) {
        const file = event.target.files[0]

        if (file.type === "text/csv"){
            setErrorMessage(false)
            setValidated(true)
            setSelectedFile(file)
        }else{
            setValidated(false)
            setErrorMessage("Please provide a .csv file")
        }
    }

    function handleClick(e){
        e.preventDefault()
        let data = new FormData()
        data.append("file", selectedFile)


        fetch("/registration",{
            method: "POST",
            credentials: "include",
            headers: {
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: data
        }).then(r => {
                if (r.status === 200) {
                    r.json().then(d => {
                        setMessage({"text": d.msg.text, "type": d.msg.type})
                    })
                }
            })
    }

    return (
         <Form noValidate validated={validated}>
            <h1>Registration</h1>
            <Form.Group className="">
                <Form.Label>Nominal Roll</Form.Label>
                <Form.Control
                    name="nominalRoll"
                    type="file"
                    accept=".csv"
                    onChange={changeHandler}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                {errorMessage &&
                    <Form.Text className="text-danger">
                        {errorMessage}
                    </Form.Text>
                }
            </Form.Group>
            <Button
                variant={errorMessage ? "danger" : "primary"}
                type="sumbit"
                onClick={handleClick}
                disabled={errorMessage}
            >
                Register
            </Button>
        </Form>
    )
}