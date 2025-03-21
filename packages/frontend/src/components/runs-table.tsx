import type React from "react";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

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
      <Table size="medium" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Run ID</TableCell>
            <TableCell>Commit</TableCell>
            <TableCell>Start</TableCell>
            {testNameList.map((testName) => (
              <TableCell key={testName}>{testName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {runs.map((run) => (
            <TableRow hover key={run.id}>
              <TableCell>{run.id}</TableCell>
              <TableCell>{run.commit}</TableCell>
              <TableCell>{new Date(run.started_at).toLocaleString()}</TableCell>
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
