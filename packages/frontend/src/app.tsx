import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

import { ClientProvider } from "./api/client-provider";
import { useRuns } from "./api/use-runs";
import { RunsTable } from "./components/runs-table";
import { SettingsButton } from "./components/settings-modal";
import { theme } from "./theme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClientProvider>
        <Contents />
      </ClientProvider>
    </ThemeProvider>
  );
};

export default App;

const Contents: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
            Maglev Dashboard
          </Typography>
          <SettingsButton />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ flexGrow: 1, mb: 4, mt: 4 }}>
        <Main />
      </Container>
    </Box>
  );
};

const Main: React.FC = () => {
  const { data: runs, error, isLoading } = useRuns();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error !== undefined) {
    return (
      <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
        Failed to fetch runs:{" "}
        {error instanceof Error ? error.message : "unknown error"}
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
      <RunsTable runs={runs ?? []} />
    </Paper>
  );
};
