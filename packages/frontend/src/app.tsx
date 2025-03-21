import React from "react";

import { AuthProvider } from "./api/auth-provider";
import { ClientProvider } from "./api/client-provider";
import { RunsTable } from "./components/runs-table";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ClientProvider>
        <Contents />
      </ClientProvider>
    </AuthProvider>
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
