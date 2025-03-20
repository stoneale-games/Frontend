import { useState } from "react";
import ConnectWallet from "./ConnectWallet";

export default function Web3Auth() {
  // const { address, isConnected } = useAccount();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <ConnectWallet showModal={showModal} setShowModal={setShowModal} />
      {/* <ConfirmModal
        open={open}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      /> */}
    </div>
  );
}
