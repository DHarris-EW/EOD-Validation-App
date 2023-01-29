

export default function ScoreCompetency(props) {

    const { scoreAvgPercentage } = props


    return (
        <>
            {}
            {scoreAvgPercentage >= 80 && "HC"}
            {scoreAvgPercentage <= 79 && scoreAvgPercentage >= 50 && "C"}
            {scoreAvgPercentage < 50 && "NC"}
        </>
    )
}