import { Settings as SettingsIcon } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

import { useAuth } from "../api/auth";

export const SettingsButton: React.FC = () => {
  const { setToken, token } = useAuth();

  const [open, setIsSettingsOpen] = useState(false);
  const [inputToken, setInputToken] = useState(token ?? "");

  const handleOpen = () => {
    setInputToken(token ?? "");
    setIsSettingsOpen(true);
  };

  const handleSave = () => {
    setToken(inputToken === "" ? undefined : inputToken);
    setIsSettingsOpen(false);
  };

  const handleCancel = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <IconButton
        aria-label="Settings"
        color="inherit"
        onClick={handleOpen}
        size="large"
      >
        <SettingsIcon />
      </IconButton>
      <Dialog
        fullWidth
        onClose={handleCancel}
        open={open}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
            },
          },
        }}
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Token"
            margin="normal"
            onChange={(e) => {
              setInputToken(e.target.value);
            }}
            value={inputToken}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
