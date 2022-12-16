import {useParams} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Pink from "../../components/Pink";

export default function AssessPink(props) {
    const { title, serviceNumber } = useParams()
    const { auth } = useAuth()


    return (
        <div className="w-100">
           <Pink state="assess" type="ECM" title={title} operator={serviceNumber}/>
        </div>
    )
}