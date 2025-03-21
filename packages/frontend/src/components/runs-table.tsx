import type React from "react";

import {
  Commit as CommitIcon,
  InfoOutlined as InfoOutlinedIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

import type { useRuns } from "../api/use-runs";

export const RunsTable: React.FC<{
  runs: Exclude<ReturnType<typeof useRuns>["data"], undefined>;
}> = ({ runs }) => {
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
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Commit</TableCell>
            {testNameList.map((testName) => (
              <TableCell key={testName}>{testName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow hover key={run.id}>
              <TableCell>
                {format(new Date(run.started_at * 1000), "yyyy-MM-dd HH:mm:ss")}
                <IconButton aria-label="Log" color="inherit" size="large">
                  <NotesIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                {run.commit.slice(0, 7)}
                <IconButton aria-label="Commit" color="inherit" size="large">
                  <CommitIcon />
                </IconButton>
              </TableCell>
              {testNameList.map((testName) => {
                const result = run.results[testName];
                return (
                  <TableCell key={testName}>
                    {result ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <StatusChip status={result.status} />
                        {result.duration !== null && (
                          <Typography color="text.secondary" variant="caption">
                            {result.duration}ms
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      "-"
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

const StatusChip = ({
  status,
}: {
  status: "failure" | "running" | "success";
}) => {
  let color: "error" | "info" | "success";
  let label: string;

  switch (status) {
    case "failure": {
      color = "error";
      label = "失敗";
      break;
    }
    case "running": {
      color = "info";
      label = "実行中";
      break;
    }
    case "success": {
      color = "success";
      label = "成功";
      break;
    }
    default: {
      color = "info";
      label = status;
      break;
    }
  }

  return <Chip color={color} label={label} size="small" />;
};
