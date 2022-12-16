import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import getCookie from "../services/GetCookie";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "react-bootstrap";


export default function TeamMemberRow(props) {
    const { member } = props
    const {title} = useParams()

    const [expand, setExpand] = useState(false)
    const [memberPinks, setMemberPinks] = useState()
    const navigate = useNavigate()

    function assessBtnHandler(e) {
        const { value } = e.target

        navigate(`/pink/assess/${title}/${value}`)
    }


    function viewBtnHandler(e) {
        const { value } = e.target
         setExpand(!expand)

        const operator = member
        if (!memberPinks) {
            fetch(`/pink/operator/${operator.serviceNumber}/list/${title}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...operator
                })
            }).then(r => {
                r.json().then(d => {

                    setMemberPinks({...d})
                })
            })
        }
    }

    function viewBtnHandler2() {

    }

    return (
        <Card>
            <Card.Body>
                <Row>
                    <Col>
                        {member.serviceNumber}
                    </Col>
                    <Col>
                        {member.name}
                    </Col>
                    <Col>
                        <Button
                            variant="success"
                            onClick={viewBtnHandler}
                        >
                            View
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="success"
                            value={member.serviceNumber}
                            onClick={assessBtnHandler}
                        >
                            Assess
                        </Button>
                    </Col>
                </Row>
                {expand && memberPinks &&
                    Object.values(memberPinks).map((pink, index) => {
                        return (
                            <Row key={index}>
                                <Card>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                Task Number: {pink.taskNumber}
                                            </Col>
                                            <Col>
                                                Task Description: {pink.briefTaskDescription}
                                            </Col>
                                            <Col>
                                                Assessor: {pink.assessor}
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant="success"
                                                    onClick={viewBtnHandler2}
                                                >
                                                    open
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Row>
                        )
                    })
                }
            </Card.Body>
        </Card>

    )

}