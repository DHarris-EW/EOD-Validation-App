import {Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useState} from "react";
import DatePicker from "react-datepicker";
import Button from "react-bootstrap/Button";


export default function SearchFilter(props) {

    const { setSearchParams } = props

    const [ data, setData ] = useState({
        validationName: "",
        dateFrom: "",
        dateTo: ""
    })

    function changeHandler(e) {
        const { name, value } = e.target
        setData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    function clickHandler() {
        setSearchParams({...data})
    }

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Validation Name</Form.Label>
                        <Form.Control
                            name="validationName"
                            type="text"
                            value={data.validationName}
                            onChange={changeHandler}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Date From</Form.Label>
                        <DatePicker
                            className="text-center form-control"
                            dateFormat="dd/MM/yyyy"
                            selected={data.dateFrom}
                            onChange={(date) => setData(prevState => {
                                return {
                                    ...prevState,
                                    ["dateFrom"]: date
                                }
                            })}
                            selectsStart
                            startDate={data.dateFrom}
                            endDate={data.dateTo}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Date To</Form.Label>
                        <DatePicker
                            className="text-center form-control"
                            dateFormat="dd/MM/yyyy"
                            selected={data.dateTo}
                            onChange={(date) => setData(prevState => {
                                return {
                                    ...prevState,
                                    ["dateTo"]: date
                                }
                            })}
                            selectsEnd
                            startDate={data.dateFrom}
                            endDate={data.dateTo}
                            minDate={data.dateFrom}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Button onClick={clickHandler}>Filter</Button>
            </Row>
        </Form>
    )
}