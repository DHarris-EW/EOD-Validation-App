import PortalCriteriaStats from "./PortalCriteriaStats";
import PortalHeaderStats from "./PortalHeaderStats";
import SearchFilter from "./SearchFilter";


export default function PortalAdmin(props) {

    const { stats, setSearchParams } = props

    return (
        <div>
            <SearchFilter setSearchParams={setSearchParams} />
            <PortalCriteriaStats criteriaScoreFrequency={stats.criteriaScoreFrequency} />
            <PortalHeaderStats headerScoreAvg={stats.headerScoreAvg} />
        </div>
    )
}