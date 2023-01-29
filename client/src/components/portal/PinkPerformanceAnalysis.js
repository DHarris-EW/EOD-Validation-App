import Table from "react-bootstrap/Table";

export default function PinkPerformanceAnalysis(props) {

    const { performanceAnalysis } = props

    return (
        <Table bordered size="sm" className="text-center">
            <thead className="bg-light">
            <tr>
                <th>Most Common Bigrams & Trigrams </th>
            </tr>
            </thead>
            <tbody>
                    {Object.values(performanceAnalysis).map((item, i) => {
                        return (
                            <tr>
                                <td>
                                    {item}
                                </td>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    )
}