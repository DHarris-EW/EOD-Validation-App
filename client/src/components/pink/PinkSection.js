import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FaCheck } from "react-icons/fa";

export default function PinkSection(props) {

    const { pinkType, sectionName, sectionData, state, setPinkData } = props

    function updateScores(criteriaName, value) {

        if (!sectionData.passed) {
            setPinkData(prevState => {
                return {
                    ...prevState,
                    "sections": {...prevState["sections"],
                        [sectionName]: {...prevState["sections"][sectionName],
                            "passed": true
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
                    [sectionName]: {
                        ...prevState["sections"][sectionName],
                        "criteriaGroup": {
                            ...prevState["sections"][sectionName]["criteriaGroup"],
                            [criteriaName]: {
                                ...prevState["sections"][sectionName]["criteriaGroup"][criteriaName],
                                "score": value
                            }
                        },
                        "score": (
                            prevState["sections"][sectionName]["score"] -
                            Math.abs(prevState["sections"][sectionName]["criteriaGroup"][criteriaName].score)) + Math.abs(parseFloat(value))
                    }
                }
            }
        })
    }

    function handleRadioChange(e) {
        const { name, value } = e.target

        const criteriaName = name.split("_").slice(-1)
        updateScores(criteriaName, value)
    }

    function handleClickAll() {
        for (const name of Object.keys(sectionData.criteriaGroup)) {
            let dom = document.getElementById(`${sectionName}_${name}_1`)
            dom.checked = true
            updateScores(name, 1)
        }
    }

    return (
        <Table bordered size="sm" className={sectionData.passed ? "bg-body" : "bg-danger"}>
            <thead>
                <tr>
                    <th className="col-8 bg-light">
                        {sectionName}
                    </th>
                    <th className="col-1 text-center bg-light">
                        {state === "read" ? pinkType !== "ECM" ? "HC" : "1" : <Button variant="outline-dark" className="fw-bold pb-0 border-0" onClick={handleClickAll}>{pinkType !== "ECM" ? "HC" : "1"}</Button>}
                    </th>
                    <th className="col-1 text-center bg-light">
                        {pinkType !== "ECM" ? "C" : "2"}
                    </th>
                    <th className="col-1 text-center bg-light">
                        {pinkType !== "ECM" ? "NC" : "3"}
                    </th>
                    <th className="col-1 text-center bg-light">
                        N/A
                    </th>
                </tr>
            </thead>
            <tbody>
                 {Object.entries(sectionData.criteriaGroup).map(([criteriaName, criteria], index) => {
                     return(
                         <tr key={index}>
                             <td>
                                 {criteriaName}
                             </td>
                             <td className="text-center">
                                 {state === "read" ?
                                     <>
                                          {criteria.score === 1 ? <FaCheck />  : ""}
                                     </>
                                   :
                                    <Form.Check type="radio">
                                        <Form.Check.Input
                                            type="radio"
                                            id={`${sectionName}_${criteriaName}_1`}
                                            name={`${sectionName}_${criteriaName}`}
                                            value="1"
                                            onChange={handleRadioChange}
                                            checked={parseFloat(criteria.score) === 1}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                                    </Form.Check>
                                 }

                             </td>
                             <td className="text-center">
                                 {state === "read" ?
                                     <>
                                          {criteria.score === 0.5 ? <FaCheck />  : ""}
                                     </>
                                   :
                                    <Form.Check type="radio">
                                        <Form.Check.Input
                                            type="radio"
                                            id={`${sectionName}_${criteriaName}_2`}
                                            name={`${sectionName}_${criteriaName}`}
                                            value="0.5"
                                            onChange={handleRadioChange}
                                            checked={parseFloat(criteria.score) === 0.5}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                                    </Form.Check>
                                 }
                             </td>
                             <td className="text-center">
                                 {state === "read" ?
                                     <>
                                          {criteria.score === 0 ? <FaCheck />  : ""}
                                     </>
                                   :
                                    <Form.Check type="radio">
                                        <Form.Check.Input
                                            type="radio"
                                            id={`${sectionName}_${criteriaName}_3`}
                                            name={`${sectionName}_${criteriaName}`}
                                            value="0"
                                            onChange={handleRadioChange}
                                            checked={parseFloat(criteria.score) === 0}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                                    </Form.Check>
                                 }
                             </td>
                             <td className="text-center">
                                 {state === "read" ?
                                     <>
                                          {criteria.score === -1 ? <FaCheck />  : ""}
                                     </>
                                   :
                                    <Form.Check type="radio">
                                        <Form.Check.Input
                                            type="radio"
                                            id={`${sectionName}_${criteriaName}_4`}
                                            name={`${sectionName}_${criteriaName}`}
                                            value="-1"
                                            onChange={handleRadioChange}
                                            checked={parseFloat(criteria.score) === -1}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid" className="text-nowrap">Please select an option</Form.Control.Feedback>
                                    </Form.Check>
                                 }
                             </td>
                         </tr>
                     )
                 })}
            </tbody>
        </Table>
    )
}