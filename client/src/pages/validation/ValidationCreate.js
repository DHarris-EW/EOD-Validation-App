import {useState} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";

import AccordionTeams from "../../components/AccordionTeams";
import getCookie from "../../services/GetCookie";
import useMessage from "../../hooks/useMessage";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";


export default function ValidationCreate(){
    const { setMessage } = useMessage()
    const navigate = useNavigate()

    const [validation, setValidation] = useState({
        title: "",
        dateFrom: new Date(),
        dateTo: new Date(),
        teams: {}
    });
    const [validated, setValidated] = useState(false)

    const [teams, setTeams] = useState({
           1: {
               "teamMembers":{
                   1: {
                        "serviceNumber": "",
                        "valid": false
                    }
               }

        }
    });

    function updateValidation(e) {
        const {name, value} = e.target

        setValidation(prevState => {
            return{
                ...prevState,
                [name]: value
            }
        })
    }

    function createValidationHandler(e) {
        e.preventDefault()
        setValidated(true)
        if (validation.title) {
            fetch("/validation-management/create", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...validation,
                    "teams": {...teams}
                })
            }).then(r => {
                if (r.status === 200) {
                    r.json().then(d => {
                        setMessage({"text": d.msg.text, "type": d.msg.type})
                        navigate("/home")
                    })
                }
            })
        }
    }

    return (
        <div>
            <h1>Create Validation</h1>
            <Form>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={12}>
                        <Form.Group className="mb-3">
                        <Form.Label>Validation Name</Form.Label>
                        <Form.Control
                            name="title"
                            className={`text-center ${validated ? validation.title ? "is-valid" : "is-invalid" : ""}`}
                            type="text"
                            value={validation.title}
                            placeholder="Validation Name"
                            onChange={updateValidation}
                        />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <DatePicker
                                className="text-center form-control"
                                dateFormat="dd/MM/yyyy"
                                selected={validation.dateFrom}
                                onChange={(date) => setValidation(prevState => {
                                    return {
                                        ...prevState,
                                        "dateFrom": date
                                    }
                                })}
                                selectsStart
                                startDate={validation.dateFrom}
                                endDate={validation.dateTo}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <DatePicker
                                className="text-center form-control"
                                dateFormat="dd/MM/yyyy"
                                selected={validation.dateTo}
                                onChange={(date) => setValidation(prevState => {
                                    return {
                                        ...prevState,
                                        "dateTo": date
                                    }
                                })}
                                selectsEnd
                                startDate={validation.dateFrom}
                                endDate={validation.dateTo}
                                minDate={validation.dateFrom}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <AccordionTeams teams={teams} setTeams={setTeams}/>

                <Row>
                    <Col className="text-center">
                        <Button variant="primary" type="sumbit" onClick={createValidationHandler} className="w-100">
                            Create
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}