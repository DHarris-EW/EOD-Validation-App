import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";


export default function PortalSummary(props){

    const { data } = props

    return (
        <div className="h-100">
         <Row className="mb-3">
            <Col>
                <Form.Label>Service Number</Form.Label>
                <Form.Control
                    name="authorisationExercise"
                    type="text"
                    value={data.operator.serviceNumber}
                    disabled
                />
            </Col>
            <Col>
                <Form.Label>Rank</Form.Label>
                <Form.Control
                    name="version"
                    type="text"
                    placeholder="LCpl"
                    disabled
                />
            </Col>
            <Col>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    name="version"
                    type="text"
                    value={data.operator.name}
                    disabled
                />
            </Col>
        </Row>
        <Row className="text-center">
            <Col>
                <h3>Total</h3>
                <div className="border">
                    {data.total}
                </div>
            </Col>
            <Col>
                <h3>Passed</h3>
                <div className="border">
                    {data.passed}
                </div>
            </Col>
            <Col>
                <h3>Failed</h3>
                <div className="border">
                    {data.failed}
                </div>
            </Col>
        </Row>
        </div>
    )
}