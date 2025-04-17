import * as React from "react";
import { Connector, useConnect, useDisconnect, useSignMessage } from "wagmi";
import useAuthStore from "../store/authStore";
import { GET_STRING, VERIFY_CHALLENGE } from "../../graphql/auth_queries";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

export function WalletOptions({ onClose }: { onClose: () => void }) {
  const { connectors, connect } = useConnect();
  const [address, setAddress] = React.useState<`0x${string}`>();
  const { disconnect } = useDisconnect();
  const setToken = useAuthStore((state: any) => state.setToken);
  const { signMessageAsync } = useSignMessage();

  // Mutation to get the nonce from the server
  const [getString] = useMutation(GET_STRING, {
    onCompleted: async (data) => {
      if (!address) {
        toast.error("No connected address found.");
        console.error("No connected address found.");
        return;
      }

      console.log("Nonce received:", data?.requestChallenge?.nonce);
      console.log("Signing address:", address);

      try {
        const signature = await signMessageAsync({
          message: data.requestChallenge.nonce as string,
          account: address, // Ensure correct address is used
        });

        verifyChallenge({
          variables: {
            address, // Pass the exact connected address
            signature,
            nonce: data.requestChallenge.nonce,
            isNewUser: data.requestChallenge.isNewUser,
          },
        });
        toast.success("Message signed successfully");
      } catch (error) {
        disconnect();
        toast.error("Error signing message");
        console.error("Error signing message:", error);
      }
    },
    onError: (error) => {
      disconnect();
      toast.error("Error requesting challenge ");
      console.error("GraphQL Error:", error);
    },
  });

  // Mutation to verify the signed message
  const [verifyChallenge] = useMutation(VERIFY_CHALLENGE, {
    onCompleted: (data) => {
      if (data?.verifyChallenge?.session?.token) {
        setToken(data.verifyChallenge.session.token);
      }
      onClose();
    },
    onError: (error) => {

      alert("Error verifying challenge string");
      disconnect();
      toast.error("Error verifying challenge string");
      console.error("GraphQL Error:", error);
    },
  });

  return (
    <div className="flex flex-col gap-4 items-center w-[500px] rounded-lg dark:bg-primary-100 bg-secondary-950  p-5">
      <div className="flex items-center justify-end w-full">
        <button onClick={onClose} className="border rounded-full py-1 text-xl px-3">
          x
        </button>
      </div>
      <p className="text-xl font-bold">Connect to Wallet</p>
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() =>
            connect(
              { connector },
              {
                onSuccess: (data) => {
                  // console.log("Connected Wallet Address:", data.accounts[0]);
                  // setAddress(data.accounts[0]);
                  // if (data.accounts[0]) {
                  //   getString({ variables: { address: data.accounts[0] } });
                  // } else {

                  //   console.log("Stored address:", address);
                  //   disconnect();
                  //   setAddress(undefined);
                  //   console.error("Wallet address mismatch detected.");
                  // }
                  setToken("token");
                },
              }
            )
          }
        />
      ))}
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button className="px-6 py-5 rounded-lg w-fit border " disabled={!ready} onClick={onClick}>
      {connector.name}
    </button>
  );
}
