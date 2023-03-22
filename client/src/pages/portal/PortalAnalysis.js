import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getCookie from "../../services/GetCookie";
import PinkAnalysis from "../../components/portal/PinkAnalysis";
import PinkPerformanceAnalysis from "../../components/portal/PinkPerformanceAnalysis";
import SearchFilter from "../../components/SearchFilter";
import LoadingSpinner from "../../components/LoadingSpinner";


export default function PortalAdmin() {

    const { userID } = useParams()

    const [ analysis, setAnalysis ] = useState()
    const [ filter, setFilter ] = useState({
        section: "",
        criteria: "",
        pinkType: "EOD",
        displaySelect: "pinkScoreAverages"
    })

    useEffect(() => {
        fetch(`/portal-management/user/${userID}/admin-portal`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": getCookie('csrf_access_token')
            }
        }).then(r => {
            r.json().then(d => {
                setAnalysis({...d})
            })
        })
    }, [])


    return (
        <div>
            {!analysis ?
                <LoadingSpinner />
                :
                <>
                    <SearchFilter filter={filter} setFilter={setFilter} />
                    {filter.displaySelect === "pinkScoreAverages" &&
                        <PinkAnalysis
                            criteria={analysis.trends[filter.pinkType].criteriaAverage}
                            section={analysis.trends[filter.pinkType].sectionScoreAverage}
                            filter={filter}
                        />
                    }
                    {filter.displaySelect === "pinkScoreFreq" &&
                        <PinkAnalysis
                            criteria={analysis.trends[filter.pinkType].criteriaAverage}
                            section={analysis.trends[filter.pinkType].sectionScoreAverage}
                            filter={filter}
                        />
                    }
                    {filter.displaySelect === "performanceTrends" &&
                        <PinkPerformanceAnalysis performanceAnalysis={analysis.performanceTrends}/>
                    }
                </>
            }

        </div>
    )
}