import {useEffect, useState} from "react";
import getCookie from "../services/GetCookie";
import PinkForm from "../components/PinkForm";
import {useParams} from "react-router-dom";


export default function Pink() {
    const { title, userID, pinkID, state } = useParams()

    const [pinkData, setPinkData] = useState()
    console.log(state)
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

    return (
        <div className="w-100">
            <h1 className="text-center">Validation Assessment Sheet</h1>
            {!pinkData ? "Loading" :
                <PinkForm pinkData={pinkData} setPinkData={setPinkData} />
            }
        </div>
    )
}