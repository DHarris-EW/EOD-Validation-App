import {useParams} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Pink from "../../components/Pink";

export default function ViewPink() {
    const { title, serviceNumber } = useParams()
    const { auth } = useAuth()


    return (
        <div className="w-100">
           <Pink state="view" type="ECM" title={title} operator={serviceNumber}/>
        </div>
    )
}