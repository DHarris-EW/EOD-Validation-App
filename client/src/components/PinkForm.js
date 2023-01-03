import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PinkSection from "./PinkSection";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import getCookie from "../services/GetCookie";
import {useNavigate, useParams} from "react-router-dom";
import useMessage from "../hooks/useMessage";


export default function PinkForm(props) {

    const { state } = useParams()
    const { pinkData, setPinkData } = props

    const navigate = useNavigate()
    const { setMessage } = useMessage()

    const [ validated, setValidated ] = useState(false)


    function sumbitHandler(e) {
        e.preventDefault()
        const form = e.currentTarget
        setValidated(true)
        let url = "/pink-management"

        if (state === "edit") {
            url += `/pink/${pinkData.id}/edit`
        } else if (state === "create") {
            url += `/user/${pinkData.operator.id}/create`
        }

        if (form.checkValidity()) {
            if (pinkData.ready) {
                fetch(url, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...pinkData
                    })
                }).then(r => {
                    if (r.ok) {
                        r.json().then(d => {
                            setMessage({"text": d.msg.text, "type": d.msg.type})
                            navigate(-1)
                        })
                    }
                })
            } else {
                let passed = true
                let score = 0

                for (const [headerName, headerInfo] of Object.entries(pinkData.sections)) {
                    let numOfSafety = 0
                    score += headerInfo.score

                    for (const criteriaInfo of Object.values(headerInfo.criteriaGroup)) {
                        if ((criteriaInfo.score > -1 && criteriaInfo.score < 1) && criteriaInfo.safety) {
                            numOfSafety += 1
                        }
                    }

                    const maxScore = Object.values(headerInfo.criteriaGroup).length
                    if (((headerInfo.score / maxScore) * 100) - (numOfSafety * 15) < 75) {
                        passed = false
                        setPinkData(prevState => {
                            return {
                                ...prevState,
                                "passed": passed,
                                "sections": {
                                    ...prevState["sections"],
                                    [headerName]: {
                                        ...prevState["sections"][headerName],
                                        "passed": passed
                                    }
                                }
                            }
                        })
                    }
                }

                setPinkData(prevState => {
                    return {
                        ...prevState,
                        "ready": true,
                        "passed": passed,
                        "score": score
                    }
                })
            }
        }
    }

    function changeHandler(e) {
        const {name, value} = e.target

        setPinkData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    console.log(pinkData)

    return (
        <Form noValidate validated={validated} onSubmit={sumbitHandler}>
            <Form.Group>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Authorisation Exercise</Form.Label>
                        <Form.Control
                            name="authorisationExercise"
                            type="text"
                            value={pinkData.authorisationExercise}
                            disabled
                        />
                    </Col>
                    <Col>
                        <Form.Label>Sheet Version</Form.Label>
                        <Form.Control
                            name="version"
                            type="text"
                            onChange={changeHandler}
                            value={pinkData.version.name}
                            disabled
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Operator</Form.Label>
                        <Form.Control
                            name="operator"
                            type="text"
                            onChange={changeHandler}
                            value={pinkData.operator.serviceNumber}
                            disabled
                        />
                        <Form.Control.Feedback type="invalid">Please enter the operator's service
                            number</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label>Assessor</Form.Label>
                        <Form.Control
                            name="assessor"
                            type="text"
                            onChange={changeHandler}
                            value={pinkData.assessor.serviceNumber}
                            disabled
                        />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Brief Task Description</Form.Label>
                        <Form.Control
                            name="briefTaskDescription"
                            type="text"
                            onChange={changeHandler}
                            value={pinkData.briefTaskDescription}
                            required
                            disabled={state === "view"}
                        />
                        <Form.Control.Feedback type="invalid">Please enter a task
                            description</Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Form.Label>Task Number</Form.Label>
                        <Form.Control
                            name="taskNumber"
                            type="text"
                            onChange={changeHandler}
                            value={pinkData.taskNumber}
                            required
                            disabled={state === "view"}
                        />
                        <Form.Control.Feedback type="invalid">Please enter the task
                            number</Form.Control.Feedback>
                    </Col>
                </Row>
                {state === "read" &&
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Score</Form.Label>
                            <Form.Control
                                name="score"
                                type="text"
                                value={`${pinkData.score}/${pinkData.totalScore}`}
                                disabled={true}
                            />
                            <Form.Control.Feedback type="invalid">Please enter a task
                                description</Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>Passed</Form.Label>
                            <Form.Control
                                name="passed"
                                type="text"
                                value={pinkData.passed ? "Passed" : "Failed"}
                                className={pinkData.passed ? "bg-success" : "bg-danger"}
                                disabled={true}
                            />
                            <Form.Control.Feedback type="invalid">Please enter the task
                                number</Form.Control.Feedback>
                        </Col>
                    </Row>
                }
            </Form.Group>
            <Form.Group>
                {Object.entries(pinkData.sections).map(([name, info], i) => {
                    return (
                    <PinkSection
                        key = {i}
                        headerName={name}
                        headerInfo={info}
                        setPinkData={setPinkData}
                    />
                    )
                })}
            </Form.Group>

            {state !== "read" && <Button className="w-100" type="sumbit">{!pinkData.ready ? "Calculate" : "Sumbit"}</Button>}
        </Form>

    )
}