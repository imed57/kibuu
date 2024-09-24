import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/router";

export const CustomConnect = () => {
    const router = useRouter();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",  // Horizontally center
                alignItems: "center",       // Vertically center
                height: "10vh",            // Full viewport height to center the button vertically
            }}
        >
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                        ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                    // If connected, redirect to home page
                    if (connected) {
                    }

                    return (
                        <div
                            {...(!ready && {
                                "aria-hidden": true,
                                style: {
                                    opacity: 0,
                                    pointerEvents: "none",
                                    userSelect: "none",
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <div
                                            onClick={openConnectModal}  // Trigger connection when the image is clicked
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Image
                                                src="/kibu-pp.png"  // Replace with the path to your image
                                                alt="Connect Wallet"
                                                width={250}  // Set image width
                                                height={250} // Set image height
                                                style={{ borderRadius: "8px" }}  // Optional: make image corners rounded
                                            />
                                        </div>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <button
                                            onClick={openChainModal}
                                            type="button"
                                            style={{
                                                backgroundColor: "#dc3545",   // Red color for wrong network
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
                                        >
                                            Wrong Network
                                        </button>
                                    );
                                }

                                return (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <button
                                            onClick={openAccountModal}
                                            type="button"
                                            style={{
                                                backgroundColor: "#007bff",  // Button styling
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                                        >
                                            {account.displayName}
                                            {account.displayBalance ? ` (${account.displayBalance})` : ""}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    );
};
