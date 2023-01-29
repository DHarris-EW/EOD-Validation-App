import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import getCookie from "../services/GetCookie";
import useAuth from "../hooks/useAuth";
import {Accordion, Nav, Tab, Tabs} from "react-bootstrap";
import { FaPlus, FaMinus, FaSearch } from 'react-icons/fa';

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
                    [teamID]: {teamMembers: {1: {serviceNumber: "", valid: false}}}
                }
            } else if (name === "delAccordion") {
                const lastItem = Object.keys(prevState).slice(-1)
                if (Object.keys(prevState).length > 1) {
                     delete prevState[lastItem]
                    return{
                        ...prevState
                    }
                } else {
                    return{
                        ...prevState
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
                    [teamID]:
                        {...copy,
                            "teamMembers":
                            {...copy.teamMembers,
                                [newMemberID]:
                                    {serviceNumber: "",
                                        valid: false}}
                    }
                }
            } else if (btnName === "btnDelMember") {
                const lastItem = Object.keys(copy.teamMembers).slice(-1)
                console.log(lastItem)
                if (Object.keys(copy.teamMembers).length > 1) {
                    delete copy.teamMembers[lastItem]
                     return {
                            ...prevState,
                            [teamID]: {...copy}
                        }
                } else {
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

        fetch("/validation-management/member-lookup", {
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

        const [ teamID, teamMemberID ] = name.split("-").slice(-2)

        setTeams(prevState => {
            const copy = prevState[teamID]

            return {
                ...prevState,
                [teamID] :
                    {...copy,
                        "teamMembers":
                            {...copy.teamMembers,
                            [teamMemberID]:
                                {...copy.teamMembers[teamMemberID],
                                    "serviceNumber": value}}
                }
            }
        })
    }

    return (
        <>
            <Row>
                <Col className="text-center">
                    <h2>Validation Teams</h2>
                </Col>
            </Row>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row className="p-3">
                <Col xs={7} md={9} className="p-3 border">
                    <Tab.Content>
                {Object.keys(teams).map(teamID =>(
                    <Tab.Pane eventKey={teamID} >
                            {Object.keys(teams[teamID]["teamMembers"]).map(teamMemberID => (
                                <Row key={teamMemberID}  className="align-items-center mb-2">
                                    <Col>
                                        <Form.Control
                                            name={`teamMemberEntry-${teamID}-${teamMemberID}`}
                                            value={teams[teamID].teamMembers[teamMemberID].serviceNumber}
                                            placeholder={`Service Number`}
                                            onChange={updateTeamMemberEntry}
                                            className={teams[teamID].teamMembers[teamMemberID].valid ? "is-valid" : ""}
                                            autoComplete="off"
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Row className="justify-content-end">
                                <Col xs={6} md={3} xl={3} className="mb-3">
                                    <Button name={`btnAddMember-${teamID}`} onClick={teamMemberHandler} className="w-100">
                                        <FaPlus />
                                    </Button>
                                </Col>
                                <Col xs={6} md={3} xl={1} className="mb-3">
                                    <Button name={`btnDelMember-${teamID}`} onClick={teamMemberHandler} className="w-100">
                                        <FaMinus />
                                    </Button>
                                </Col>
                                <Col xs={12} md={3} xl={1}>
                                <Button name={`btnLookUp-${teamID}`} onClick={memberLookUpHandler} className="w-100">
                                    <FaSearch />
                                </Button>
                                </Col>
                            </Row>
                        </Tab.Pane>

                ))}
                        </Tab.Content>
                </Col>
                <Col xs={5} md={3} className="border pt-3">
                <Nav variant="pills" className="flex-column mb-2" >
                    {Object.keys(teams).map(teamID =>(
                        <Nav.Item className="text-center" >
                          <Nav.Link eventKey={teamID} bsPrefix="btn" className="btn-outline-dark w-100 mb-1">Team {teamID}</Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
                    <Row className="mb-3">
                        <Col xs={12} className="text-center mb-2">
                            <Button name="addAccordion" className="w-100" onClick={accordionHandler}>
                                <FaPlus />
                            </Button>
                        </Col>
                        <Col xs={12} className="text-center">
                            <Button name="delAccordion" className="w-100" onClick={accordionHandler}>
                                <FaMinus />
                            </Button>
                        </Col>
                </Row>
                </Col>
            </Row>
            </Tab.Container>
            {/*<Tabs*/}
            {/*    defaultActiveKey="1"*/}
            {/*    id="fill-tab-example"*/}
            {/*    className="mb-3"*/}
            {/*    fill*/}
            {/*>*/}
            {/*    {Object.keys(teams).map(teamID =>(*/}
            {/*        <Tab eventKey={teamID} title={`Team ${teamID}`}>*/}
            {/*            <Row>*/}
            {/*                <Col md={11}>*/}
            {/*                     {Object.keys(teams[teamID]["teamMembers"]).map(teamMemberID => (*/}
            {/*                        <Row key={teamMemberID} className="align-items-center mb-2">*/}
            {/*                            <Col xs={1} md={1}>*/}
            {/*                                <Form.Label>*/}
            {/*                                    {teamMemberID}*/}
            {/*                                </Form.Label>*/}
            {/*                            </Col>*/}
            {/*                            <Col xs={11} md={11}>*/}
            {/*                                <Form.Control*/}
            {/*                                    name={`teamMemberEntry-${teamID}-${teamMemberID}`}*/}
            {/*                                    value={teams[teamID].teamMembers[teamMemberID].serviceNumber}*/}
            {/*                                    placeholder="ServiceNumber"*/}
            {/*                                    onChange={updateTeamMemberEntry}*/}
            {/*                                    className={teams[teamID].teamMembers[teamMemberID].valid ? "is-valid" : ""}*/}
            {/*                                    autoComplete="off"*/}
            {/*                                />*/}
            {/*                            </Col>*/}
            {/*                        </Row>*/}
            {/*                    ))}*/}
            {/*                </Col>*/}
            {/*                <Col md={1}>*/}
            {/*                    <Row className="mb-3">*/}
            {/*                        <Col>*/}
            {/*                            <Button name={`btnAddMember-${teamID}`} onClick={teamMemberHandler}>*/}
            {/*                                <FaPlus />*/}
            {/*                            </Button>*/}
            {/*                        </Col>*/}
            {/*                    </Row>*/}
            {/*                    <Row className="mb-3">*/}
            {/*                        <Col>*/}
            {/*                            <Button name={`btnDelMember-${teamID}`} onClick={teamMemberHandler}>*/}
            {/*                                <FaMinus />*/}
            {/*                            </Button>*/}
            {/*                        </Col>*/}
            {/*                    </Row>*/}
            {/*                    <Row className="mb-3">*/}
            {/*                        <Col>*/}
            {/*                        <Button name={`btnLookUp-${teamID}`} onClick={memberLookUpHandler}>*/}
            {/*                            <FaSearch />*/}
            {/*                        </Button>*/}
            {/*                        </Col>*/}
            {/*                    </Row>*/}
            {/*                </Col>*/}
            {/*            </Row>*/}
            {/*        </Tab>*/}
            {/*    ))}*/}
            {/*</Tabs>*/}
            {/*<Row>*/}
            {/*    <Col>*/}
            {/*        <Form.Group className="mb-3 text-center">*/}
            {/*            <Form.Label>Teams</Form.Label>*/}
            {/*        </Form.Group>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/*<Row className="text-center mb-3">*/}
            {/*    <Accordion>*/}
            {/*        {Object.keys(teams).map(teamID =>(*/}
            {/*            <Accordion.Item eventKey={teamID} key={teamID}>*/}
            {/*                <Accordion.Header>*/}
            {/*                    Team {teamID}*/}
            {/*                </Accordion.Header>*/}
            {/*                <Accordion.Body>*/}
            {/*                    {Object.keys(teams[teamID]["teamMembers"]).map(teamMemberID => (*/}
            {/*                        <Row key={teamMemberID} className="align-items-center mb-2">*/}
            {/*                            <Col xs={1} md={1}>*/}
            {/*                                <Form.Label>*/}
            {/*                                    {teamMemberID}*/}
            {/*                                </Form.Label>*/}
            {/*                            </Col>*/}
            {/*                            <Col xs={11} md={11}>*/}
            {/*                                <Form.Control*/}
            {/*                                    name={`teamMemberEntry-${teamID}-${teamMemberID}`}*/}
            {/*                                    value={teams[teamID].teamMembers[teamMemberID].serviceNumber}*/}
            {/*                                    placeholder="ServiceNumber"*/}
            {/*                                    onChange={updateTeamMemberEntry}*/}
            {/*                                    className={teams[teamID].teamMembers[teamMemberID].valid ? "is-valid" : ""}*/}
            {/*                                    autoComplete="off"*/}
            {/*                                />*/}
            {/*                            </Col>*/}
            {/*                        </Row>*/}
            {/*                    ))}*/}
            {/*                    <Button name={`btnAddMember-${teamID}`} onClick={teamMemberHandler}>*/}
            {/*                        Add*/}
            {/*                    </Button>*/}
            {/*                    <Button name={`btnDelMember-${teamID}`} onClick={teamMemberHandler}>*/}
            {/*                        Delete*/}
            {/*                    </Button>*/}
            {/*                    <Button name={`btnLookUp-${teamID}`} onClick={memberLookUpHandler}>*/}
            {/*                        Search*/}
            {/*                    </Button>*/}
            {/*                </Accordion.Body>*/}
            {/*            </Accordion.Item>*/}
            {/*        ))}*/}
            {/*    </Accordion>*/}
            {/*</Row>*/}
        </>
    )
}