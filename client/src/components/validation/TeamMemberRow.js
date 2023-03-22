import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import getCookie from "../services/GetCookie";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import PinkList from "./pink/PinkList";


export default function TeamMemberRow(props) {
    const { member } = props
    const { validationID } = useParams()

    const [expand, setExpand] = useState(false)
    const [memberPinks, setMemberPinks] = useState()
    const navigate = useNavigate()

    function assessBtnHandler() {
        navigate(`/pink-management/validation/${validationID}/user/${member.id}/${member.pinkType}/create`)
    }

    function viewBtnHandler() {
         setExpand(!expand)

        if (!memberPinks) {
            fetch(`/pink-management/validation/${validationID}/user/${member.id}/read`, {
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
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={2}>
                        <h6 className="mb-0">Service Number:</h6>
                    </Col>
                    <Col xs={12} md={6} xl={2}>
                        {member.serviceNumber}
                    </Col>
                    <Col xs={12} md={3} xl={1}>
                        <h6 className="mb-0">Rank:</h6>
                    </Col>
                    <Col xs={12} md={3} xl={1}>
                        {member.rank}
                    </Col>
                    <Col xs={12} md={3} xl={1}>
                        <h6 className="mb-0">Name:</h6>
                    </Col>
                    <Col xs={12} md={3} xl={3}>
                        {member.name}
                    </Col>
                    <Col xs={6} md={6} xl={1}>
                        <Button
                            variant="success"
                            onClick={viewBtnHandler}
                        >
                            View
                        </Button>
                    </Col>
                    <Col xs={6} md={6} xl={1}>
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