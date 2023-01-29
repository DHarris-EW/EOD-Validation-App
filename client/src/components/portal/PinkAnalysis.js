import ScoreCompetency from "../pink/ScoreCompetency";
import { Table } from "react-bootstrap";

export default function PinkAnalysis(props) {

    const { criteria, section, filter } = props

    return (
       <>
       {Object.entries(section).filter((key) => key[0].toLowerCase().includes(filter.section)).map(([name, sectionScoreAvg], index) =>{
            return (
                <Table key={index} bordered size="sm">
                    <thead className="bg-light">
                        <tr>
                            <th className="col-8">
                                {name}
                            </th>
                            <th>
                                <ScoreCompetency scoreAvgPercentage={sectionScoreAvg} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(criteria[name]).filter((key) => key[0].toLowerCase().includes(filter.criteria)).map(([name, scoreAvgPercentage], index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {name}
                                    </td>
                                    <td>
                                        <ScoreCompetency scoreAvgPercentage={scoreAvgPercentage} />
                                    </td>
                                </tr>
                            )
                       })}
                    </tbody>
                </Table>
            )
       })}
       </>
    )
}