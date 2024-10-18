import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ethers } from "ethers";

export const CustomConnect = () => {
    const router = useRouter();

    // Define Base chain ID (8453 for Base mainnet)
    const BASE_CHAIN_ID = 8453;

    // Function to switch to the Base chain
    const switchToBaseChain = async () => {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: ethers.utils.hexValue(BASE_CHAIN_ID) }], // Chain ID in hexadecimal format
            });
        } catch (switchError) {
            // This error code means the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: ethers.utils.hexValue(BASE_CHAIN_ID),
                                chainName: "Base",
                                rpcUrls: ["https://mainnet.base.org"], // RPC URL for the Base chain
                                nativeCurrency: {
                                    name: "ETH",
                                    symbol: "ETH",
                                    decimals: 18,
                                },
                                blockExplorerUrls: ["https://basescan.org"],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error("Failed to add Base chain:", addError);
                }
            } else {
                console.error("Failed to switch to Base chain:", switchError);
            }
        }
    };

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
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                        ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useEffect(() => {
                        // Automatically switch to Base chain if connected to the wrong network
                        if (connected && chain.id !== BASE_CHAIN_ID) {
                            switchToBaseChain();
                        }

                        // Redirect to home page if the wallet is connected
                        if (connected && chain.id === BASE_CHAIN_ID) {
                            router.push('/home'); // Redirect to home page
                        }
                    }, [connected, chain]);

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
                                            style={{
                                                cursor: "pointer",
                                                overflow: "hidden",  // Ensure the image doesn't overflow
                                                transition: "transform 0.3s ease-in-out",  // Smooth transition for scaling
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}  // Scale up on hover
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}   // Scale back to normal on leave
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

                                // Render account info if connected to the correct chain
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
