import {useState} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";
import "./ValidationCreate.scss"

import AccordionTeams from "../../components/AccordionTeams";
import getCookie from "../../services/GetCookie";
import useMessage from "../../hooks/useMessage";
import { useNavigate } from "react-router-dom";


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
        // teamID = 1, memberID = 1
        //    1: {
        //     1: {
        //         serviceNumber: "",
        //         name: "",
        //         valid: false (valid is serviceNumber is in the database when checked)
        //     }
        // }
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
            fetch("/validation/create", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...validation,
                    ["teams"]: {...teams}
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
        <Container fluid>
            <Form>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 text-center">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            className={`text-center ${validated ? validation.title ? "is-valid" : "is-invalid" : ""}`}
                            type="text"
                            value={validation.title}
                            onChange={updateValidation}
                        />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 text-center">
                            <Form.Label>Date From</Form.Label>
                            <DatePicker
                                className="text-center form-control"
                                dateFormat="dd/MM/yyyy"
                                selected={validation.dateFrom}
                                onChange={(date) => setValidation(prevState => {
                                    return {
                                        ...prevState,
                                        ["dateFrom"]: date
                                    }
                                })}
                                selectsStart
                                startDate={validation.dateFrom}
                                endDate={validation.dateTo}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 text-center">
                            <Form.Label>Date To</Form.Label>
                            <DatePicker
                                className="text-center form-control"
                                dateFormat="dd/MM/yyyy"
                                selected={validation.dateTo}
                                onChange={(date) => setValidation(prevState => {
                                    return {
                                        ...prevState,
                                        ["dateTo"]: date
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
                        <Button variant="primary" type="sumbit" onClick={createValidationHandler}>
                            Create
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}