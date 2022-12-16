
import getCookie from "../../services/GetCookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TeamCard from "../../components/TeamCard";



export default function ValidationList() {

    const { title } = useParams()
    const [ teams, setTeams ] = useState()

    useEffect(() => {

        fetch(`/validation/assess/${title}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token'),
                "Content-Type": "application/json"
            },
            body: title
        }).then(r => {
            r.json().then(d => {
                setTeams(d)
            })
        })
    }, [])

    return (
         <div className="w-100">
            <h1 className="text-center">Validation Assess {title}</h1>
            {teams &&
                Object.values(teams).map((team, index) => (
                    <TeamCard team={team} key={index} />
                ))
            }
        </div>
    )
}
