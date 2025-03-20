import { useAccount, useSignMessage } from "wagmi";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { GET_STRING, VERIFY_CHALLENGE } from "../../../graphql/auth_queries";
import ConnectWallet from "./ConnectWallet";
import useAuthStore from "../../store/authStore";
import useEffectWithoutMount from "../../hooks/useEffectWithoutMount";

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
