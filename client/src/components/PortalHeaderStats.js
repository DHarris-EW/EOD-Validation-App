import {ListGroup} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function PortalHeaderStats(props) {

    const { headerScoreAvg } = props

    return (
       <ListGroup>
           <ListGroup.Item>
               <Row>
                   <Col>
                       <h3>Header Name</h3>
                   </Col>
                   <Col>
                       <h3>Avg Score %</h3>
                   </Col>
               </Row>
           </ListGroup.Item>
           {Object.entries(headerScoreAvg).map(([headerName, avg], i) => {
                return (
                    <ListGroup.Item key={i}>
                        <Row>
                            <Col>
                                <h5>{headerName}</h5>
                            </Col>
                            <Col>
                                <h5>{avg}</h5>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )
           })}
       </ListGroup>
    )
}