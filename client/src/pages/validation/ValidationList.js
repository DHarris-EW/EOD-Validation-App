import { Card } from "react-bootstrap";
import getCookie from "../../services/GetCookie";
import {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";



export default function ValidationList() {

    const [validations, setValidations] = useState()
    const { setAuth } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        fetch("/validation/assess/validation-list", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token')
            }
        }).then(r => {
            if (r.status === 200) {
                r.json().then(d => {
                    setValidations({...d})
                })
            } else if (r.status === 401) {
                setAuth({})
            }
        })
    }, [])

    function assessBtnHandler(e) {
        const { name } = e.target
        const title = name.split("-").slice(-1)
        navigate(`/validation/assess/${title}`)
    }


    return (
        <div className="w-100 text-center">
            <h1 className="text-center">Validation List</h1>
            <Row className="justify-content-center">
                {validations &&
                    Object.values(validations).map(validation => (
                        <Col key={validation.id} xs={12} lg={6}>
                            <Card className="text-center mb-3">
                                <Card.Header className="text-uppercase">{validation.title}</Card.Header>
                                <Card.Body>
                                    <Card.Text>Date From: {validation.date_from}</Card.Text>
                                    <Card.Text>Date To: {validation.date_to}</Card.Text>
                                    <Button
                                        variant="success"
                                        name={`btnAssess-${validation.title}`}
                                        onClick={assessBtnHandler}
                                    >
                                        Assess
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )
}
