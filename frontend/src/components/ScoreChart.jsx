import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ScoreChart() {

  const data = [
    { interview: 1, score: 7.5 },
    { interview: 2, score: 8.0 },
    { interview: 3, score: 9.0 },
    { interview: 4, score: 8.5 },
    { interview: 5, score: 9.2 },
    { interview: 6, score: 9.5 }
  ];

  return (

    <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Interview Score Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="interview" />

          <YAxis domain={[0, 10]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default ScoreChart;