import { useEffect, useState } from "react";
import getCookie from "../../services/GetCookie";
import { useParams } from "react-router-dom";
import PortalSummary from "../../components/portal/PortalSummary";
import PinkList from "../../components/pink/PinkList";
import LoadingSpinner from "../../components/LoadingSpinner";


export default function Portal() {

    const { userID } = useParams()
    const [ portalData, setPortalData ] = useState()
    const [ searchParams, setSearchParams ] = useState()

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
        fetch(`/portal-management/user/${userID}/portal`, options).then(r => {
            r.json().then(d => {
                setPortalData({...d})
            })
        })
    }, [searchParams])

    return (
        <div className="text-center">
            <h1>Portal page</h1>
            {!portalData ?
                <LoadingSpinner />
                :
                <>
                    <PortalSummary data={portalData} />
                    <PinkList pinks={portalData.pinks} portalView={true}/>
                </>
            }
        </div>
    )
}