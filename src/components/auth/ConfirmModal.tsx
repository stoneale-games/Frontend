import { Modal, Box, Typography, Button } from "@mui/material";

export default function ConfirmModal({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Confirm Hashing
        </Typography>
        <Typography variant="body1" gutterBottom>
          Do you want to proceed with hashing and sending the data?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          sx={{ mr: 2 }}
        >
          Confirm
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}
