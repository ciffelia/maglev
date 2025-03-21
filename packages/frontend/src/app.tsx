import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { ClientProvider } from "./api/client-provider";
import { useConfig, useRuns } from "./api/hooks";
import { RunsTable } from "./components/runs-table";
import { SettingsButton } from "./components/settings-modal";
import { NowProvider } from "./now-provider";
import { theme } from "./theme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NowProvider>
        <ClientProvider>
          <Contents />
        </ClientProvider>
      </NowProvider>
    </ThemeProvider>
  );
};

export default App;

const Contents: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography component="h1" sx={{ flexGrow: 1 }} variant="h6">
            Maglev Dashboard
          </Typography>
          <SettingsButton />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ flexGrow: 1, mb: 4, mt: 4 }}>
        <Main />
      </Container>
    </Box>
  );
};

const Main: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: config } = useConfig();
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
    <>
      <FormControlLabel
        control={
          <Switch
            checked={isExpanded}
            onChange={(e) => {
              setIsExpanded(e.target.checked);
            }}
          />
        }
        label="Display test names"
      />
      <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
        <RunsTable config={config} isExpanded={isExpanded} runs={runs ?? []} />
      </Paper>
    </>
  );
};
