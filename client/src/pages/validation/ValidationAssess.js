import getCookie from "../../services/GetCookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TeamCard from "../../components/TeamCard";
import LoadingSpinner from "../../components/LoadingSpinner";



export default function ValidationList() {

    const { validation_id } = useParams()
    const [ teams, setTeams ] = useState()

    useEffect(() => {

        fetch(`/validation-management/${validation_id}/all-teams/read`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token'),
            }
        }).then(r => {
            r.json().then(d => {
                setTeams(d)
            })
        })
    }, [])

    return (
         <div className="w-100">
             <h1 className="text-center">Validation Assess</h1>
             {!teams ?
                <LoadingSpinner />
                :
                Object.values(teams).map((team, index) => (
                    <TeamCard team={team} key={index} />
                ))
            }
        </div>
    )
}
