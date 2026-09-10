import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ScatterChartCard({ candidate }) {
  if (!candidate) return null;

  return (
    <div>
      <h3>{candidate.var1} vs {candidate.var2}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="x" name={candidate.var1} />
          <YAxis dataKey="y" name={candidate.var2} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={candidate.sample_points} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}