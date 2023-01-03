import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";


export default function EditableSectionCriteria(props) {
    const {name, score, handleRadioChange} = props

    return (
        <Row className="mb-1">
            <Col xs={8} md={8}>
                {name}
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check type="radio">
                    <Form.Check.Input
                        type="radio"
                        id={`${name}_1`}
                        name={`group_${name}`}
                        value="1"
                        onChange={handleRadioChange}
                        checked={parseFloat(score) === 1}
                        required
                    />
                    <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                </Form.Check>
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check
                    type="radio"
                    id={`${name}_2`}
                    name={`group_${name}`}
                    value="0.5"
                    onChange={handleRadioChange}
                    checked={parseFloat(score) === 0.5}
                />
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check
                    type="radio"
                    id={`${name}_3`}
                    name={`group_${name}`}
                    value="0"
                    onChange={handleRadioChange}
                    checked={parseFloat(score) === 0}
                />
            </Col>
            <Col xs={1} md={1} className="text-center">
                <Form.Check
                    type="radio"
                    id={`${name}_4`}
                    name={`group_${name}`}
                    value="-1"
                    onChange={handleRadioChange}
                    checked={parseFloat(score) === -1}
                />
            </Col>
        </Row>
    )
}