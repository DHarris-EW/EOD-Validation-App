import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import getCookie from "../services/GetCookie";
import useAuth from "../hooks/useAuth";

export default function AccordionTeams(props) {
    const { setAuth } = useAuth()
    const { teams, setTeams } = props

    function accordionHandler(e) {
        const { name } = e.target

        setTeams(prevState => {
            if (name === "addAccordion") {
                const teamID = Object.keys(prevState).length + 1
                return {
                    ...prevState,
                    [teamID]: {"teamMembers": {}}
                }
            } else if (name === "delAccordion") {
                const copy = {...prevState};
                const lastItem = Object.keys(prevState).slice(-1)
                if (lastItem) {
                     delete copy[lastItem]
                    return{
                        ...copy
                    }
                }
            }
        })
    }

    function teamMemberHandler(e) {
        const { name } = e.target
        const [ btnName, teamID ] = name.split("-")

        setTeams(prevState => {
            const copy = prevState[teamID]

            if (btnName === "btnAddMember") {
                let newMemberID = Object.keys(copy.teamMembers).length + 1
                return {
                    ...prevState,
                    [teamID]: {...copy, "teamMembers":
                            {...copy.teamMembers, [newMemberID]:
                                {serviceNumber: "", name: "", valid: false}}
                    }
                }
            } else if (btnName === "btnDelMember") {
                const lastItem = Object.keys(copy.teamMembers).slice(-1)
                if (lastItem) {
                    delete copy.teamMembers[lastItem]
                    return {
                        ...prevState,
                        [teamID]: {...copy}
                    }
                }
            }
        })
    }

    function memberLookUpHandler(e) {
        const { name } = e.target
        const teamID = name.split("-").slice(-1)

        function validateTeamMember(validatedUsers) {
            // validatedUsers = {"1": true, "2": false}
            // "1" = memberID
            Object.keys(validatedUsers).map(memberID => {
                return (
                    setTeams(prevState => {
                        const copy = prevState[teamID]
                        return {
                            ...prevState,
                            [teamID]: {...copy, "teamMembers":
                                    {...copy.teamMembers, [memberID]:
                                            {...copy.teamMembers[memberID], "valid": validatedUsers[memberID]}
                                    }
                            }
                        }
                    })
                )
            })
        }

        fetch("/validation/lookup", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {
                ...teams[teamID]
            })
        }).then(r =>{
            if (r.status === 200) {
                r.json().then(d => validateTeamMember(d["userLookup"]))
            } else if (r.status === 401) {
                setAuth({})
            }
        })
    }

    function updateTeamMemberEntry(e) {
        const { name, value } = e.target
        //Do not remove unused btnName
        const [ teamID, teamMemberID ] = name.split("-").slice(-2)

        setTeams(prevState => {
            const copy = prevState[teamID]

            return {
                ...prevState,
                [teamID] : {...copy, "teamMembers":
                        {...copy.teamMembers, [teamMemberID]:
                                {...copy.teamMembers[teamMemberID], "serviceNumber": value}}
                }
            }
        })
    }

    return (
        <>
            <Row>
                <Col>
                    <Form.Group className="mb-3 text-center">
                        <Form.Label>Teams</Form.Label>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="text-center mb-3">
                <Accordion>
                    {Object.keys(teams).map(teamID =>(
                        <Accordion.Item eventKey={teamID} key={teamID}>
                            <Accordion.Header>
                                Team {teamID}
                            </Accordion.Header>
                            <Accordion.Body>
                                {Object.keys(teams[teamID]["teamMembers"]).map(teamMemberID => (
                                    <Row key={teamMemberID} className="align-items-center mb-2">
                                        <Col xs={1} md={1}>
                                            <Form.Label>
                                                {teamMemberID}
                                            </Form.Label>
                                        </Col>
                                        <Col xs={11} md={11}>
                                            <Form.Control
                                                name={`teamMemberEntry-${teamID}-${teamMemberID}`}
                                                value={teams[teamID].teamMembers[teamMemberID].serviceNumber}
                                                placeholder="ServiceNumber"
                                                onChange={updateTeamMemberEntry}
                                                className={teams[teamID].teamMembers[teamMemberID].valid ? "is-valid" : ""}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Button name={`btnAddMember-${teamID}`} onClick={teamMemberHandler}>
                                    Add
                                </Button>
                                <Button name={`btnDelMember-${teamID}`} onClick={teamMemberHandler}>
                                    Delete
                                </Button>
                                <Button name={`btnLookUp-${teamID}`} onClick={memberLookUpHandler}>
                                    Search
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Row>
            <Row className="mb-3">
                <Col className="text-center">
                    <Button name="delAccordion" variant="danger" onClick={accordionHandler}>
                        Delete
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button name="addAccordion" variant="success" onClick={accordionHandler}>
                        Add
                    </Button>
                </Col>
            </Row>
        </>
    )
}