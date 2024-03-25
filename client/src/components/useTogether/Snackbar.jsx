import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import React from 'react'

export default function SnackbarContainer({ title, Duration, open }) {
  return (
    <div>
      <Snackbar open={open} autoHideDuration={Duration}>
        <Alert
          severity="success"
          sx={{ width: "100%", backgroundColor: "black", color: "white" }}
        >
          {title}
        </Alert>
      </Snackbar>
    </div>
  );
}
