import { useEffect, useState } from "react";

const AppKitButton = (props: React.HTMLAttributes<HTMLElement>) => {
    // @ts-ignore
    return <appkit-button {...props} />;
};

export default function ConnectButton() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Wait until the custom element is defined
        if (customElements.get("appkit-button")) {
            setReady(true);
        } else {
            customElements.whenDefined("appkit-button").then(() => setReady(true));
        }
    }, []);

    if (!ready) {
        return (
            <button
                disabled
                className="px-4 py-2 rounded bg-gray-200 text-gray-500"
            >
                 ...
            </button>
        );
    }

    return <AppKitButton />;
}
