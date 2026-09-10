import { useEffect, useState } from "react";
import { getCandidates } from "../api";
import KnownLawsPanel from "./KnownLawsPanel";
import RelationshipTable from "./RelationshipTable";
import ScatterChartCard from "./ScatterChartCard";
import HypothesisPanel from "./HypothesisPanel";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getCandidates().then(setCandidates);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <KnownLawsPanel />
      <h2>All Candidates</h2>
      <RelationshipTable candidates={candidates} onSelect={setSelected} />
      <ScatterChartCard candidate={selected} />
      <HypothesisPanel candidate={selected} />
    </div>
  );
}