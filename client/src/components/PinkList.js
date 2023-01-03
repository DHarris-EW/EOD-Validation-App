import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {useNavigate} from "react-router-dom";
import {ListGroup} from "react-bootstrap";


export default function PinkList(props) {

    const { pinks, portalView } = props
    const navigate = useNavigate()

    function viewBtnHandler2(e) {
        const { value } = e.target

        navigate(`/pink-management/pink/${value}/read`)
    }

    function editBtn(e) {
        const { value } = e.target

        navigate(`/pink-management/pink/${value}/edit`)
    }

    return (
        <ListGroup>
            <ListGroup.Item>
            <Row className="text-center">
                <Col md={3}>
                    {portalView ? "Task Description" : "Task Number"}
                </Col>
                <Col md={3}>
                    {portalView ? "Validation" : "Task Description"}
                </Col>
                <Col md={3}>
                    {portalView ? "Result" : "Assessor"}
                </Col>
            </Row>
            </ListGroup.Item>
            {Object.values(pinks).map((data, i) => {
                return (
                    <ListGroup.Item key={i}>
                        <Row className="text-center">
                            <Col md={3}>
                                {portalView ? data.brief_task_description : data.taskNumber}
                            </Col>
                            <Col md={3}>
                                {portalView ? data.authorisation_exercise : data.briefTaskDescription}
                            </Col>
                            <Col md={3}>
                                {portalView ? data.passed : data.assessor.serviceNumber}
                            </Col>
                            {!portalView &&
                            <Col>
                                <Button
                                    variant="success"
                                    onClick={editBtn}
                                    value={data.id}
                                >
                                    edit
                                </Button>
                            </Col>
                            }
                            <Col>
                                <Button
                                    variant="success"
                                    onClick={viewBtnHandler2}
                                    value={data.id}
                                >
                                    view
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    )
}


