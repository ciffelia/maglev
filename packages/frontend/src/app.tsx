import React from "react";

import { ClientProvider } from "./api/client-provider";
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
      <RunsTable />
    </div>
  );
};
