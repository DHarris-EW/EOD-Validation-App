import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


export default function AssessmentAreaCard(props) {
    const { headerName, headerInfo, setSheetTemplate} = props


    function handleRadioChange(e) {
        const { name, value } = e.target
        const [ index, criteriaName ] = name.split("_").slice(-2)

        updateScores(criteriaName, value)
    }



    function updateScores(criteriaName, value) {

        if (!headerInfo.passed) {
            setSheetTemplate(prevState => {
                return {
                    ...prevState,
                    "sections": {...prevState["sections"],
                        [headerName]: {...prevState["sections"][headerName],
                            ["passed"]: true
                    }}
                }
            })
        }

        setSheetTemplate(prevState => {
            return {
                ...prevState,
                "ready": false,
                "sections": {
                    ...prevState["sections"],
                    [headerName]: {...prevState["sections"][headerName],
                        ["criteriaGroup"]: {
                            ...prevState["sections"][headerName]["criteriaGroup"],
                            [criteriaName]: {
                                ...prevState["sections"][headerName]["criteriaGroup"][criteriaName],
                                "score": value
                            }
                        },
                        ["score"]: (
                            prevState["sections"][headerName]["score"] -
                            prevState["sections"][headerName]["criteriaGroup"][criteriaName].score) + parseFloat(value)
                    }
                }
            }
        })
    }

    function handleClickAll() {
        for (const name of Object.keys(headerInfo.criteriaGroup)) {
            let dom = document.getElementById(`${name}_1`)
            dom.checked = true
            updateScores(name, 1)
        }
    }

    return (
        <Card className="mb-3">
            <Card.Header className={headerInfo.passed ? "bg-light" : "bg-danger"}>
                <Row>
                    <Col xs={8} md={8}>
                        {headerName}
                    </Col>
                    <Col xs={1} md={1} className="text-center">
                        <Button onClick={handleClickAll}>1</Button>
                    </Col>
                    <Col xs={1} md={1} className="text-center">
                        2
                    </Col>
                    <Col xs={1} md={1} className="text-center">
                        3
                    </Col>
                    <Col xs={1} md={1} className="text-center">
                        N/A
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                {Object.entries(headerInfo.criteriaGroup).map(([name, criteria], index) => {
                    return (
                    <Row key={index} className="mb-1">
                        <Col xs={8} md={8}>
                            {name}
                        </Col>
                        <Col xs={1} md={1} className="text-center">
                            <Form.Check type="radio">
                                <Form.Check.Input
                                    type="radio"
                                    id={`${name}_1`}
                                    name={`group_${index}_${name}`}
                                    value="1"
                                    onChange={handleRadioChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                            </Form.Check>
                        </Col>
                        <Col xs={1} md={1} className="text-center">
                            <Form.Check
                                type="radio"
                                id={`${name}_2`}
                                name={`group_${index}_${name}`}
                                value="0.5"
                                onChange={handleRadioChange}
                            />
                        </Col>
                        <Col xs={1} md={1} className="text-center">
                            <Form.Check
                                type="radio"
                                id={`${name}_3`}
                                name={`group_${index}_${name}`}
                                value="0"
                                onChange={handleRadioChange}
                            />
                        </Col>
                        <Col xs={1} md={1} className="text-center">
                            <Form.Check
                                type="radio"
                                id={`${name}_4`}
                                name={`group_${index}_${name}`}
                                value="1"
                                onChange={handleRadioChange}
                            />
                        </Col>
                    </Row>
                )})}
            </Card.Body>
        </Card>
    )
}