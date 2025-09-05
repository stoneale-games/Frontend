import {useAccount, useDisconnect, useEnsAvatar, useEnsName} from 'wagmi'
import {Button} from "@/components/ui/button.tsx";

export function Account() {
    const {address, isConnected} = useAccount()
    const {disconnect,} = useDisconnect()
    const {data: ensName} = useEnsName({address})
    const {data: ensAvatar} = useEnsAvatar({name: ensName!})


    return  isConnected &&  <div>
        {ensAvatar && <img alt="ENS Avatar" src={ensAvatar}/>}
        {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
        <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
}