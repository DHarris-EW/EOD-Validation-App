import {Spinner} from "react-bootstrap";


export default function LoadingSpinner() {
    return (
        <Spinner animation="border" role="status" className="text-center">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
    )
}