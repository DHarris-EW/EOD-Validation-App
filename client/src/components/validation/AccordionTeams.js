import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import getCookie from "../services/GetCookie";
import useAuth from "../hooks/useAuth";
import { Card, Nav, Tab } from "react-bootstrap";
import { FaPlus, FaMinus, FaSearch } from 'react-icons/fa';

export default function AccordionTeams(props) {
    const { setAuth } = useAuth()
    const { teams, rotas, setValidation } = props


    function accordionHandler(e) {
        const { name } = e.target

        setValidation(prevState => {
            if (name === "addAccordion") {
                const teamID = Object.keys(prevState["teams"]).length + 1
                return {
                    ...prevState,
                    "teams": {...prevState["teams"],
                    [teamID]: {teamMembers: {1: {serviceNumber: "", valid: false}}, rota: 1}}
                }
            } else if (name === "delAccordion") {
                const lastItem = Object.keys(prevState["teams"]).slice(-1)
                if (Object.keys(prevState["teams"]).length > 1) {
                    delete teams[lastItem]
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

        setValidation(prevState => {

            if (btnName === "btnAddMember") {
                let newMemberID = Object.keys(prevState["teams"][teamID]["teamMembers"]).length + 1
                return {
                    ...prevState,
                    "teams":
                    {...prevState["teams"],
                    [teamID]:
                        {...prevState["teams"][teamID],
                            "teamMembers":
                                {...prevState["teams"][teamID]["teamMembers"],
                                    [newMemberID]: {
                                        serviceNumber: "",
                                        valid: false
                                    }
                                },
                            "rota": 1
                        }
                    }
                }
            } else if (btnName === "btnDelMember") {
                const lastItem = Object.keys(prevState["teams"][teamID]["teamMembers"]).slice(-1)
                if (Object.keys(prevState["teams"][teamID]["teamMembers"]).length > 1) {
                    delete prevState["teams"][teamID]["teamMembers"][lastItem]
                     return {
                            ...prevState,
                        }
                } else {
                    return {
                            ...prevState,
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
                    setValidation(prevState => {
                        return {
                            ...prevState,
                            "teams":
                                {...prevState["teams"],
                                [teamID]:
                                    {...prevState["teams"][teamID],
                                    "teamMembers":
                                        {...prevState["teams"][teamID]["teamMembers"],
                                        [memberID]:
                                            {...prevState["teams"][teamID]["teamMembers"][memberID],
                                            "valid": validatedUsers[memberID]}
                                        }
                            }}
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

        setValidation(prevState => {
            return {
                ...prevState,
                "teams":
                    {...prevState["teams"],
                        [teamID] :
                        {...prevState["teams"][teamID],
                            "teamMembers":
                                {...prevState["teams"][teamID]["teamMembers"],
                                    [teamMemberID]:
                                        {"serviceNumber": value,
                                            "valid": false}
                                }
                        }
                    }
            }
        })
    }

    function changeHandler(e) {
        const { name, value } = e.target
        const teamID = name.split("_").slice(-1)
        setValidation(prevState => {
            return {
                ...prevState,
                "teams":
                    {...prevState["teams"],
                        [teamID] :
                            {...prevState["teams"][teamID],
                                "rota": value
                            }
                    }
            }
        })
    }

    return (
        <Card className="mb-3">
            <Card.Header>
                <h4 className="text-center mb-0">Teams</h4>
            </Card.Header>
            <Card.Body className="pt-0 pb-0">
                <Tab.Container defaultActiveKey="1">
                    <Row>
                        <Col xs={7} md={9} className="p-3 border border-start-0 border-top-0 border-bottom-0">
                            <Tab.Content>
                                {Object.keys(teams).map((teamID, index) =>(
                                    <Tab.Pane key={index} eventKey={teamID} >
                                        <Row className="mb-3">
                                            <Col>
                                                <Form.Label>Rota</Form.Label>
                                                <Form.Select name={`rota_${teamID}`} onChange={changeHandler}>
                                                    {Object.entries(rotas).map(([rotaID, rotaData], index) =>
                                                        (
                                                        <option key={index} value={index+1}>
                                                            Rota {index + 1} - {rotaData.startDate.toLocaleString().split(",")[0]} - {rotaData.endDate.toLocaleString().split(",")[0]}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label>Members</Form.Label>
                                            </Col>
                                        </Row>
                                        {Object.keys(teams[teamID]["teamMembers"]).map((teamMemberID, index) => (
                                            <Row key={index} className="align-items-center mb-2">
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
                        <Col xs={5} md={3} className="mt-3 align-self-center">
                            <Nav variant="pills" className="mb-2 overflow-auto w-100 mw-100" style={{maxHeight: 250}}>
                                {Object.keys(teams).map((teamID, index) =>(
                                    <Nav.Item key={index} className="text-center w-100" >
                                      <Nav.Link eventKey={teamID} bsPrefix="btn" className="btn-outline-dark w-100 mb-1">Team {index + 1}</Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                            <Row className="mb-3">
                                <Col xs={12} className="text-center mb-2">
                                    <Button name="addAccordion" className="w-100" onClick={accordionHandler}>
                                        <FaPlus />
                                    </Button>
                                </Col>
                                <Col xs={12} className="text-center mb-3">
                                    <Button name="delAccordion" className="w-100" onClick={accordionHandler}>
                                        <FaMinus />
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </Tab.Container>
            </Card.Body>

        </Card>
    )
}