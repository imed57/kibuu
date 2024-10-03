import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Navbar from "components/navbar"; // Adjust path if needed
import { ethers } from "ethers";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

// ABI of the ERC20 token (standard ERC20 ABI for balanceOf and decimals)
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
];

const VAULT_ADDRESS = "0xFc4d2F28d5F4186155Dfcc6F9a16ee3079f68d46"; // Replace with the vault contract address
const TOKEN_ADDRESS = "0xC79915f6A159D847d922C36d16bC33708E054E1b"; // Replace with the token contract address

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = useState(true); // State to control the loader
    const [isContentVisible, setIsContentVisible] = useState(false); // State to fade in content
    const [balance, setBalance] = useState<string | null>(null);
    const [usdPrice, setUsdPrice] = useState<number | null>(null);
    const [usdAmount, setUsdAmount] = useState<string | null>(null);

    // Function to load balance
    const loadTokenBalance = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum); // MetaMask provider
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const tokenContract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);

            const balance = await tokenContract.balanceOf(VAULT_ADDRESS);
            const decimals = await tokenContract.decimals();

            const roundedBalance = Math.round(parseFloat(ethers.utils.formatUnits(balance, decimals)));
            setBalance(roundedBalance.toString());

            const response = await Moralis.EvmApi.token.getTokenPrice({
                address: TOKEN_ADDRESS,
                chain: EvmChain.BASE,
            });

            const priceData = response.toJSON();
            const price = parseFloat(priceData.usdPriceFormatted);
            setUsdPrice(price);

            const calculatedUsdAmount = (roundedBalance * price).toFixed(2);
            setUsdAmount(calculatedUsdAmount);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    // Set up Moralis initialization and load balance on component mount
    useEffect(() => {
        const initializeMoralis = async () => {
            try {
                if (!Moralis.Core.isStarted) {
                    await Moralis.start({
                        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE3YjdlMTVhLTYwY2UtNDNiOC1iOTlmLTUzNjBlYzFjNDM5ZiIsIm9yZ0lkIjoiNDEwMjY0IiwidXNlcklkIjoiNDIxNjAwIiwidHlwZUlkIjoiZjM5ZmZjZDQtOTYzMy00ZjM2LTg2NmEtZTJhMmE2Y2ZmOTIyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjc5MTA0OTksImV4cCI6NDg4MzY3MDQ5OX0.NLEofD1rIo2vqE8G-kie4K7i_tkl6kwNTJKbYoFbGRQ", // Replace with your Moralis API key
                    });
                }
                loadTokenBalance();
            } catch (error) {
                console.error("Error initializing Moralis:", error);
            }
        };

        initializeMoralis();

        // Set a timeout to hide the loader after 3 seconds
        const timer = setTimeout(() => {
            setIsLoading(false); // Hide the loader
            setIsContentVisible(true); // Show the content
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer); // Clear the timeout when component unmounts
    }, []);

    // Update token balance and USD price dynamically every second
    useEffect(() => {
        const interval = setInterval(() => {
            loadTokenBalance();
        }, 1000); // Re-fetch every second

        return () => clearInterval(interval); // Clean up interval
    }, []);

    return (
        <div>
            {isLoading ? (
                // Loader: full-screen video playing in a loop
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh", // Fullscreen height for loader
                        width: "100vw", // Fullscreen width for loader
                        position: "fixed", // Fix it to cover the entire screen
                        top: 0,
                        left: 0,
                        zIndex: 9999, // Make sure it's on top of everything
                    }}
                >
                    <img
                        src="/cc.jpg"
                        alt="bg"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        src="/kibuuu.gif"
                        alt="Loading animation"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "55%",
                            height: "55%",
                            objectFit: "contain",
                            zIndex: 10000,
                        }}
                    />
                </div>
            ) : (
                // Actual page content after the loader
                <>
                    <Navbar /> {/* Show Navbar after loading */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            width: "100vw",
                            flexDirection: "column",
                            opacity: isContentVisible ? 1 : 0, // Control visibility
                            transition: "opacity 1s ease-in", // Smooth fade-in
                        }}
                    >
                        <img
                            src="/bg-main.jpg"
                            alt="Background"
                            style={{
                                width: "100vw",
                                height: "100vh",
                                objectFit: "fill",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                fontFamily: 'Press Start 2P',
                                top: "32.5vh",
                                left: "48%",
                                fontSize: "4.6vh",
                                fontWeight: "bold",
                                color: "black",
                                transform: "translateX(-50%) rotate(-5deg)",
                            }}
                        >
                            {usdAmount !== null ? `${usdAmount}$` : "Loading..."}
                        </div>
                        {/* Social Media Icons */}
                        <div
                            style={{
                                position: "fixed",
                                bottom: "20px",
                                left: "20px",
                                display: "flex",
                                gap: "15px",
                            }}
                        >
                            <a
                                href="https://x.com/KibuOnEth_"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <img
                                    src="/twitter.png"
                                    alt="Twitter"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        transition: "transform 0.2s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                            </a>
                            <a
                                href="https://t.me/yourprofile"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <img
                                    src="/telegram.png"
                                    alt="Telegram"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        transition: "transform 0.2s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
