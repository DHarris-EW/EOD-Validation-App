import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AssessmentAreaCard from "./AssessmentAreaCard";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import getCookie from "../services/GetCookie";
import {useNavigate} from "react-router-dom";
import useMessage from "../hooks/useMessage";


export default function Pink(props) {

    const navigate = useNavigate()
    const { setMessage } = useMessage()

    const [ validated, setValidated ] = useState(false)

    const [sheetTemplate, setSheetTemplate] = useState()

    useEffect(() => {
        let url = "/pink"
        if (props.state === "assess") {
            // only open to DS
            url += "/fetch"
        } else if (props.state === "view") {
            // open to anyone view your own
            // admin can view anyone
            // ds can view who they've ds'd
            url += "/view"
        } else if (props.state === "editing") {
            // open to DS
            // only edit where you are an assessor
            url += "/editing"
        }

        fetch(url,{
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...props
            })
        }).then(r => {
            r.json().then(d => {
                setSheetTemplate({...d})
            })
        })
    }, [])

    function sumbitHandler(e) {
        e.preventDefault()
        const form = e.currentTarget
        setValidated(true)

        if (form.checkValidity()) {
            if (sheetTemplate.ready) {
                fetch("/pink/sumbit", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...sheetTemplate
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

                for (const [headerName, headerInfo] of Object.entries(sheetTemplate.sections)) {
                    let numOfSafety = 0
                    score += headerInfo.score

                    for (const criteriaInfo of Object.values(headerInfo.criteriaGroup)) {
                        if (criteriaInfo.score < 1 && criteriaInfo.safety) {
                            numOfSafety += 1
                        }
                    }

                    const maxScore = Object.values(headerInfo.criteriaGroup).length
                    if (((headerInfo.score / maxScore) * 100) - (numOfSafety * 15) < 75) {
                        passed = false
                        setSheetTemplate(prevState => {
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

                setSheetTemplate(prevState => {
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

        setSheetTemplate(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    return (
        <div className="w-100">
            <h1 className="text-center">Validation Assessment Sheet</h1>
            {!sheetTemplate ? "Loading" :
            <Form noValidate validated={validated} onSubmit={sumbitHandler}>
                    <Form.Group>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Authorisation Exercise</Form.Label>
                                <Form.Control
                                    name="authorisationExercise"
                                    type="text"
                                    value={sheetTemplate.authorisationExercise}
                                    disabled
                                />
                            </Col>
                            <Col>
                                <Form.Label>Sheet Version</Form.Label>
                                <Form.Control
                                    name="version"
                                    type="text"
                                    onChange={changeHandler}
                                    value={sheetTemplate.version.name}
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
                                    value={sheetTemplate.operator.serviceNumber}
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
                                    value={sheetTemplate.assessor.serviceNumber}
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
                                    value={sheetTemplate.briefTaskDescription}
                                    required
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
                                    value={sheetTemplate.taskNumber}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Please enter the task
                                    number</Form.Control.Feedback>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                {Object.entries(sheetTemplate.sections).map(([name, info], i) => {
                    return (
                    <AssessmentAreaCard
                    key = {i}
                    headerName={name}
                    headerInfo={info}
                    setSheetTemplate={setSheetTemplate}
                    />
                    )
                })}
                    </Form.Group>

                    <Button className="w-100" type="sumbit">{!sheetTemplate.ready ? "Calculate" : "Sumbit"}</Button>
            </Form>
            }
        </div>
    )
}