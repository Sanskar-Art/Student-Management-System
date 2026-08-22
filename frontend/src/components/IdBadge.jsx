import { Box } from "@mui/material";
import { tokens } from "../theme";

// The signature visual motif of the app: every record (student, course,
// enrollment) is tagged with a small monospace "catalog tab" badge, evoking
// an index-card registry rather than a generic dashboard row number.
export default function IdBadge({ prefix, value }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: "0.72rem",
        letterSpacing: "0.02em",
        color: tokens.inkNavy,
        backgroundColor: "rgba(28, 37, 65, 0.06)",
        border: `1px solid ${tokens.hairline}`,
        borderLeft: `3px solid ${tokens.ledgerGreen}`,
        borderRadius: "3px",
        padding: "2px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {prefix}-{String(value).padStart(4, "0")}
    </Box>
  );
}
