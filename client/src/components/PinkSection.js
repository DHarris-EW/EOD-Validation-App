import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ViewSectionCriteria from "./ViewSectionCritiera";
import {useParams} from "react-router-dom";
import EditableSectionCriteria from "./EditableSectionCriteria";


export default function PinkSection(props) {
    const { state } = useParams()
    const { headerName, headerInfo, setPinkData } = props

    function updateScores(criteriaName, value) {

        if (!headerInfo.passed) {
            setPinkData(prevState => {
                return {
                    ...prevState,
                    "sections": {...prevState["sections"],
                        [headerName]: {...prevState["sections"][headerName],
                            ["passed"]: true
                    }}
                }
            })
        }

        setPinkData(prevState => {
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
                            Math.abs(prevState["sections"][headerName]["criteriaGroup"][criteriaName].score)) + Math.abs(parseFloat(value))
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

    function handleRadioChange(e) {
        const { name, value } = e.target
        const criteriaName = name.split("_").slice(-1)
        updateScores(criteriaName, value)
    }

    return (
        <Card className="mb-3">
            <Card.Header className={headerInfo.passed ? "bg-light" : "bg-danger"}>
                <Row>
                    <Col xs={8} md={8}>
                        {headerName}
                    </Col>
                    <Col xs={1} md={1} className="text-center">
                        {state === "view" ? "1" : <Button onClick={handleClickAll}>1</Button>}
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
                    if (state === "read") {
                        return (
                            <ViewSectionCriteria key={index} name={name} score={criteria.score}/>
                        )
                    } else if (state === "create" || state === "edit") {
                        return (
                            <EditableSectionCriteria key={index} name={name} score={criteria.score} handleRadioChange={handleRadioChange}/>
                        )
                    }

                })}
            </Card.Body>
        </Card>
    )
}