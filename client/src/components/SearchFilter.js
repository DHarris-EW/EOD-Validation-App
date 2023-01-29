import {Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function SearchFilter(props) {

    const { filter, setFilter } = props

    function changeHandler(e) {
        const { name, value } = e.target
        setFilter(prevState => {
            return {
                 ...prevState,
                [name]: value
            }
        })
    }

    return (
        <Form className="pb-3">
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>Type</Form.Label>
                        <Form.Select name="pinkType" onChange={changeHandler}>
                            <option value="EOD">EOD</option>
                            <option value="ECM">ECM</option>
                        </Form.Select>
                    </Col>
                    <Col>
                         <Form.Label>Display</Form.Label>
                        <Form.Select name="displaySelect" onChange={changeHandler}>
                            <option value="pinkScoreAverages">Pink Score Averages</option>
                            <option value="performanceTrends">Performance trends</option>
                        </Form.Select>
                    </Col>
                </Row>
                {filter.displaySelect === "pinkScoreAverages" &&
                    <Row>
                        <Col>
                            <Form.Label>Section</Form.Label>
                            <Form.Control
                                name="section"
                                type="text"
                                value={filter.section}
                                onChange={changeHandler}
                            />
                        </Col>
                        <Col>
                            <Form.Label>Criteria</Form.Label>
                            <Form.Control
                                name="criteria"
                                type="text"
                                value={filter.criteria}
                                onChange={changeHandler}
                            />
                        </Col>
                    </Row>
                }
            </Form.Group>
        </Form>
    )
}