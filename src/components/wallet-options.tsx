import * as React from "react";
import { Connector, useConnect, useSignMessage } from "wagmi";
import useAuthStore from "../store/authStore";
import { GET_STRING, VERIFY_CHALLENGE } from "../../graphql/auth_queries";
import { useMutation } from "@apollo/client";

export function WalletOptions({ onClose }: { onClose: () => void }) {
  const { connectors, connect } = useConnect();
  const setToken = useAuthStore((state: any) => state.setToken);
  const [address, setAddress] = React.useState<string | null>(null);
  // const [open, setOpen] = React.useState(false);
  const [signData, setSignData] = React.useState<null | {
    nonce: string;
    isNewUser: boolean;
  }>(null);

  const { signMessageAsync } = useSignMessage();

  const [getString] = useMutation(GET_STRING, {
    onCompleted: async (data) => {
      console.log(data, "g");
      if (data?.requestChallenge?.nonce) {
        console.log(data, "g3");
        setSignData({
          nonce: data.requestChallenge.nonce,
          isNewUser: data.requestChallenge.isNewUser,
        });
        await handleConfirm();
      }
    },
  });

  // useEffectWithoutMount(() => {
  //   if (isConnected && address) {
  //     getString({ variables: { address } });
  //   }
  // }, [isConnected, address]);

  const [verifyChallenge] = useMutation(VERIFY_CHALLENGE, {
    onCompleted: (data) => {
      console.log(data, "v");

      if (data?.verifyChallenge?.session?.token) {
        setToken(data.verifyChallenge.session.token);
      }
      onClose();
    },
  });

  const handleConfirm = async () => {
    if (signData && address) {
      const signature = await signMessageAsync({
        message: signData.nonce as string,
      });
      verifyChallenge({
        variables: {
          address,
          signature,
          nonce: signData?.nonce,
          isNewUser: signData?.isNewUser,
        },
      });
    }
  };
  return (
    <div
      className="flex flex-col gap-4 items-center w-[500px] rounded-lg bg-secondary-950"
      style={{
        padding: "20px",
      }}
    >
      <div className="flex items-center justify-end w-full">
        <button
          onClick={onClose}
          className="border rounded-full py-1 text-xl px-3"
        >
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
                  setAddress(data.accounts[0] as string);
                  getString({ variables: { address: data.accounts[0] } });
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
    <button
      className="px-6 py-5 rounded-lg w-fit border "
      disabled={!ready}
      onClick={onClick}
    >
      {connector.name}
    </button>
  );
}
