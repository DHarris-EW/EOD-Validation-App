import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";


export default function PinkECMHeader(props) {

    const { state, pinkData, changeHandler } = props

    const scorePercentage = Math.round((pinkData.score / pinkData.totalScore) * 100)

    return (
         <Table bordered className="align-middle bg-body" size="sm">
            <thead className="bg-light">
                <tr>
                    <th colSpan={5} className="ps-4">
                        <Row>
                            ECM Operator (IEDD(Heavy)) Assessment
                        </Row>
                        <Row className="fw-normal small">
                            Authorisation for Operations (Contingency) {pinkData.version.name}
                        </Row>
                    </th>
                </tr>
            </thead>
            <tbody className="text-center">
                <tr>
                    <th className="col-2 bg-light">
                        Authorisation Exercise
                    </th>
                    <td colSpan={3}>
                         {pinkData.authorisationExercise}
                    </td>
                    <th className="bg-light">
                        Score
                    </th>
                </tr>
                <tr>
                    <th className="bg-light">
                        ECM Operator
                    </th>
                    <td>
                        {pinkData.operator.serviceNumber}
                    </td>
                    <th className="col-2 bg-light">
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
                        {scorePercentage}
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
                </tr>
                <tr>
                    <th className="col-2 bg-light">
                        Brief Task Description
                    </th>
                        <td colSpan={3}>
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
                    <td>
                        {pinkData.passed ? "Passed" : "Failed"}
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}