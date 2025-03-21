import type React from "react";

import type { useRuns } from "../api/use-runs";

export const RunsTable: React.FC<{
  runs: Exclude<ReturnType<typeof useRuns>["data"], undefined>;
}> = ({ runs }) => {
  if (runs.length === 0) {
    return <div>テスト実行データがありません</div>;
  }

  const testNameSet = new Set<string>();
  for (const run of runs) {
    for (const testName of Object.keys(run.results)) {
      testNameSet.add(testName);
    }
  }
  const testNameList = [...testNameSet].sort();

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={cellStyle}>実行ID</th>
          <th style={cellStyle}>コミット</th>
          <th style={cellStyle}>開始時間</th>
          {testNameList.map((testName) => (
            <th key={testName} style={cellStyle}>
              {testName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr key={run.id}>
            <td style={cellStyle}>{run.id}</td>
            <td style={cellStyle}>{run.commit}</td>
            <td style={cellStyle}>
              {new Date(run.started_at).toLocaleString()}
            </td>
            {testNameList.map((testName) => {
              const result = run.results[testName];
              return (
                <td key={testName} style={cellStyle}>
                  {result ? (
                    <div>
                      <StatusBadge status={result.status} />
                      {result.duration !== null && (
                        <div>{result.duration}ms</div>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left" as const,
};

const StatusBadge = ({
  status,
}: {
  status: "failure" | "running" | "success";
}) => {
  let backgroundColor;
  const textColor = "white";

  switch (status) {
    case "failure": {
      backgroundColor = "#F44336"; // 赤
      break;
    }
    case "running": {
      backgroundColor = "#2196F3"; // 青
      break;
    }
    case "success": {
      backgroundColor = "#4CAF50"; // 緑
      break;
    }
    default: {
      backgroundColor = "#9E9E9E"; // グレー
      break;
    }
  }

  return (
    <span
      style={{
        backgroundColor,
        borderRadius: "4px",
        color: textColor,
        display: "inline-block",
        fontSize: "0.8em",
        padding: "3px 6px",
      }}
    >
      {status}
    </span>
  );
};
