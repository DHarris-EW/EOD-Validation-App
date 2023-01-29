import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScoreCompetency from "./ScoreCompetency";


export default function PinkEODHeader(props) {

    const { state, pinkData, changeHandler } = props

    const scorePercentage = (pinkData.score / pinkData.totalScore) * 100

    return (
         <Table bordered className="align-middle bg-body" size="sm">
            <thead className="bg-light">
                <tr>
                    <th colSpan={6} className="ps-4">
                        <Row>
                            <Col>
                                No 1 EOD Operator Generic Assessment
                            </Col>
                        </Row>
                        <Row className="fw-normal small">
                            <Col>
                                Authorisation for Operations (Contingency) {pinkData.version.name}
                            </Col>
                        </Row>
                    </th>
                </tr>
            </thead>
            <tbody className="text-center">
                <tr>
                    <th className="bg-light">
                        Authorisation Exercise
                    </th>
                    <td colSpan={3}>
                         {pinkData.authorisationExercise}
                    </td>
                    <th className="bg-light">
                        Objective Score
                    </th>
                    <th className="bg-light">
                        Subjective Score
                    </th>
                </tr>
                <tr>
                    <th className="bg-light">
                        ECM Operator
                    </th>
                    <td>
                        {pinkData.operator.serviceNumber}
                    </td>
                    <th className="bg-light">
                        Assessment Number
                    </th>
                    <td>
                        {state === "read" ?
                            <>
                                {pinkData.assessmentNumber}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="assessmentNumber"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.assessmentNumber}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter an assessment number</Form.Control.Feedback>
                            </>
                        }
                    </td>
                    <td>
                        <ScoreCompetency scoreAvgPercentage={scorePercentage} />
                    </td>
                    <td>
                        {state === "read" ?
                            <>
                                {pinkData.subjectiveScore}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="subjectiveScore"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.subjectiveScore}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter a subjective score</Form.Control.Feedback>
                            </>
                        }
                    </td>
                </tr>
                <tr>
                    <th className="bg-light">
                        Task Number
                    </th>
                    <td>
                        {state === "read" ?
                            <>
                                {pinkData.taskNumber}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="taskNumber"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.taskNumber}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter a task number</Form.Control.Feedback>
                            </>
                        }
                    </td>
                    <th className="bg-light">
                        Assessor
                    </th>
                    <td>
                        {pinkData.assessor.serviceNumber}
                    </td>
                    <th className="bg-light">
                        Pass/Fail
                    </th>
                    <th className="bg-light">
                        RE-Score *Amber only
                    </th>
                </tr>
                <tr>
                    <th className="bg-light">
                        Time of arrival
                    </th>
                     <td>
                        {state === "read" ?
                            <>
                                {pinkData.timeOfArrival}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="timeOfArrival"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.timeOfArrival}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter the time of arrival</Form.Control.Feedback>
                            </>
                        }

                    </td>
                    <th className="bg-light">
                        Time of first EOD action
                    </th>
                    <td className="align-middle">
                        {state === "read" ?
                            <>
                                {pinkData.timeOfFirstEODAction}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="timeOfFirstEODAction"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.timeOfFirstEODAction}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter the time of the first EOD action</Form.Control.Feedback>
                            </>
                        }

                    </td>
                    <td>
                        {pinkData.passed ? "Passed" : "Failed"}
                    </td>
                    <td>
                        {state === "read" ?
                            <>
                                {pinkData.reScore}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="reScore"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.reScore}
                                />
                            </>
                        }

                    </td>
                </tr>
                <tr>
                    <th className="bg-light">
                        Brief Task Description
                    </th>
                    <td colSpan={5}>
                        {state === "read" ?
                            <>
                                {pinkData.briefTaskDescription}
                            </>
                            :
                            <>
                                <Form.Control
                                    name="briefTaskDescription"
                                    type="text"
                                    onChange={changeHandler}
                                    value={pinkData.briefTaskDescription}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter a brief task description</Form.Control.Feedback>
                            </>
                        }
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}