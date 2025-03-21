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
  Link,
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
import { format, formatDistanceStrict } from "date-fns";

import type { useConfig, useRuns } from "../api/hooks";

import { useNow } from "../now-provider";
import { unreachable } from "../util";

export const RunsTable: React.FC<{
  config: ReturnType<typeof useConfig>["data"];
  isExpanded?: boolean;
  runs: Exclude<ReturnType<typeof useRuns>["data"], undefined>;
}> = ({ config, isExpanded = false, runs }) => {
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
                <Tooltip title={isExpanded ? i : testName}>
                  <Box whiteSpace="nowrap">{isExpanded ? testName : i}</Box>
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
                  <FormattedTime date={new Date(run.started_at * 1000)} />
                  {config?.github_repo_url && (
                    <Link
                      href={`${config.github_repo_url}/actions/runs/${run.id}`}
                      target="_blank"
                    >
                      <IconButton aria-label="Log" color="inherit" size="large">
                        <NotesIcon />
                      </IconButton>
                    </Link>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box whiteSpace="nowrap">
                  {run.commit.slice(0, 7)}
                  {config?.github_repo_url && (
                    <Link
                      href={`${config.github_repo_url}/commit/${run.commit}`}
                      target="_blank"
                    >
                      <IconButton
                        aria-label="Commit"
                        color="inherit"
                        size="large"
                      >
                        <CommitIcon />
                      </IconButton>
                    </Link>
                  )}
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

export const FormattedTime: React.FC<{ date: Date }> = ({ date }) => {
  const now = useNow();

  const absolute = format(date, "yyyy-MM-dd HH:mm:ss");
  const relative =
    now &&
    formatDistanceStrict(date, now, {
      addSuffix: true,
    });

  return relative ? `${absolute} (${relative})` : absolute;
};
