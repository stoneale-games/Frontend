const AppKitButton = (props: React.HTMLAttributes<HTMLElement>) => {
    // @ts-ignore
    return <appkit-button {...props} />;
};

export default function ConnectButton() {
    return <AppKitButton />;
}
