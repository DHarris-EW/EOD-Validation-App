import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

import PinkSection from "../../components/pink/PinkSection";
import PinkPerformance from "../../components/pink/PinkPerformance";
import PinkECMHeader from "../../components/pink/PinkECMHeader";
import PinkEODHeader from "../../components/pink/PinkEODHeader";

import getCookie from "../../services/GetCookie";
import useMessage from "../../hooks/useMessage";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ReactToPrint from 'react-to-print';


export default function Pink() {
    const { title, userID, pinkID, state } = useParams()

    const [pinkData, setPinkData] = useState()
    const componentRef = useRef()
    const [ validated, setValidated ] = useState(false)
    const { setMessage } = useMessage()
    const navigate = useNavigate()
    const location = useLocation()

    const pinkType = "EOD"

    try {
        console.log(location.state.member)
    } catch (TypeError) {
        console.log("err")
    }


    const performanceHeader = {
        "ECM": {
            title: "Assessor's Assessment Of Performance",
            description: "In the space below provide your opinion of the ECM Operator's performance to assist in " +
                "their development and feedback. Each section allows for the ECM DS to subjectively assess the ECM " +
                "Operator and mark down by a total of 5% in each section."
        },
        "EOD": {
            title: "Assessor's Subjective Assessment Of Performance: Justify Any Reason For Failure",
            description: "In the space below provide your opinion of the EOD Operator's performance to assist in the " +
                "completion of course reports and overall score."
        }
    }

    useEffect(() => {
        let url = "/pink-management"
        if (state === "create") {
            // (API) returns blank pink with user details and validation title inserted
            url += `/validation/${title}/user/${userID}/blank-pink`
        } else if (state === "edit" || state === "read") {
            // (API) returns populated pink by ID
            url += `/pink/${pinkID}/read`
        }

        fetch(url,{
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token')
            }
        }).then(r => {
            r.json().then(d => {
                setPinkData({...d})
            })
        })
    }, [])

    function sumbitHandler(e) {
        e.preventDefault()
        const form = e.currentTarget
        setValidated(true)
        let url = "/pink-management"

        if (state === "edit") {
            url += `/pink/${pinkID}/edit`
        } else if (state === "create") {
            url += `/user/${pinkData.operator.id}/create`
        }

        if (form.checkValidity()) {
            if (pinkData.ready) {
                fetch(url, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...pinkData
                    })
                }).then(r => {
                    if (r.ok) {
                        r.json().then(d => {
                            setMessage({"text": d.msg.text, "type": d.msg.type})
                            navigate(-1)
                        })
                    }
                })
            } else {
                let passed = true
                let score = 0

                for (const [sectionName, sectionData] of Object.entries(pinkData.sections)) {
                    let numOfSafety = 0
                    const maxScore = Object.values(sectionData.criteriaGroup).length
                    const scorePercentage = (((sectionData.score / maxScore) * 100) - sectionData.percentageAdjustment) - (numOfSafety * 15)

                    score += sectionData.score

                    for (const criteriaData of Object.values(sectionData.criteriaGroup)) {
                        if ((criteriaData.score > -1 && criteriaData.score < 1) && criteriaData.safety) {
                            numOfSafety += 1
                        }
                    }

                    if ((pinkType === "ECM" && scorePercentage < 75) || (pinkType === "EOD" && scorePercentage < 50)) {
                        setPinkData(prevState => {
                            return {
                                ...prevState,
                                "passed": false,
                                "sections": {
                                    ...prevState["sections"],
                                    [sectionName]: {
                                        ...prevState["sections"][sectionName],
                                        "passed": false
                                    }
                                }
                            }
                        })
                    }
                }

                setPinkData(prevState => {
                    return {
                        ...prevState,
                        "ready": true,
                        "passed": passed,
                        "score": score
                    }
                })
            }
        }
    }

    function changeHandler(e) {
        const {name, value} = e.target

        setPinkData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    return (
        <div className="w-100">
            <h1 className="text-center">Validation Assessment Sheet</h1>
            {!pinkData ? "Loading" :
                <Form noValidate validated={validated} onSubmit={sumbitHandler} style={{padding:20}} ref={componentRef}>
                    {pinkType === "ECM" && <PinkECMHeader state={state} pinkData={pinkData} changeHandler={changeHandler} />}
                    {pinkType === "EOD" && <PinkEODHeader state={state} pinkData={pinkData} changeHandler={changeHandler} />}
                    {Object.entries(pinkData.sections).map(([sectionName, sectionData], index) => {
                        return (
                            <PinkSection
                                key={index}
                                pinkType={pinkType}
                                sectionName={sectionName}
                                sectionData={sectionData}
                                state={state}
                                setPinkData={setPinkData}
                            />
                        )
                    })}
                    <PinkPerformance
                        state={state}
                        pinkData={pinkData}
                        setPinkData={setPinkData}
                        title={performanceHeader[pinkType].title}
                        description={performanceHeader[pinkType].description}
                    />
                    {state === "read" &&
                        <ReactToPrint
                            trigger={() => <button>Print this out!</button>}
                            content={() => componentRef.current}
                        />
                    }
                    {state !== "read" && <Button className="w-100" type="sumbit">{!pinkData.ready ? "Calculate" : "Sumbit"}</Button>}
                </Form>
            }
        </div>
    )

}