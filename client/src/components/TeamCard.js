import Card from "react-bootstrap/Card"
import TeamMemberRow from "./TeamMemberRow";

export default function TeamCard(props) {
    const { team } = props

    return (
        <Card className="text-center mb-3">
            <Card.Header>EOD Team {team.teamNum}</Card.Header>
            <Card.Body className="p-0">
                {Object.values(team.members).map((member, index) => (
                    <TeamMemberRow key={index} member={member} />
                ))
                }
            </Card.Body>
        </Card>
    )
}