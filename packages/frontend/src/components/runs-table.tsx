import type React from "react";

import {
  CheckCircle as CheckCircleIcon,
  Commit as CommitIcon,
  Error as ErrorIcon,
  InfoOutlined as InfoOutlinedIcon,
  Notes as NotesIcon,
  Sync as SyncIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";

import type { useRuns } from "../api/use-runs";

import { unreachable } from "../util";

export const RunsTable: React.FC<{
  runs: Exclude<ReturnType<typeof useRuns>["data"], undefined>;
}> = ({ runs }) => {
  const [isTestNameExpanded, setIsTestNameExpanded] = useState(false);

  const toggleTestNameExpanded = () => {
    setIsTestNameExpanded((prev) => !prev);
  };

  if (runs.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <InfoOutlinedIcon
          sx={{ color: "text.secondary", fontSize: 40, mb: 1 }}
        />
        <Typography color="text.secondary" variant="body1">
          No runs found
        </Typography>
      </Box>
    );
  }

  const testNameSet = new Set<string>();
  for (const run of runs) {
    for (const testName of Object.keys(run.results)) {
      testNameSet.add(testName);
    }
  }
  const testNameList = [...testNameSet].sort();

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table aria-label="Test runs" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Commit</TableCell>
            {testNameList.map((testName, i) => (
              <TableCell align="center" key={testName}>
                <Tooltip title={isTestNameExpanded ? i : testName}>
                  <Box
                    onClick={toggleTestNameExpanded}
                    sx={{ cursor: "pointer" }}
                    whiteSpace="nowrap"
                  >
                    {isTestNameExpanded ? testName : i}
                  </Box>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow hover key={run.id}>
              <TableCell>
                <Box whiteSpace="nowrap">
                  {format(
                    new Date(run.started_at * 1000),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
                  <IconButton aria-label="Log" color="inherit" size="large">
                    <NotesIcon />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box whiteSpace="nowrap">
                  {run.commit.slice(0, 7)}
                  <IconButton aria-label="Commit" color="inherit" size="large">
                    <CommitIcon />
                  </IconButton>
                </Box>
              </TableCell>
              {testNameList.map((testName) => {
                const result = run.results[testName];
                return (
                  <TableCell align="center" key={testName}>
                    {result && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <StatusIcon status={result.status} />
                        {result.duration !== null && (
                          <Typography color="text.secondary" variant="caption">
                            {result.duration}ms
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const StatusIcon = ({
  status,
}: {
  status: "failure" | "running" | "success";
}) => {
  switch (status) {
    case "failure": {
      return (
        <Box sx={{ color: "error.main" }}>
          <ErrorIcon />
        </Box>
      );
    }
    case "running": {
      return (
        <Box sx={{ color: "info.main" }}>
          <SyncIcon />
        </Box>
      );
    }
    case "success": {
      return (
        <Box sx={{ color: "success.main" }}>
          <CheckCircleIcon />
        </Box>
      );
    }
    default: {
      return unreachable(status);
    }
  }
};
