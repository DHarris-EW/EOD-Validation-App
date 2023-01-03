import {useEffect, useState} from "react";
import getCookie from "../services/GetCookie";
import {useParams} from "react-router-dom";
import PortalSummary from "../components/PortalSummary";
import PinkList from "../components/PinkList";
import PortalAdmin from "../components/PortalAdmin";


export default function Portal() {

    const { userID } = useParams()
    const [portalData, setPortalData] = useState()
    const [searchParams, setSearchParams] = useState()

    useEffect(() => {
        let options = {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token')
            }
        }
        if (searchParams) {
            options["headers"]["Content-Type"] = "application/json"
            options["body"] = JSON.stringify({
                ...searchParams
            })
        }
        console.log(options)
        fetch(`/pink-management/user/${userID}/portal`, options).then(r => {
            r.json().then(d => {
                setPortalData({...d})
            })
        })
    }, [searchParams])

    return (
        <div className="text-center">
        <h1>Portal page</h1>
            {!portalData ? "loading":
                <div className="">
                    {userID !== "admin" ?
                        <div>
                            <PortalSummary data={portalData} />
                            <PinkList pinks={portalData.pinks} portalView={true}/>
                        </div>
                        :
                        <PortalAdmin stats={portalData.stats} setSearchParams={setSearchParams}/>
                    }
                </div>
            }
        </div>
    )
}