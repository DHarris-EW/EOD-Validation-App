import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";


export default function PinkPerformance(props) {

    const { state, pinkData, setPinkData, title, description } = props

    return (
        <Table bordered size="sm" className="bg-body">
                <thead>
                    <tr>
                        <th className="px-2 bg-light" colSpan={2}>
                            <Row>
                                <Col>
                                    {title}
                                </Col>
                            </Row>
                            <Row className="fw-normal small">
                                <Col>
                                    {description}
                                </Col>
                            </Row>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(pinkData.sections).map(([sectionName, sectionData], index) => {
                        return (
                            <PerformanceSection
                                key={index}
                                state={state}
                                sectionName={sectionName}
                                sectionData={sectionData} 
                                setPinkData={setPinkData}
                            />
                        )
                    })}
                </tbody>
            </Table>
    )
}

function PerformanceSection(props) {

    const {state, sectionName, sectionData, setPinkData} = props

    function textChangeHandler(e) {
        const {name, value} = e.target

        if (name === "percentageAdjustment" && !sectionData.passed) {
            setPinkData(prevState => {
                return {
                    ...prevState,
                    "sections": {
                        ...prevState["sections"],
                        [sectionName]: {
                            ...prevState["sections"][sectionName],
                            "passed": true
                        }
                    }
                }
            })
        }

        setPinkData(prevState => {
            return {
                ...prevState,
                "ready": false,
                "sections": {
                    ...prevState["sections"],
                    [sectionName]: {
                        ...prevState["sections"][sectionName],
                        [name]: value
                    }
                }
            }
        })
    }

    return (
        <>
            <tr>
                <th className="bg-light" colSpan={2}>
                    {sectionName}
                </th>
            </tr>
            <tr>
                <td className="px-2" colSpan={2}>
                    <Row>
                        <Col>
                            {state === "read" ?
                                <>
                                    > {sectionData.performanceComments}
                                </>
                                :
                                <>
                                    <Form.Control
                                        as="textarea"
                                        name="performanceComments"
                                        value={sectionData.performanceComments}
                                        onChange={textChangeHandler}
                                        placeholder=">"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid" className="text-nowrap">Please enter performance points</Form.Control.Feedback>
                                </>
                            }
                        </Col>
                    </Row>
                </td>
            </tr>
            <tr className="align-middle text-center">
                <td className="px-2 col-2">
                    Percentage Adjustment
                </td>
                <td>
                    {state === "read" ?
                        <>
                            {sectionData.percentageAdjustment}
                        </>
                        :
                        <>
                            <Form.Control
                                name="percentageAdjustment"
                                type="text"
                                value={sectionData.percentageAdjustment}
                                onChange={textChangeHandler}
                                className="p-1"
                            />
                        </>
                        }
                </td>
            </tr>
        </>
    )
}