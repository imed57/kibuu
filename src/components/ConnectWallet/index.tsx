import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export const CustomConnect = () => {
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
                                        <button
                                            onClick={openConnectModal}
                                            type="button"
                                            style={{
                                                backgroundColor: "#007bff",  // Primary button color
                                                color: "#fff",               // White text color
                                                border: "none",              // Remove border
                                                padding: "10px 20px",        // Button padding
                                                borderRadius: "8px",         // Rounded corners
                                                fontSize: "16px",            // Font size
                                                cursor: "pointer",           // Cursor change on hover
                                                transition: "background-color 0.3s", // Smooth transition
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}  // Darker color on hover
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#007bff"}  // Restore original color
                                        >
                                            Connect Wallet
                                        </button>
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
                                                backgroundColor: "#007bff",  // Green for account button
                                                color: "#fff",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
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

export const BasciConnect = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <ConnectButton></ConnectButton>
        </div>
    );
};
