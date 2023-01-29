import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import getCookie from "../services/GetCookie";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "react-bootstrap";
import PinkList from "./pink/PinkList";


export default function TeamMemberRow(props) {
    const { member } = props
    const { validation_id } = useParams()

    const [expand, setExpand] = useState(false)
    const [memberPinks, setMemberPinks] = useState()
    const navigate = useNavigate()

    function assessBtnHandler() {
        navigate(`/pink-management/validation/${validation_id}/user/${member.id}/${member.pinkType}/create`, {state:{"member": "asd"}})
    }

    function viewBtnHandler() {
         setExpand(!expand)

        if (!memberPinks) {
            fetch(`/pink-management/validation/${validation_id}/user/${member.id}/read`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": getCookie('csrf_access_token')
                }
            }).then(r => {
                r.json().then(d => {
                    setMemberPinks({...d})
                })
            })
        }
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
                            onClick={assessBtnHandler}
                        >
                            Assess
                        </Button>
                    </Col>
                </Row>
                {expand && memberPinks &&
                    <PinkList pinks={memberPinks} />
                }
            </Card.Body>
        </Card>
    )

}