import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import { WalletOptions } from "../wallet-options";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "transparent",
  border: "0px solid #000",
  pt: 2,
  px: 4,
  pb: 3,
};

function ConnectWallet({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  return (
    <>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={style}>
          <WalletOptions onClose={() => setShowModal(false)} />
        </Box>
      </Modal>
      <button
        onClick={() => setShowModal(true)}
        className="dark:bg-primary-100 bg-secondary-950 px-4 h-10 flex items-center border border-secondary-100 rounded-md dark:text-secondary-100"
      >
        Connect Wallet
      </button>
    </>
  );
}

export default ConnectWallet;
