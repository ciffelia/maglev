import React from "react";

import { ClientProvider } from "./api/client-provider";
import { useRuns } from "./api/use-runs";
import { RunsTable } from "./components/runs-table";

const App: React.FC = () => {
  return (
    <ClientProvider>
      <Contents />
    </ClientProvider>
  );
};

export default App;

const Contents: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Main />
    </div>
  );
};

const Main: React.FC = () => {
  const { data: runs, error, isLoading } = useRuns();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return <div>Error: {String(error)}</div>;
  }

  return runs && <RunsTable runs={runs} />;
};
