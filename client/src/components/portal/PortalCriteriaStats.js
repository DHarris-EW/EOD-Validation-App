import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


export default function PortalCriteriaStats(props) {

    const { criteriaAverage } = props

    return (
        <ListGroup horizontal className="mb-3">
            {Object.entries(criteriaAverage).map(([score, criteria], i) => {
                return (
                    <ListGroup.Item key={i} className="p-0">
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3 className="m-0">{score}</h3>
                            </ListGroup.Item>
                        {Object.entries(criteria).sort((criteriaName, scoreAvg) => ( scoreAvg[1] - criteriaName[1] ))
                            .slice(0,3)
                            .map(([criteriaName, scoreAvg], j) => {
                                return (
                                    <ListGroup.Item key={j}>
                                        <Row>
                                            <Col md={11}>
                                                <h5 className="m-0">{criteriaName}</h5>
                                            </Col>
                                            <Col md={1}>
                                                <h5 className="m-0">{scoreAvg}</h5>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                            )
                        }
                        </ListGroup>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    )
}