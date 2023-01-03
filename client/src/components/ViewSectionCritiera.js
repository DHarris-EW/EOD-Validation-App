import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";


export default function ViewSectionCriteria(props) {
    const {name, score, index} = props

    return (
        <Row className="mb-1">
            <Col xs={8} md={8}>
                {name}
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check type="radio">
                    <Form.Check.Input
                        type="checkbox"
                        id={`${name}_1`}
                        name={`group_${index}_${name}`}
                        checked={score === 1}
                        readOnly={true}
                    />
                    <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                </Form.Check>
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check
                    type="checkbox"
                    id={`${name}_2`}
                    name={`group_${index}_${name}`}
                    checked={score === 0.5}
                    readOnly={true}
                />
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check
                    type="checkbox"
                    id={`${name}_3`}
                    name={`group_${index}_${name}`}
                    checked={score === 0}
                    readOnly={true}
                />
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check
                    type="checkbox"
                    id={`${name}_4`}
                    name={`group_${index}_${name}`}
                    checked={score === -1}
                    readOnly={true}
                />
            </Col>
        </Row>
    )
}